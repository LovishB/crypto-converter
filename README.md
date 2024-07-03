# crypto-converter
The crypto-convertor project is a web application designed to provide real-time conversion rates for cryptocurrencies to various fiat currencies. It fetches current market data using external APIs, allowing users to quickly and accurately convert cryptocurrency values to their preferred fiat currency. This tool also intracts with real time market data for cryptocurrency enthusiasts alike.

## Table of Contents

- [Getting Started](#getting-started)
- [Infrastructure](#infrastructure)
- [Features](#features)
- [Technologies Used](#technologies-used)

## Infrastructure
This Application is developed using Microservice Infrastructure using NATS and Nest.js
For client side, HBS Template engine to render response from backend

## Getting Started
1) Clone the repository in your local system
2) run npm-install
3) add your Coin Gecko and Supabase API Keys in .env
4) run docker compose build to create docker images
5) run docker compose up to run the container
6) access your web application on port 3000

## Technologies Used

- Frameworks - Nest.js, Nats Messaging Broker, Docker
- Libs - CoinGecko, Supabase
