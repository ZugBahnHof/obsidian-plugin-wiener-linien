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

	line_directions = {}

	with open("../data/wienerlinien-ogd-fahrwegverlaeufe.csv") as f:
		reader = DictReader(f, delimiter=";")

		for row in reader:
			station = {
				"id": row["StopID"] or "-1",
				"name": stops.get(row["StopID"], {}).get("StopText") or "Unknown Station",
				"direction": row["Direction"] or "unknown",
			}

			if stations_per_line.get(row["LineID"]) is None:
				continue

			if len(list(filter(lambda s: station["id"] == s["id"], stations_per_line[row["LineID"]]["stations"]))) == 0:
				# Only add a station once
				stations_per_line[row["LineID"]]["stations"].append(station)

			if line_directions.get(row["LineID"]) is None:
				line_directions[row["LineID"]] = {}

			line_directions[row["LineID"]][row["Direction"]] = stops.get(row["StopID"], {}).get("StopText")

	for line_key in stations_per_line.keys():
		for station in stations_per_line[line_key]["stations"]:
			station["direction"] = line_directions[line_key].get(station["direction"], "unknown")

	with open("../data/stations-per-line.json", "w") as f:
		f.write(json.dumps(stations_per_line))


if __name__ == "__main__":
	main()
