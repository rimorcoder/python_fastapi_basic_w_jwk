from fastapi import FastAPI, HTTPException, Query, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from collections import defaultdict
import time
import json
import logging
from contextlib import asynccontextmanager
from oauth_validator import get_current_user
import os
from dotenv import load_dotenv

# Load Env
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Data model
class NotableEvent(BaseModel):
    event: str

class Ship(BaseModel):
    id: str
    name: str
    type: str
    launch_year: int
    country: str
    length: str
    notable_events: List[str]

# In-memory database
ships_db = {}

# Startup and shutdown processes. 
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup event
    try:
        with open('sample_ships.json', 'r') as file:
            sample_ships = json.load(file)
        for ship_data in sample_ships:
            ship = Ship(**ship_data)
            ships_db[ship.id] = ship
        logging.info("Data preloaded")
    except Exception as e:
        logging.error(f"startup error: {e}")
    
    yield
    # shutdown event

# Initialze FastAPI with lifespan (startup/shutdown)
app = FastAPI(lifespan=lifespan)

# CORS
default_allow_origins = ["*"]
app.add_middleware(
       CORSMiddleware,
       allow_origins=os.getenv("ALLOW_ORIGINS", default_allow_origins) ,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

# Rate Limit setup
# Store for tracking request counts
request_counts = defaultdict(lambda: {"count": 0, "reset_time": 0})

# Rate limit configuration
RATE_LIMIT = int(os.getenv("RATE_LIMIT"))
RATE_LIMIT_PERIOD = int(os.getenv("RATE_LIMIT_PERIOD")) 

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = time.time()

    # Reset count if the time period has passed
    if current_time > request_counts[client_ip]["reset_time"]:
        request_counts[client_ip] = {"count": 0, "reset_time": current_time + RATE_LIMIT_PERIOD}

    request_counts[client_ip]["count"] += 1

    if request_counts[client_ip]["count"] > RATE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={"error": "Rate limit exceeded. Please try again later."}
        )

    response = await call_next(request)
    return response

# Routes
@app.get("/")
async def root():
    return {"message": "Online"}

@app.post("/ships/", response_model=Ship)
async def create_ship(ship: Ship, current_user: str = Depends(get_current_user)):
    logging.info("POST")
    logging.info(ship)
    if ship.id in ships_db:
        raise HTTPException(status_code=400, detail="Ship with this ID already exists")
    ships_db[ship.id] = ship
    return ship

@app.get("/ships/{ship_id}", response_model=Ship)
async def read_ship(ship_id: str, current_user: str = Depends(get_current_user)):
    logging.info(f"GET {ship_id}")
    if ship_id not in ships_db:
        raise HTTPException(status_code=404, detail="Ship not found")
    return ships_db[ship_id]

@app.put("/ships/{ship_id}", response_model=Ship)
async def update_ship(ship_id: str, ship: Ship, current_user: str = Depends(get_current_user)):
    logging.info(f"PUT {ship_id}")
    if ship_id not in ships_db:
        raise HTTPException(status_code=404, detail="Ship not found")
    ships_db[ship_id] = ship
    return ship

@app.delete("/ships/{ship_id}")
async def delete_ship(ship_id: str, current_user: str = Depends(get_current_user)):
    logging.info(f"DELETE {ship_id}")
    if ship_id not in ships_db:
        raise HTTPException(status_code=404, detail="Ship not found")
    ships_db.pop(ship_id)
    return

@app.get("/ships/", response_model=List[Ship])
async def search_ships(
    name: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    current_user: str = Depends(get_current_user)
):
    logging.info(f"GET {name} || {type} || {country}")
    results = []
    for ship in ships_db.values():
        if (name is None or name.lower() in ship.name.lower()) and \
           (type is None or type.lower() in ship.type.lower()) and \
           (country is None or country.lower() in ship.country.lower()):
            results.append(ship)
    return results