# Transit Advice
The goal of this project is to provide a public, open-source system to generate route and real-time advice for transit systems.

## Local Setup
Requirements: latest version of nodejs must be installed

1. Clone the Repo
2. run npm install in both the /client and /server folders
3. run npm start in both the /client and /server folders from separate terminals
4. In the /client terminal - press w to open the browser
5. From the browser navigate to the Server Config page in the menu
6. Choose an agency and route to get advice

Please note that by default npm start on /server will start 2 servers (one on 8080 and one on 8079), you can switch between the from the dropdown in the header.

## Seting up a permanent instance
1. Clone the repo to a server
2. run npm install in both the /client and /server folders
3. The server can be started with tsc && node dist/server.js 8080 config.json
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

## Current Features
- Nextbus datasource (route, vehicle locations, stops)
- Toronto stoplights and cameras
- Map, Journey Chart, Vehicle chart
- Advice (too many lights, not enough lights with transit priority)

## Issues
- Distance along route is currently from stop 0 -> bus location, doesn't take into account length of route (problems with routes that are not a stright line)
- Stop lights and camera's only for Toronto