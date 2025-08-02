@echo off
setlocal

:: Check if Yarn is installed
where yarn >nul 2>nul
if %errorlevel% neq 0 (
    echo Yarn is not installed. Installing now...
    npm install -g yarn
) else (
    echo Yarn is already installed.
)

echo Installing root dependencies with Yarn...
yarn install

echo Navigating to the server directory...
cd server

echo Installing server dependencies with Yarn...
yarn install

echo Starting the server...
start yarn start  :: Run in a new Command Prompt window

cd ..

echo Starting the root project...
yarn start

endlocal
