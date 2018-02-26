Time zone converter using Auth0 Webtasks
======
Installation
------

1. Obtain a Google API key to be used in the next steps. We will be using these two services:
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding/get-api-key) to convert addresses into geographic coordinates ( latitude/longitude pair)
- [Time Zone API](https://developers.google.com/maps/documentation/timezone/get-api-key) to provide the time zone information for a specific latitude/longitude pair

2. Run the following commands:

```
npm install -g wt-cli
wt init
wt create https://raw.githubusercontent.com/enbashi/webtask-timezone-converter/master/webtask-timezone-converter.js \
    --name timezone-converter \
    --capture \
    --parse-body \
    --secret GOOGLE_API_KEY=[KEY_FROM_STEP1]
```
3. Pass a `location` paramter to your unique Webtask URL you get in step 2. For example:
```
curl https://wt-e603451f3e0378d682110ee5d8c07386-0.run.webtask.io/timezone-converter?location=Bogota
```

Slack version
------
[Another version](webtask-slack-timezone-converter.md) of this converter can be used with Slack.
