# Search for the best office to go

The idea of this project is to choose between Amsterdam, Budapest and Madrid. Weather and Flight price are taking into consideration.

## Lessons learned

* No matter how much experience you have as a developer, you will always end-up writing a lot of stuff and then throwing away.
* Always try to write better errors. This Accuweather API is funny thing. Took me a while to figure it out an error that was actualy a trial account limitation

## Items that could and should be improved

* Calculate the best price with best weather between all options in all cities
* Extract city name strings to constants and maybe change the code to make it easier to add other cities
* Write tests at least for the core funtionalities like the `useBestOffice`, `useRequestOfficeflights` and `useRequestofficeweather` hooks
* Write a error state if the user denies the localization permission

## Limitations

* The weather API has a daily limit that is very low.