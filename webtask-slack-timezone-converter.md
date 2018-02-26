Slack time zone converter using Auth0 Webtasks
======

![image align="center"](https://d.pr/i/1y5Rb6+)

Installation
------

1. Obtain a Google API key to be used in the next steps. We will be using these two services:
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding/get-api-key) to convert addresses into geographic coordinates ( latitude/longitude pair)
- [Time Zone API](https://developers.google.com/maps/documentation/timezone/get-api-key) to provide the time zone information for a specific latitude/longitude pair

2. Go to [Slash Webtasks](https://webtask.io/slack) and follow the steps to install Slash Webtasks App 
3. Type `/wt make zimezone` in any Slack conversation. Replace `timezone` with any other name you want to call your new service.
4. Click the `Edit it in Webtask Editor` link to open the Webtask Editor in browser. Place the following code 

```
"use latest";
require('isomorphic-fetch');
const _ = require('lodash@4.8.2');
const moment = require('moment-timezone@0.5.14');

module.exports = (ctx, cb) => {
  
// Request paramter
const location = ctx.body.text;
if(!location){
  cb(null, `Location is not provided`);
}

const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&sensor=false&key=${ctx.secrets.GOOGLE_API_KEY}`;
const timezoneUrl = (lat, lng) => `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=1331161200&sensor=false&key=${ctx.secrets.GOOGLE_API_KEY}`;
  
  // convert addresses into geographic coordinates
  fetch(geocodeUrl)
  .then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  }).then(data => {
    if(!data.results.length){
      throw new Error("No matching results");
    }
    
    // parse response
    const {lat, lng} = _.get(_.head(data.results), 'geometry.location');
    return {lat, lng};
  })
  .then(({lat, lng}) => {
    //provide the time zone information for a specific latitude/longitude pair
    fetch(timezoneUrl(lat, lng))
    .then(response => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(data => {
      const {timeZoneId} = data;
      
      // format local date/time using the timeZoneId
      const localTime = moment().tz(timeZoneId).format('MMMM Do YYYY, h:mm:ss a');
      
      cb(null, { text: `Local time in ${location} is ${localTime}` });
    })
    .catch(e => {
      console.error(e);
      cb(null, { text: `Error retrieving local time` });
    });
  })
  .catch(e => {
    cb(null, { text: `Error retrieving local time` });
  });
}
```
5. Click the key icon and add a secret with key `GOOGLE_API_KEY` and the value from step 1.
6. Go back to Slack and type `/wt timezone [LOCATION]` where LOCATION can be a full address, city name, zipcode, state or country (for countries with one timezone like Nepal or Colombia)
