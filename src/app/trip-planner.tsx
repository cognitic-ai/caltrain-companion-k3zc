import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { STATIONS, TRAINS, getStationById, Train } from "@/data/caltrain";
import * as AC from "@bacons/apple-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TripPlannerPage() {
  const [fromStation, setFromStation] = useState<string | null>(null);
  const [toStation, setToStation] = useState<string | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const trips = findTrips(fromStation, toStation);

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: AC.label as any, marginBottom: 8 }}>
          Trip Planner
        </Text>
        <Text style={{ fontSize: 16, color: AC.secondaryLabel as any, marginBottom: 24 }}>
          Plan your journey between stations
        </Text>

        <View style={{ gap: 12, marginBottom: 24 }}>
          <Pressable
            onPress={() => setShowFromPicker(!showFromPicker)}
            style={{
              padding: 16,
              backgroundColor: AC.secondarySystemGroupedBackground as any,
              borderRadius: 16,
              borderCurve: "continuous",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: AC.secondaryLabel as any, marginBottom: 4 }}>
                From
              </Text>
              <Text style={{ fontSize: 17, fontWeight: "600", color: AC.label as any }}>
                {fromStation ? getStationById(fromStation)?.name : "Select station"}
              </Text>
            </View>
            <MaterialIcons name="place" size={24} color={AC.systemBlue as any} />
          </Pressable>

          <Pressable
            onPress={swapStations}
            style={{
              alignSelf: "center",
              padding: 8,
              backgroundColor: AC.tertiarySystemFill as any,
              borderRadius: 20,
              borderCurve: "continuous",
            }}
          >
            <MaterialIcons name="swap-vert" size={24} color={AC.label as any} />
          </Pressable>

          <Pressable
            onPress={() => setShowToPicker(!showToPicker)}
            style={{
              padding: 16,
              backgroundColor: AC.secondarySystemGroupedBackground as any,
              borderRadius: 16,
              borderCurve: "continuous",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: AC.secondaryLabel as any, marginBottom: 4 }}>
                To
              </Text>
              <Text style={{ fontSize: 17, fontWeight: "600", color: AC.label as any }}>
                {toStation ? getStationById(toStation)?.name : "Select station"}
              </Text>
            </View>
            <MaterialIcons name="place" size={24} color={AC.systemRed as any} />
          </Pressable>
        </View>

        {showFromPicker && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: AC.label as any, marginBottom: 12 }}>
              Select Departure Station
            </Text>
            <View style={{ gap: 8 }}>
              {STATIONS.map((station) => (
                <Pressable
                  key={station.id}
                  onPress={() => {
                    setFromStation(station.id);
                    setShowFromPicker(false);
                  }}
                  style={({ pressed }) => ({
                    padding: 14,
                    backgroundColor: pressed
                      ? (AC.tertiarySystemFill as any)
                      : (AC.secondarySystemGroupedBackground as any),
                    borderRadius: 12,
                    borderCurve: "continuous",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  })}
                >
                  <Text style={{ fontSize: 15, color: AC.label as any }}>{station.name}</Text>
                  {fromStation === station.id && (
                    <MaterialIcons name="check" size={20} color={AC.systemBlue as any} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {showToPicker && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: AC.label as any, marginBottom: 12 }}>
              Select Arrival Station
            </Text>
            <View style={{ gap: 8 }}>
              {STATIONS.map((station) => (
                <Pressable
                  key={station.id}
                  onPress={() => {
                    setToStation(station.id);
                    setShowToPicker(false);
                  }}
                  style={({ pressed }) => ({
                    padding: 14,
                    backgroundColor: pressed
                      ? (AC.tertiarySystemFill as any)
                      : (AC.secondarySystemGroupedBackground as any),
                    borderRadius: 12,
                    borderCurve: "continuous",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  })}
                >
                  <Text style={{ fontSize: 15, color: AC.label as any }}>{station.name}</Text>
                  {toStation === station.id && (
                    <MaterialIcons name="check" size={20} color={AC.systemRed as any} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {fromStation && toStation && fromStation !== toStation && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: "600", color: AC.label as any, marginBottom: 12 }}>
              Available Trips
            </Text>
            {trips.length === 0 ? (
              <View
                style={{
                  padding: 24,
                  backgroundColor: AC.secondarySystemGroupedBackground as any,
                  borderRadius: 16,
                  alignItems: "center",
                  borderCurve: "continuous",
                }}
              >
                <Text style={{ fontSize: 16, color: AC.secondaryLabel as any, textAlign: "center" }}>
                  No trips available for this route
                </Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} from={fromStation} to={toStation} />
                ))}
              </View>
            )}
          </View>
        )}

        {(!fromStation || !toStation) && (
          <View
            style={{
              padding: 32,
              backgroundColor: AC.secondarySystemGroupedBackground as any,
              borderRadius: 16,
              alignItems: "center",
              borderCurve: "continuous",
            }}
          >
            <MaterialIcons name="train" size={48} color={AC.tertiaryLabel as any} style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 16, color: AC.secondaryLabel as any, textAlign: "center" }}>
              Select departure and arrival stations to find available trips
            </Text>
          </View>
        )}

        {fromStation === toStation && fromStation && (
          <View
            style={{
              padding: 32,
              backgroundColor: AC.secondarySystemGroupedBackground as any,
              borderRadius: 16,
              alignItems: "center",
              borderCurve: "continuous",
            }}
          >
            <Text style={{ fontSize: 16, color: AC.secondaryLabel as any, textAlign: "center" }}>
              Departure and arrival stations must be different
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function findTrips(from: string | null, to: string | null): Train[] {
  if (!from || !to || from === to) return [];

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  return TRAINS.filter((train) => {
    const fromIndex = train.stops.indexOf(from);
    const toIndex = train.stops.indexOf(to);
    return (
      fromIndex !== -1 &&
      toIndex !== -1 &&
      fromIndex < toIndex &&
      train.departureTime >= currentTime
    );
  }).slice(0, 15);
}

function TripCard({ trip, from, to }: { trip: Train; from: string; to: string }) {
  const typeColor =
    trip.type === "Express"
      ? AC.systemOrange
      : trip.type === "Limited"
      ? AC.systemPurple
      : AC.systemGreen;

  const fromIndex = trip.stops.indexOf(from);
  const toIndex = trip.stops.indexOf(to);
  const stopCount = toIndex - fromIndex;

  const fromStation = getStationById(from);
  const toStation = getStationById(to);

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: AC.secondarySystemGroupedBackground as any,
        borderRadius: 16,
        borderCurve: "continuous",
        gap: 12,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: AC.label as any,
              fontVariant: ["tabular-nums"],
            }}
          >
            {trip.departureTime}
          </Text>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: typeColor as any,
              borderRadius: 8,
              borderCurve: "continuous",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>
              {trip.type.toUpperCase()}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: AC.tertiarySystemFill as any,
            borderRadius: 8,
            borderCurve: "continuous",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", color: AC.label as any }}>
            {trip.direction === "Northbound" ? "↑ NB" : "↓ SB"}
          </Text>
        </View>
      </View>

      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialIcons name="circle" size={12} color={AC.systemBlue as any} />
          <Text style={{ fontSize: 15, color: AC.label as any, flex: 1 }}>{fromStation?.name}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 5 }}>
          <View style={{ width: 2, height: 20, backgroundColor: AC.tertiaryLabel as any }} />
          <Text style={{ fontSize: 13, color: AC.secondaryLabel as any }}>
            {stopCount} {stopCount === 1 ? "stop" : "stops"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialIcons name="circle" size={12} color={AC.systemRed as any} />
          <Text style={{ fontSize: 15, color: AC.label as any, flex: 1 }}>{toStation?.name}</Text>
        </View>
      </View>
    </View>
  );
}
