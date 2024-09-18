# Looner Web 
Looner offers a unique social experience that bridges the physical and digital realms, similar to a Pokémon Go experience but for brand collaborations. Users can participate in real-world scavenger hunts and digital interactions within metaverses. The app rewards engagement with both physical and digital items, such as concert tickets, branded products, and NFTs.

## Quick start

1. Create .env file from .env.example

## Running the app

1. run `yarn install`
2. run `yarn dev`

or

1. run `yarn install`
2. run `yarn build`
3. run `yarn start`

### Optional setup using docker

1. run `docker build -t looner-web:latest -f Dockerfile .` **(only if running local, prod use ghcr image instead)**
1. run `docker-compose up -d`
