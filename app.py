from flask import Flask, Response, render_template, jsonify
import pandas as pd
from sqlalchemy import create_engine
import datetime as dt
from datetime import datetime, time

database = {'user': 'divvy', 
            'password': '1234', 
            'port': '3306',
            'host': 'localhost',
            'database': 'divvy_db' }

db_engine = create_engine("""mysql://%s:%s@%s:%s/%s
    """ % (database["user"], database["password"], database["host"], database["port"], database["database"]),
    echo=False)

# Flask "app" Setup
app = Flask(__name__)


# create route that renders index.html template
@app.route("/")
def index():
    return render_template('index.html')

# Alt route for calendar year rides 
@app.route("/annual_trips")
def annual():
    annual_df = pd.read_sql("""
SELECT 		YEAR(date) as "year", SUM(all_trips) as "all_trips", SUM(subscribers) as "subscribers", SUM(customers) as "customers",
			SUM(women) as "women", SUM(men) as "men"
FROM		daily_trips
GROUP BY	YEAR(date);
    """, db_engine)
    
    # Format the data to send as json
    annual_data = {
        "years": annual_df["year"].tolist(),
        "all_trips": annual_df["all_trips"].tolist(),
        "subscribers": annual_df["subscribers"].tolist(),
        "customers": annual_df["customers"].tolist(),
        "women": annual_df["women"].tolist(),
        "men": annual_df["men"].tolist()
    }
    return jsonify(annual_data)


# Alt route for daily trips 
@app.route("/daily_trips")
def trips():
    trips_df = pd.read_sql("""
    SELECT DATE_FORMAT(date,'%%Y-%%m-%%d') as 'date', all_trips, subscribers, women, men, customers
    FROM daily_trips;
    """, db_engine)
    
    # Format the data to send as json
    trips_data = {
        "dates": trips_df["date"].tolist(),
        "all_trips": trips_df["all_trips"].tolist(),
        "subscribers": trips_df["subscribers"].tolist(),
        "customers": trips_df["customers"].tolist(),
        "women": trips_df["women"].tolist(),
        "men": trips_df["men"].tolist()  
    }
    return jsonify(trips_data)
    
    # trips_json = trips_df.to_json(orient="records")
    # return Response(response=trips_json,status=200,mimetype="application/json")


# Route for weekday averages
# @app.route("/weekday_avg2")
# def weekdays2():
#     weekdays2_df = pd.read_sql("""
# SELECT 		WEEKDAY(date) as "weekday", ROUND(AVG(all_trips)) as "avg_trips", ROUND(AVG(subscribers)) as "avg_subscribers", 
# 			ROUND(AVG(customers)) as "avg_customers"
# FROM		daily_trips
# GROUP BY	WEEKDAY(date);
#     """, db_engine)
#     weekdays2_json = weekdays2_df.to_json(orient="records")
#     return Response(response=weekdays2_json,status=200,mimetype="application/json")


# Alt route for weekday averages
@app.route("/weekday_avg")
def weekdays():
    weekdays_df = pd.read_sql("""
SELECT 		WEEKDAY(date) as "weekday", ROUND(AVG(all_trips)) as "avg_trips", ROUND(AVG(subscribers)) as "avg_subscribers", 
			ROUND(AVG(customers)) as "avg_customers"
FROM		daily_trips
GROUP BY	WEEKDAY(date);
    """, db_engine)
    # Format the data to send as json
    weekdays_data = {
        "weekdays": weekdays_df["weekday"].tolist(),
        "avg_trips": weekdays_df["avg_trips"].tolist(),
        "avg_subscribers": weekdays_df["avg_subscribers"].tolist(),
        "avg_customers": weekdays_df["avg_customers"].tolist()
    }
    return jsonify(weekdays_data)


# Route for station activity
@app.route("/station_activity")
def activity():
    activity_df = pd.read_sql("""
SELECT * FROM station_activity
ORDER BY combined DESC;
    """, db_engine)

# Format the data to send as json
    activity_data = {
        "id": activity_df["id"].tolist(),
        "name": activity_df["name"].tolist(),
        "latitude": activity_df["latitude"].tolist(),
        "longitude": activity_df["longitude"].tolist(),
        "departures": activity_df["departures"].tolist(),
        "arrivals": activity_df["arrivals"].tolist(),
        "combined": activity_df["combined"].tolist(),
        "docks": activity_df["docks"].tolist(),
        "launch": activity_df["launch"].tolist()
    }
    return jsonify(activity_data)

# Route for station map
@app.route("/station_map")
def map():
    map_df = pd.read_sql("""
SELECT 	id, name, combined, docks, launch, 
		CONCAT(latitude, ', ', longitude) as "coordinates"
FROM 	station_activity;
    """, db_engine)
    map_json = map_df.to_json(orient="records")
    return Response(response=map_json,status=200,mimetype="application/json")

# @app.route("/stations") - FROM DAVE
# def home():
#     df = pd.read_sql("""
# select stationName, latitude, longitude, totalDocks
# from stations
#     """, db_engine)
#     data = df.to_json(orient="records")
#     return Response(response=data,status=200,mimetype="application/json")


if __name__ == "__main__":
    app.run(debug=True)