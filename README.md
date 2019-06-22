# Divvy Analysis Summary

We downloaded quarterly/monthly trip CSV files from Divvy's website, cleaned up column names, combined them in a table, and loaded them into MySQL (17.4 million trips from 6/27/13 - 12/31/18). We then ran a number of SQL queries to create filtered data sets for our flask app. Using plotly.js, we created the following visualizations:
1) Total trips per year by customer type and gender
2) Average trips per weekday, split out by annual subscriber and short term day-trippers (called customers)
3) A rolling 30-day average of total trips, subscriber trips, and customer trips to illustate the seasonality of divvy ridership (less rides in the winter, more in the summer
4) A chart of the busiest divvy trips broken out by arrivals and departures (which appear to be mostly even by station)
5) A map with two views -- station location, and station activity (where the circle size corresponds with the number of trips at each station) -- with a popup for each circle that gives the name of the station, launch year, and number of docks.
