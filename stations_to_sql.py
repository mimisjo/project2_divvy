import pandas as pd
import requests
import json
from sqlalchemy import create_engine

database = {'user': 'divvy', 
            'password': '1234', 
            'port': '3306',
            'host': 'localhost',
            'database': 'divvy_db' }

"""
## CODE TO CREATE NEW MYSQL USER (Run in MySQL workbench while signed into root)
CREATE USER 'divvy'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON * . * TO 'divvy'@'localhost';
"""

"""
## CODE TO GET MYSQL playing nice with python (Run in terminal w/ PythonData enviroment)
export PATH=$PATH:/usr/local/mysql/bin
pip install mysqlclient

"""

db_engine = create_engine("""mysql://%s:%s@%s:%s/%s
    """ % (database["user"], database["password"], database["host"], database["port"], database["database"]),
    echo=False)

# Get data from url
url = "https://feeds.divvybikes.com/stations/stations.json"
response = requests.get(url).json()
stations = pd.DataFrame(response['stationBeanList'])
stations["lastCommunicationTime"] = pd.to_datetime(stations["lastCommunicationTime"])

stations.to_sql("stations", con=db_engine, if_exists="replace", chunksize=20000)
