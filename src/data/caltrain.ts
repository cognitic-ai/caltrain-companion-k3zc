export type Station = {
  id: string;
  name: string;
  zone: number;
  latitude: number;
  longitude: number;
};

export type TrainType = "Local" | "Limited" | "Express";

export type Train = {
  id: string;
  type: TrainType;
  direction: "Northbound" | "Southbound";
  departureTime: string;
  stops: string[];
};

export const STATIONS: Station[] = [
  { id: "sf", name: "San Francisco", zone: 1, latitude: 37.7766, longitude: -122.3946 },
  { id: "22nd", name: "22nd Street", zone: 1, latitude: 37.7571, longitude: -122.3929 },
  { id: "bayshore", name: "Bayshore", zone: 1, latitude: 37.7091, longitude: -122.4018 },
  { id: "sbruno", name: "South San Francisco", zone: 2, latitude: 37.6566, longitude: -122.4081 },
  { id: "sanbruno", name: "San Bruno", zone: 2, latitude: 37.6308, longitude: -122.4113 },
  { id: "millbrae", name: "Millbrae", zone: 2, latitude: 37.5997, longitude: -122.3869 },
  { id: "broadway", name: "Broadway", zone: 2, latitude: 37.5867, longitude: -122.3625 },
  { id: "burlingame", name: "Burlingame", zone: 2, latitude: 37.5792, longitude: -122.3451 },
  { id: "sanmateo", name: "San Mateo", zone: 2, latitude: 37.5684, longitude: -122.3239 },
  { id: "haywardpark", name: "Hayward Park", zone: 2, latitude: 37.5528, longitude: -122.3091 },
  { id: "hillsdale", name: "Hillsdale", zone: 3, latitude: 37.5378, longitude: -122.2972 },
  { id: "belmont", name: "Belmont", zone: 3, latitude: 37.5206, longitude: -122.2756 },
  { id: "sancarlos", name: "San Carlos", zone: 3, latitude: 37.5071, longitude: -122.2604 },
  { id: "redwoodcity", name: "Redwood City", zone: 3, latitude: 37.4853, longitude: -122.2316 },
  { id: "menlopark", name: "Menlo Park", zone: 3, latitude: 37.4545, longitude: -122.1824 },
  { id: "paloalto", name: "Palo Alto", zone: 3, latitude: 37.4429, longitude: -122.1649 },
  { id: "californiaave", name: "California Ave", zone: 4, latitude: 37.4293, longitude: -122.1425 },
  { id: "sanantonio", name: "San Antonio", zone: 4, latitude: 37.4074, longitude: -122.1071 },
  { id: "mountainview", name: "Mountain View", zone: 4, latitude: 37.3947, longitude: -122.0761 },
  { id: "sunnyvale", name: "Sunnyvale", zone: 4, latitude: 37.3783, longitude: -122.0308 },
  { id: "lawrence", name: "Lawrence", zone: 5, latitude: 37.3703, longitude: -121.9972 },
  { id: "santaclara", name: "Santa Clara", zone: 5, latitude: 37.3529, longitude: -121.9365 },
  { id: "collegepk", name: "College Park", zone: 5, latitude: 37.3422, longitude: -121.9148 },
  { id: "sanjose", name: "San Jose Diridon", zone: 6, latitude: 37.3297, longitude: -121.9026 },
  { id: "tamien", name: "Tamien", zone: 6, latitude: 37.3115, longitude: -121.8841 },
  { id: "capitol", name: "Capitol", zone: 6, latitude: 37.2905, longitude: -121.8418 },
  { id: "blossom", name: "Blossom Hill", zone: 6, latitude: 37.2523, longitude: -121.7971 },
  { id: "morganhill", name: "Morgan Hill", zone: 6, latitude: 37.1296, longitude: -121.6506 },
  { id: "gilroy", name: "Gilroy", zone: 6, latitude: 37.0035, longitude: -121.5667 },
];

const generateSchedule = (): Train[] => {
  const trains: Train[] = [];
  const allStations = STATIONS.map((s) => s.id);

  const northboundStations = [...allStations].reverse();
  const southboundStations = allStations;

  const addTrain = (
    startHour: number,
    startMinute: number,
    type: TrainType,
    direction: "Northbound" | "Southbound",
    stops: string[]
  ) => {
    const time = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
    trains.push({
      id: `${direction[0]}-${time}-${type}`,
      type,
      direction,
      departureTime: time,
      stops,
    });
  };

  for (let hour = 5; hour <= 23; hour++) {
    const minutes = [0, 20, 40];
    minutes.forEach((minute, idx) => {
      if (hour === 23 && minute > 0) return;

      if (idx === 0) {
        addTrain(hour, minute, "Local", "Southbound", southboundStations);
        addTrain(hour, minute, "Local", "Northbound", northboundStations);
      } else if (idx === 1) {
        const limitedStops = southboundStations.filter((s, i) => i % 3 === 0 || i === southboundStations.length - 1);
        addTrain(hour, minute, "Limited", "Southbound", limitedStops);
        const limitedNB = northboundStations.filter((s, i) => i % 3 === 0 || i === northboundStations.length - 1);
        addTrain(hour, minute, "Limited", "Northbound", limitedNB);
      } else {
        const expressStops = ["sf", "millbrae", "paloalto", "mountainview", "sanjose"];
        if (hour >= 6 && hour <= 9 || hour >= 16 && hour <= 19) {
          addTrain(hour, minute, "Express", "Southbound", expressStops);
          addTrain(hour, minute, "Express", "Northbound", [...expressStops].reverse());
        } else {
          addTrain(hour, minute, "Local", "Southbound", southboundStations);
          addTrain(hour, minute, "Local", "Northbound", northboundStations);
        }
      }
    });
  }

  return trains;
};

export const TRAINS = generateSchedule();

export const getStationById = (id: string): Station | undefined => {
  return STATIONS.find((s) => s.id === id);
};

export const getTrainsByStation = (stationId: string, direction?: "Northbound" | "Southbound"): Train[] => {
  return TRAINS.filter(
    (train) =>
      train.stops.includes(stationId) &&
      (!direction || train.direction === direction)
  );
};

export const getNextTrains = (stationId: string, direction?: "Northbound" | "Southbound", limit = 10): Train[] => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const trains = getTrainsByStation(stationId, direction);
  return trains
    .filter((train) => train.departureTime >= currentTime)
    .slice(0, limit);
};
