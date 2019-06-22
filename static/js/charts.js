// Calculate a rolling average for an array
function rollingAverage(arr, windowPeriod = 10) {
    // rolling averages array to return
    var averages = [];

    // Loop through all of the data
    for (var i = 0; i < arr.length - windowPeriod; i++) {
        // calculate the average for a window of data
        var sum = 0;
        for (var j = 0; j < windowPeriod; j++) {
            sum += arr[i + j];
        }
        // calculate the average and push it to the averages array
        averages.push(sum / windowPeriod);
    }
    return averages;
}


// function buildPlot() {
function buildPlots() {
    // Annual rides chart
    var url = `/annual_trips`;
    d3.json(url).then(function (annualData) {
        // console.log(annualData);

        var years = annualData.years;
        var all_trips = annualData.all_trips;
        var subscribers = annualData.subscribers;
        var customers = annualData.customers;
        var women = annualData.women;
        var men = annualData.men;

        var trace1 = {
            x: years,
            y: all_trips,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'All Rides',
            marker: {
                color: '#90CCF4'
              },
              line: {
                color: '#90CCF4'
              }
        };
        var trace2 = {
            x: years,
            y: subscribers,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Subscribers',
            marker: {
                color: '#F78888'
              },
              line: {
                color: '#F78888'
              }
        };
        var trace3 = {
            x: years,
            y: customers,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Customers',
            marker: {
                color: '#F3D250'
              },
              line: {
                color: '#F3D250'
              }
        };
        var trace4 = {
            x: years,
            y: women,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Women',
            marker: {
                color: '#5DA2D5'
              },
              line: {
                color: '#5DA2D5'
              }
        };
        var trace5 = {
            x: years,
            y: men,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Men',
            marker: {
                color: '#CCCCCC'
              },
              line: {
                color: '#CCCCCC'
              }
        };

        var data = [trace1, trace2, trace3, trace4, trace5];

        var layout = {
            title: "Annual Divvy Rides: 6/27/13 - 12/31/2018",
            showlegend: true,
            legend: { "orientation": "h" },
            yaxis: { title: "Rides (millions)" }
        }

        Plotly.plot("annual", data, layout);
    })

    // // Rolling rides chart
    // var urlDaily = `/daily_trips`;
    // d3.json(urlDaily).then(function (dailyData) {
    //         // console.log(dailyData);

    //     var dates = dailyData.dates,
    //     var all_trips = dailyData.all_trips,
    //     var subscribers = dailyData.subscribers

    //     var trace1

    // })

    // Weekday averages charts
    var urlWeekday = '/weekday_avg';
    d3.json(urlWeekday).then(function (weekdayData) {
        // console.log(weekdayData);

        // var weekday = data.map(row => row.weekday);
        // var avg_trips = data.map(row => row.avg_trips)
        var weekdays = weekdayData.weekdays;
        var avg_trips = weekdayData.avg_trips;

        var trace1 = {
            x: weekdays,
            y: avg_trips,
            type: "bar",
            name: "All Rides",
            marker: {
                color: '#90CCF4'
              }
        };

        var data = [trace1];

        var layout = {
            title: "Average Rides Per Weekday",
            xaxis: {
                tickangle: -45,
                tickvals: [0, 1, 2, 3, 4, 5, 6],
                ticktext: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            }
        };

        Plotly.plot("weekday", data, layout);

        // Stacked weekday bar
        var avg_subscribers = weekdayData.avg_subscribers;
        var avg_customers = weekdayData.avg_customers;

        var trace1 = {
            x: weekdays,
            y: avg_subscribers,
            type: "bar",
            name: "Subscribers",
            marker: {
                color: '#F78888'
              }
        };

        var trace2 = {
            x: weekdays,
            y: avg_customers,
            type: "bar",
            name: "Customers",
            marker: {
                color: '#F3D250'
              }
        };

        var data = [trace1, trace2];

        var layout = {
            barmode: "stack",
            title: "Average Rides Per Weekday",
            xaxis: {
                tickangle: -45,
                tickvals: [0, 1, 2, 3, 4, 5, 6],
                ticktext: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            showlegend: true,
            legend: {
                x: 0.2,
                y: 1.1,
                "orientation": "h"
            }
        };

        Plotly.plot("weekday2", data, layout);
    })

    // Rolling average trips
    var urlRoll = '/daily_trips';
    d3.json(urlRoll).then(function (rollData) {
        // console.log(rollData);

        // Configure parseTime variable to return a new date object from a string
        var parseTime = d3.timeParse("%Y-%m-%d");

        var dates = rollData.dates.map(parseTime);
        var rollTrips = rollData.all_trips;
        var rollSubs = rollData.subscribers;
        var rollCust = rollData.customers;
        var rollingPeriod = 30;
        var rollingAvgTrips = rollingAverage(rollTrips, rollingPeriod);
        var rollingAvgSubs = rollingAverage(rollSubs, rollingPeriod);
        var rollingAvgCust = rollingAverage(rollCust, rollingPeriod);
        var startDate = dates[0];
        var endDate = dates[dates.length - 1];

        // console.log(startDate);
        // console.log(endDate);

        var trace3 = {
            type: "scatter",
            mode: "lines",
            name: "All Rides",
            x: dates.slice(0, dates.length - rollingPeriod),
            y: rollingAvgTrips,
            fill: 'tonexty',
            line: {
                color: '#90CCF4'
              }
        };

        var trace2 = {
            type: "scatter",
            mode: "lines",
            name: "Subscribers",
            x: dates.slice(0, dates.length - rollingPeriod),
            y: rollingAvgSubs,
            fill: 'tonexty',
            line: {
                color: '#F78888'
              }
        };

        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: "Customers",
            x: dates.slice(0, dates.length - rollingPeriod),
            y: rollingAvgCust,
            fill: 'tozeroy',
            line: {
                color: '#F3D250'
              }
        };

        var data = [trace1, trace2, trace3];

        var layout = {
            title: `Ride Seasonality`,
            xaxis: {
                autorange: true,
                range: [startDate, endDate],
                rangeslider: {range: [startDate, endDate]},
                type: "date",
                showticklabels: true,
                tickangle: 'auto'
            },
            yaxis: {
                autorange: true,
                type: "linear",
                title: "30-day Average"
            }
        };

        Plotly.plot("rolling", data, layout);
    })

    // Busiest stations chart
    var urlActivity = '/station_activity';
    d3.json(urlActivity).then(function (activityData) {
        // console.log(activityData);

        var id = activityData.id;
        var station_name = activityData.name;
        var arrivals = activityData.arrivals;
        var departures = activityData.departures;
        var topN = 30

        var trace1 = {
            x: arrivals.slice(0, topN),
            y: station_name.slice(0, topN),
            type: "bar",
            orientation: "h",
            name: "Arrivals",
            marker: {
                color: '#5DA2D5'
              }
        };

        var trace2 = {
            x: departures.slice(0, topN),
            y: station_name.slice(0, topN),
            type: "bar",
            orientation: "h",
            name: "Departures",
            marker: {
                color: '#90CCF4'
              }
        };

        var data = [trace1, trace2];

        var layout = {
            barmode: "stack",
            height: 700,
            title: "Busiest Divvy Stations",
            xaxis: {
                title: "Total Rides 6/27/13 - 12/31/18"
            },
            yaxis: {
                autorange: "reversed",
                automargin: true,
                type: "category"
            },
            showlegend: true,
            legend: {
                "orientation": "h"
            }
        };

        Plotly.plot("activity", data, layout);
    })

};

buildPlots();