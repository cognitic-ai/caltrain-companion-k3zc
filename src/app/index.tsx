import { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { STATIONS, getNextTrains, Train } from "@/data/caltrain";
import * as AC from "@bacons/apple-colors";

export default function SchedulePage() {
  const [selectedStation, setSelectedStation] = useState(STATIONS[0].id);
  const [direction, setDirection] = useState<"Northbound" | "Southbound" | undefined>(undefined);

  const nextTrains = useMemo(() => {
    return getNextTrains(selectedStation, direction, 20);
  }, [selectedStation, direction]);

  const selectedStationData = STATIONS.find((s) => s.id === selectedStation);

  return (
    <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: AC.label as any, marginBottom: 8 }}>
          Caltrain Schedule
        </Text>
        <Text style={{ fontSize: 16, color: AC.secondaryLabel as any, marginBottom: 24 }}>
          View upcoming train departures
        </Text>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: AC.label as any, marginBottom: 12 }}>
            Select Station
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {STATIONS.map((station) => (
              <Pressable
                key={station.id}
                onPress={() => setSelectedStation(station.id)}
                style={({ pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor:
                    selectedStation === station.id
                      ? (AC.systemBlue as any)
                      : pressed
                      ? (AC.tertiarySystemFill as any)
                      : (AC.secondarySystemFill as any),
                  borderCurve: "continuous",
                })}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: selectedStation === station.id ? "600" : "400",
                    color:
                      selectedStation === station.id
                        ? "#FFFFFF"
                        : (AC.label as any),
                  }}
                >
                  {station.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: AC.label as any, marginBottom: 12 }}>
            Direction
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => setDirection(undefined)}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor:
                  direction === undefined
                    ? (AC.systemBlue as any)
                    : pressed
                    ? (AC.tertiarySystemFill as any)
                    : (AC.secondarySystemFill as any),
                alignItems: "center",
                borderCurve: "continuous",
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: direction === undefined ? "600" : "400",
                  color: direction === undefined ? "#FFFFFF" : (AC.label as any),
                }}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDirection("Northbound")}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor:
                  direction === "Northbound"
                    ? (AC.systemBlue as any)
                    : pressed
                    ? (AC.tertiarySystemFill as any)
                    : (AC.secondarySystemFill as any),
                alignItems: "center",
                borderCurve: "continuous",
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: direction === "Northbound" ? "600" : "400",
                  color: direction === "Northbound" ? "#FFFFFF" : (AC.label as any),
                }}
              >
                Northbound
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDirection("Southbound")}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor:
                  direction === "Southbound"
                    ? (AC.systemBlue as any)
                    : pressed
                    ? (AC.tertiarySystemFill as any)
                    : (AC.secondarySystemFill as any),
                alignItems: "center",
                borderCurve: "continuous",
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: direction === "Southbound" ? "600" : "400",
                  color: direction === "Southbound" ? "#FFFFFF" : (AC.label as any),
                }}
              >
                Southbound
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", color: AC.label as any, marginBottom: 12 }}>
            Next Departures from {selectedStationData?.name}
          </Text>
        </View>

        {nextTrains.length === 0 ? (
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
              No more trains today
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {nextTrains.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function TrainCard({ train }: { train: Train }) {
  const typeColor =
    train.type === "Express"
      ? AC.systemOrange
      : train.type === "Limited"
      ? AC.systemPurple
      : AC.systemGreen;

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: AC.secondarySystemGroupedBackground as any,
        borderRadius: 16,
        borderCurve: "continuous",
        gap: 8,
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
            {train.departureTime}
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
              {train.type.toUpperCase()}
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
            {train.direction === "Northbound" ? "↑ NB" : "↓ SB"}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 14, color: AC.secondaryLabel as any }}>
        {train.stops.length} stops • {train.direction}
      </Text>
    </View>
  );
}
