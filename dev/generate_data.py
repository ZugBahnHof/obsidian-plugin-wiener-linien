import json
from csv import DictReader
from pprint import pprint


def main():
	"""Transform csv data into different needed json files.

	Needed formats:
	- mapping of rbl/stop_id to line name and station name
	- list of stations (rbl/stop_id and name) per line
	"""

	stations_per_line = {}
	stops = {}

	with open("../data/wienerlinien-ogd-linien.csv") as f:
		reader = DictReader(f, delimiter=";")

		for row in reader:
			stations_per_line[row["LineID"]] = {
				"name": row["LineText"],
				"stations": [],
			}

	with open("../data/wienerlinien-ogd-haltepunkte.csv") as f:
		reader = DictReader(f, delimiter=";")

		for row in reader:
			stops[row["StopID"]] = row

	with open("../data/wienerlinien-ogd-fahrwegverlaeufe.csv") as f:
		reader = DictReader(f, delimiter=";")

		for row in reader:
			station = {
				"id": row["StopID"],
				"name": stops.get(row["StopID"], {}).get("StopText")
			}

			if stations_per_line.get(row["LineID"]) is None:
				continue

			if len(list(filter(lambda s: station["id"] == s["id"], stations_per_line[row["LineID"]]["stations"]))) == 0:
				stations_per_line[row["LineID"]]["stations"].append(station)

	with open("../data/stations-per-line.json", "w") as f:
		f.write(json.dumps(stations_per_line))


if __name__ == "__main__":
	main()
