import MapView, { Polyline, Region, Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { LocationPoint } from "@/lib/route";
import { useTheme } from "react-native-paper";
import MapStyle from "./MapStyle";

type MapRouteProps = {
  locationPoints: LocationPoint[];
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
  showMarkers?: boolean;
};

const MapRoute = ({
  locationPoints,
  showsUserLocation,
  followsUserLocation,
  showMarkers,
}: MapRouteProps) => {
  const theme = useTheme();
  const initialRegion: Region = {
    latitude: locationPoints[0]?.latitude || 37.78825,
    longitude: locationPoints[0]?.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={showsUserLocation}
        followsUserLocation={followsUserLocation}
        customMapStyle={theme.dark ? MapStyle : undefined}
      >
        <Polyline
          coordinates={locationPoints.map((point) => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }))}
          strokeWidth={4}
          strokeColor={theme.dark ? "lightblue" : "darkblue"}
        />
        {showMarkers && (
          <>
            <Marker
              title="Start"
              pinColor="green"
              coordinate={{
                latitude: locationPoints[0]?.latitude,
                longitude: locationPoints[0]?.longitude,
              }}
            />
            <Marker
              title="End"
              pinColor="red"
              coordinate={{
                latitude: locationPoints[locationPoints.length - 1]?.latitude,
                longitude: locationPoints[locationPoints.length - 1]?.longitude,
              }}
            />
          </>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapRoute;
