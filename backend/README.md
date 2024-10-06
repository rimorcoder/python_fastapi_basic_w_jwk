# Backend Ship API

This is a FastAPI-based API for managing and querying ship information. It provides endpoints for creating, reading, updating, and searching ship records.

## Features

- Valid OAuth access token is required
- CRUD operations for ship records
- Search functionality with optional filters
- Rate limiting
- In-memory database with sample data preloading

## Prerequisites

- Python 3.12+ (for local installation)
- pip (Python package manager)
- Docker (optional, for containerized deployment)
- Identity provider that supports OAuth

## Installation and Running

### Configure Environment Variables
1. Create a file called `.env`
2. Fill in `.env` with the following values:
    ```
    ISSUER = "https://your-Idp-endpoint"
    AUDIENCE = "AUDIENCE"
    ALGORITHM = "RS256"
    ```
### Local Installation

1. Clone the repository:
   ```
   git clone https://github.com/rimorcoder/python_fastapi_basic_w_jwk.git
   cd ship-api
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

5. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

   The API will be available at `http://127.0.0.1:8000`.

### Docker Installation

1. Clone the repository:
   ```
   git clone https://github.com/rimorcoder/python_fastapi_basic.git
   cd ship-api
   ```

2. Build the Docker image:
   ```
   docker build -t ship-api .
   ```

3. Run the Docker container:
   ```
   docker run -d --restart no -p 8000:8000 --name ship-api-container ship-api
   ```

   The API will be available at `http://localhost:8000`.

4. To stop the container:
   ```
   docker stop ship-api-container
   ```

5. To start the container again:
   ```
   docker start ship-api-container
   ```

Note: The `--restart no` flag in the `docker run` command ensures that the container does not automatically start when Docker Desktop launches. You'll need to manually start the container using the `docker start` command when you want to use the API.

   The API will be available at `http://localhost:8000`.

## Usage

### API Endpoints

- `GET /`: Root endpoint, returns a status message.
- `POST /ships/`: Create a new ship record.
- `GET /ships/{ship_id}`: Retrieve a specific ship by ID.
- `PUT /ships/{ship_id}`: Update a specific ship by ID.
- `GET /ships/`: Search for ships with optional filters.

### Examples

1. Create a new ship:
   ```
   curl -X POST "http://127.0.0.1:8000/ships/" -H "Content-Type: application/json" -d '{"id": "1", "name": "USS Enterprise", "type": "Aircraft Carrier", "launch_year": 1960, "country": "USA", "length": "342 m", "notable_events": ["Commissioned in 1961", "Decommissioned in 2017"]}'
   ```

2. Retrieve a ship:
   ```
   curl "http://127.0.0.1:8000/ships/1"
   ```

3. Search for ships:
   ```
   curl "http://127.0.0.1:8000/ships/?country=USA&type=Aircraft%20Carrier"
   ```

## Rate Limiting

The API has a rate limit of 5 requests per minute per IP address. If you exceed this limit, you'll receive a 429 (Too Many Requests) response.

## Data Persistence

The application uses an in-memory database, which means all data will be lost when the server is stopped. Sample data is loaded from `sample_ships.json` on startup.

## API Documentation

FastAPI provides automatic API documentation. After starting the server, you can access:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

These interfaces provide detailed information about each endpoint and allow you to interact with the API directly from your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).