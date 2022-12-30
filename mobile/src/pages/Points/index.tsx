import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Image, SafeAreaView  } from "react-native";
import { Feather as Icon } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from './styles';
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from '../../services/api';

// style={styles.}

interface Item {
  id: number;
  title: string;
  image: string;
}

const Points = () => {

  const [items, setItems] = useState<Item[]>([]);
  const { goBack, navigate } = useNavigation();

  useEffect(() => {
    api.get("items")
      .then(response => {
        setItems(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  function handleNavigateBack() {
    goBack();
  }

  function handleNavigateToDetail() {
    const detail = "Detail" as never;
    navigate(detail);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"/>
        </TouchableOpacity>

        <Text style={styles.title}>
          Bem vindo.
        </Text>

        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: -3.123097, 
              longitude: -59.979971,
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
              <Marker 
                style={styles.mapMarker}
                onPress={handleNavigateToDetail}
                coordinate={{
                  latitude: -3.123097, 
                  longitude: -59.979971,
                }}>
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage} source={{
                    uri: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60"
                  }}/>
                  <Text style={styles.mapMarkerTitle}>Digiboard</Text>
                </View>
              </Marker>
          </MapView>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 28
          }}
        >
          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}>Lâmpadas</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Points;