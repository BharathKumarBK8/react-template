# Project Setup Guide

## Prerequisites
- **Node.js**: Version 18 or above
- **Keycloak**: Version 26 or above
- **Docker** (optional): If using Docker, ensure it is installed.

## Keycloak Configuration
Set the Keycloak configuration in `./src/env.ts`:
```ts
AUTH.URL = "<keycloak_url>";
AUTH.REALM = "<keycloak_realm>";
AUTH.CLIENT_ID = "<keycloak_client_id>";
```

## Running the Project
### macOS
Execute the following command in the terminal:
```sh
sh start.sh
```

### Windows
Run the following command in the Command Prompt:
```cmd
start.bat
```

## Running with Docker
To build and start the project using Docker, run:
```sh
docker-compose up --build
```

To stop the running containers, use:
```sh
docker-compose down
```