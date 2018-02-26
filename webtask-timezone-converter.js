"use latest";
require('isomorphic-fetch');
const _ = require('lodash@4.8.2');
const moment = require('moment-timezone@0.5.14');

module.exports = (ctx, cb) => {
  
// Request paramter
const {location} = ctx.data;

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
