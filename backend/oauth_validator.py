from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
import httpx
from cachetools import TTLCache
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import base64
import json
import time
from cachetools import TTLCache
import os

# Replace these with your actual values
ALGORITHM = os.getenv("ALGORITHM")
ISSUER = os.getenv("ISSUER")
AUDIENCE = os.getenv("AUDIENCE")
OPENID_CONFIG_URL = f"{ISSUER}/.well-known/openid-configuration"

# Cache to store the JWKs (JSON Web Key Set)
jwks_cache = TTLCache(maxsize=1, ttl=3600)  # Cache for 1 hour

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"{ISSUER}/authorize",
    tokenUrl=f"{ISSUER}/oauth/token",
)

async def get_jwks():
    if "jwks" not in jwks_cache:
        async with httpx.AsyncClient() as client:
            openid_config = await client.get(OPENID_CONFIG_URL)
            openid_config.raise_for_status()
            jwks_uri = openid_config.json()["jwks_uri"]
            jwks_response = await client.get(jwks_uri)
            jwks_response.raise_for_status()
            jwks_cache["jwks"] = jwks_response.json()
    return jwks_cache["jwks"]

def base64url_decode(input):
    rem = len(input) % 4
    if rem > 0:
        input += '=' * (4 - rem)
    return base64.urlsafe_b64decode(input)

def get_public_key(kid):
    jwks = jwks_cache["jwks"]
    for key in jwks['keys']:
        if key['kid'] == kid:
            if key['kty'] == 'RSA':
                n = int.from_bytes(base64url_decode(key['n']), byteorder='big')
                e = int.from_bytes(base64url_decode(key['e']), byteorder='big')
                return rsa.RSAPublicNumbers(e, n).public_key(default_backend())
    raise ValueError(f"Public key not found for kid: {kid}")

def decode_jwt(token):
    try:
        header_segment, payload_segment, crypto_segment = token.split('.')
    except ValueError:
        raise ValueError('Not enough segments')
    
    header = json.loads(base64url_decode(header_segment))
    payload = json.loads(base64url_decode(payload_segment))
    signature = base64url_decode(crypto_segment)
    
    return header, payload, signature

def verify_signature(token, public_key):
    header_segment, payload_segment, _ = token.split('.')
    message = f"{header_segment}.{payload_segment}".encode()
    
    try:
        public_key.verify(
            base64url_decode(token.split('.')[2]),
            message,
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        return True
    except:
        return False

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        header, payload, _ = decode_jwt(token)
        
        if header['alg'] != ALGORITHM:
            raise credentials_exception
        
        await get_jwks()
        
        public_key = get_public_key(header['kid'])
        
        if not verify_signature(token, public_key):
            raise credentials_exception
        
        current_time = int(time.time())
        if payload.get('iss') != ISSUER:
            raise credentials_exception
        if payload.get('aud') != AUDIENCE:
            raise credentials_exception
        if payload.get('exp', 0) < current_time:
            raise credentials_exception
        if payload.get('nbf', 0) > current_time:
            raise credentials_exception
        
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except (ValueError, KeyError):
        raise credentials_exception
    return username