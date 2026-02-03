import { ThemeProvider } from "@/components/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs as WebTabs } from "expo-router/tabs";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform, useWindowDimensions } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <TabsLayout />
    </ThemeProvider>
  );
}

function TabsLayout() {
  if (process.env.EXPO_OS === "web") {
    return <WebTabsLayout />;
  } else {
    return <NativeTabsLayout />;
  }
}

function WebTabsLayout() {
  const { width } = useWindowDimensions();
  const isMd = width >= 768;
  const isLg = width >= 1024;

  return (
    <WebTabs
      screenOptions={{
        headerShown: false,
        ...(isMd
          ? {
              tabBarPosition: "left",
              tabBarVariant: "material",
              tabBarLabelPosition: isLg ? undefined : "below-icon",
            }
          : {
              tabBarPosition: "bottom",
            }),
      }}
    >
      <WebTabs.Screen
        name="index"
        options={{
          title: "Schedule",
          tabBarIcon: (props) => <MaterialIcons {...props} name="schedule" />,
        }}
      />
      <WebTabs.Screen
        name="trip-planner"
        options={{
          title: "Trip Planner",
          tabBarIcon: (props) => <MaterialIcons {...props} name="directions" />,
        }}
      />
      <WebTabs.Screen
        name="stations"
        options={{
          title: "Stations",
          tabBarIcon: (props) => <MaterialIcons {...props} name="place" />,
        }}
      />
    </WebTabs>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Schedule</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "calendar", selected: "calendar.badge.clock" } },
            default: {
              src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="schedule" />,
            },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="trip-planner">
        <NativeTabs.Trigger.Label>Trip</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "arrow.triangle.swap", selected: "arrow.triangle.swap" } },
            default: {
              src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="directions" />,
            },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="stations">
        <NativeTabs.Trigger.Label>Stations</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "mappin.and.ellipse", selected: "mappin.and.ellipse.circle.fill" } },
            default: {
              src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="place" />,
            },
          })}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
