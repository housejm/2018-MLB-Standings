# 2018 MLB Standings

This single page React app pulls the 2018 regular season standings data from https://api.mobileqa.mlbinfra.com/api/interview/v1/records and sorts/displays the data by league, division and in order from first to last place.

## Installation
The following instruction assume that [npm](https://www.npmjs.com/) and git are installed locally.

### Prerequisites

Clone the application locally by running,
```
git clone https://github.com/housejm/2018-MLB-Standings.git
```

Navigate to the 2018-MLB-Standings directory and run
```
npm install
```
This installs required dependencies.

## Deployment
The following instruction assume that [npm](https://www.npmjs.com/) is installed.

### Development: 
Navigate to the application directory and run
```
npm start
```
This runs the app in development mode. 
Open http://localhost:3000 to view the application.

### Production:
Navigate to the application directory and run
```
npm run build
```
This builds the application for production deployment in the **build** directory.

After the build is complete run,
```
serve -s build
```

If the above command is not found, run
```
npm install -g serve
```
Try running the **serve** command again.

The app will be running at http://localhost:5000

Optionally the app can be run at a custom port by running.
```
serve -s build -l <port>   
``` 
For example, "serve -s build -l 4000" will have the application running at http://localhost:4000

Other deployment options can be found at https://facebook.github.io/create-react-app/docs/deployment

## Live App
This application is also running on Google Cloud App Engine at: https://matt-house-2018-mlb-standings.appspot.com/

## Authors
* **Matt House** - [email](mailto:j.matt.house@gmail.com)








