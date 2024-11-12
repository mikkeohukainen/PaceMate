import React from "react";
import MapView, { Polyline, Region } from "react-native-maps";
import { StyleSheet, View } from "react-native";

type LocationPoint = {
  latitude: number;
  longitude: number;
};

type MapRouteProps = {
  locationPoints: LocationPoint[];
};

const MapRoute: React.FC<MapRouteProps> = ({ locationPoints }) => {
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
        showsUserLocation={true}
        followsUserLocation={true}
      >
        <Polyline
          coordinates={locationPoints}
          strokeWidth={4}
          strokeColor="blue"
        />
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
