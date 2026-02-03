import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { STATIONS, getTrainsByStation } from "@/data/caltrain";
import * as AC from "@bacons/apple-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function StationsPage() {
  const [search, setSearch] = useState("");

  const filteredStations = STATIONS.filter((station) =>
    station.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: AC.label as any, marginBottom: 8 }}>
          Stations
        </Text>
        <Text style={{ fontSize: 16, color: AC.secondaryLabel as any, marginBottom: 24 }}>
          Browse all Caltrain stations
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 12,
            backgroundColor: AC.secondarySystemGroupedBackground as any,
            borderRadius: 12,
            borderCurve: "continuous",
            marginBottom: 24,
          }}
        >
          <MaterialIcons name="search" size={20} color={AC.tertiaryLabel as any} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search stations..."
            placeholderTextColor={AC.placeholderText as any}
            style={{
              flex: 1,
              fontSize: 16,
              color: AC.label as any,
            }}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <MaterialIcons name="close" size={20} color={AC.tertiaryLabel as any} />
            </Pressable>
          )}
        </View>

        <Text style={{ fontSize: 14, color: AC.secondaryLabel as any, marginBottom: 12 }}>
          {filteredStations.length} {filteredStations.length === 1 ? "station" : "stations"}
        </Text>

        <View style={{ gap: 12 }}>
          {filteredStations.map((station) => (
            <StationCard key={station.id} station={typeof station === "string" ? STATIONS.find(s => s.id === station)! : station} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StationCard({ station }: { station: { id: string; name: string; zone: number } }) {
  const trains = getTrainsByStation(station.id);
  const northboundCount = trains.filter((t) => t.direction === "Northbound").length;
  const southboundCount = trains.filter((t) => t.direction === "Southbound").length;

  const zoneColor =
    station.zone === 1
      ? AC.systemBlue
      : station.zone === 2
      ? AC.systemGreen
      : station.zone === 3
      ? AC.systemOrange
      : station.zone === 4
      ? AC.systemPurple
      : station.zone === 5
      ? AC.systemPink
      : AC.systemRed;

  return (
    <Pressable
      style={({ pressed }) => ({
        padding: 16,
        backgroundColor: pressed
          ? (AC.tertiarySystemGroupedBackground as any)
          : (AC.secondarySystemGroupedBackground as any),
        borderRadius: 16,
        borderCurve: "continuous",
        gap: 8,
      })}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: AC.label as any, marginBottom: 4 }}>
            {station.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: zoneColor as any,
                borderRadius: 6,
                borderCurve: "continuous",
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#FFFFFF" }}>
                ZONE {station.zone}
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: AC.secondaryLabel as any }}>
              {trains.length} daily trains
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={AC.tertiaryLabel as any} />
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
        <View
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: AC.tertiarySystemFill as any,
            borderRadius: 10,
            borderCurve: "continuous",
          }}
        >
          <Text style={{ fontSize: 11, color: AC.secondaryLabel as any, marginBottom: 2 }}>
            Northbound
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "600", color: AC.label as any, fontVariant: ["tabular-nums"] }}>
            {northboundCount}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: AC.tertiarySystemFill as any,
            borderRadius: 10,
            borderCurve: "continuous",
          }}
        >
          <Text style={{ fontSize: 11, color: AC.secondaryLabel as any, marginBottom: 2 }}>
            Southbound
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "600", color: AC.label as any, fontVariant: ["tabular-nums"] }}>
            {southboundCount}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
