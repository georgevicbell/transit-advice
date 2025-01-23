# Transit Advice
The goal of this project is to provide a public, open-source system to generate route and real-time advice for transit systems.

## Local Setup
Requirements: latest version of nodejs must be installed

1. Clone the Repo
2. Run `npm install` in both the /client and /server folders
3. Run `npm start` in both the /client and /server folders from separate terminals
4. Add your google maps key to /client/app/index.tsx
4. In the /client terminal - press w to open the browser
5. From the browser navigate to the Server Config page in the menu
6. Choose an agency and route to get advice

Please note that by default `npm start` on /server will start 2 servers (one on 8080 and one on 8079), you can switch between the from the dropdown in the header.

## Seting up a permanent instance
1. Clone the repo to a server
2. Run `npm install` in both the /client and /server folders
3. The server can be started with `tsc && node dist/server.js 8080 config.json`
    - config.json should be unique for each route you are running, and will be created once you click save on the Server Config page
    - port needs to be unique
4. In the /client folder you will need to publish the expo project to a webserver to host it
5. Add the list of servers that you setup in 3 to servers.json
6. Load each server from the dropdown in the website and fill out the Server Config page

## Development
We are looking for the following features to be implemented over time, please get in touch if you are interested.
- Implementation of GTFS for routes, stops and realtime vehicle info
- Implementation of vehicle utilization (number of riders)
- Implementation of stoplight info from other sources (openmaps?)
- Implementation of camera's from other sources
- Implementation of staffing functions (hours remaining to overtime, break requirements, etc.)
- New graphs/charts
- Addition of short turn routes
- Addition of slow/stop zones
- Integration with common backends (ability to automatically action items)
- More Advice
    - Go slow, short turn, stop, more buses needed in schedule, schedule, headway, non-functional transit priority, lanes
- Scoring of routes
- Global tracking of servers that are running
- More config and visualization options

## Current Features
- Nextbus datasource (route, vehicle locations, stops)
- Toronto stoplights and cameras
- Map, Journey Chart, Vehicle chart
- Advice (too many lights, not enough lights with transit priority)

## Issues
- Distance along route is currently from stop 0 -> bus location, doesn't take into account length of route (problems with routes that are not a stright line)
- Stop lights and camera's only for Toronto
- Some datasources may throttle API calls based on IP - meaning only a few servers can run on any machine/ip

## Design
- Each server is designed to collect and analyze route and vehicle data in realtime, a websocket is used to stream data to webclients
- There are five main datasets - all calculation is done serverside at the moment
    - serverConfig - agencyList, routeList and config - as more datasets are added this will be merged into a more succinct dataset
    - routeConfig - stops, route geometry, cameras, stoplights, coloring, along with some calculated fields - distances between stops, buffered route
    - vehicleList - current list of vehicles, and some calculated fields - distance between vehicles, time between vehicles
    - history - this is all the vehicle updates received in order, and some calculated fields - distance between vehicles, time between vehicles
    - advice - this is advice and is split into two categories - route advice, and vehicle advice
- On startup we get the serverconfig followed by the routeconfig, we then load vehicleList on a 10 second loop
- History is maintained for 12 hours, then optionally saved to disk
