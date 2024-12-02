import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getExerciseById,
  getRoutePointsByExerciseId,
} from "@/database/exerciseService";
import { loadUserProfile, UserProfile } from "@/lib/profile";
import { Exercise } from "@/lib/exercise";
import { LocationPoint } from "@/lib/route";
import { TabView, TabBar } from "react-native-tab-view";
import ExerciseOverview from "@/components/exerciseDetails/ExerciseOverview";
import ExerciseGraph from "@/components/exerciseDetails/ExerciseGraph";
import { Icon, useTheme } from "react-native-paper";

const routes = [
  { key: "overview", title: "Overview", icon: "map" },
  { key: "graph", title: "Graph", icon: "chart-line" },
];

const ExerciseDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const layout = useWindowDimensions();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [routePoints, setRoutePoints] = useState<LocationPoint[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        if (id) {
          const exerciseData = await getExerciseById(Number(id));
          setExercise(exerciseData);

          const routeData = await getRoutePointsByExerciseId(Number(id));
          const locationPoints: LocationPoint[] = routeData.map((point) => ({
            timestamp: point.timestamp,
            latitude: point.latitude,
            longitude: point.longitude,
          }));
          setRoutePoints(locationPoints);
        } else {
          console.error("No exercise ID provided.");
        }
      } catch (error) {
        console.error("Error fetching exercise details:", error);
      }
    };

    fetchExerciseDetails();
  }, [id]);

  useEffect(() => {
    (async () => {
      setUserProfile(await loadUserProfile());
    })();
  }, []);

  return (
    <TabView
      navigationState={{ index: tabIndex, routes }}
      renderScene={(props) => {
        switch (props.route.key) {
          case "overview":
            return (
              <ExerciseOverview
                exercise={exercise}
                userProfile={userProfile}
                routePoints={routePoints}
              />
            );
          case "graph":
            return <ExerciseGraph exercise={exercise!} points={routePoints} />;
          default:
            return null;
        }
      }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={{
            backgroundColor: theme.colors.surface,
            height: 64,
            borderColor: theme.colors.outlineVariant,
          }}
          tabStyle={{ height: 64 }}
          pressColor="transparent"
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.onSurfaceVariant}
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
        />
      )}
      onIndexChange={setTabIndex}
      initialLayout={{ width: layout.width }}
      commonOptions={{
        icon: (props) => (
          <Icon
            source={props.route.icon}
            color={props.color}
            size={props.size}
          />
        ),
      }}
    />
  );
};

export default ExerciseDetailsScreen;
