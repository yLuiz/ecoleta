import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Image, SafeAreaView, Alert  } from "react-native";
import { Feather as Icon } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from './styles';
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from '../../services/api';
import * as Location from 'expo-location';

// style={styles.}

interface Item {
  id: number;
  title: string;
  image: string;
}

interface IPoint {
  id: number;
  name: string;
  image: string;
  email: string;
  whatsapp: string,
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
}

const Points = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<IPoint[]>([]);
  const { goBack, navigate } = useNavigation();
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const staticPoint: IPoint = {
    id: 1,
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
    email: 'luiz@gmail.com',
    whatsapp: '92993495014',
    city: "Manaus",
    latitude: -3.123188, 
    longitude: -59.979846,
    uf: "AM"
  }

  useEffect(() => {
    api.get("items")
      .then(response => {
        setItems(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    async function loadLocation() {

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Ooops...", 'Precisamos de sua permissão para obter sua localização.');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    }

    loadLocation();
  }, []);

  useEffect(() => {
    api.get("points", {
      params: {
        city: "Manaus",
        uf: "AM",
        items: [
          1, 2
        ]
      }
    })
      .then( response => {
        setPoints(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  function handleNavigateBack() {
    goBack();
  }

  function handleNavigateToDetail(details: IPoint) {
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
        { (initialPosition[0] !== 0 && initialPosition[1] !== 0) ? 
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: initialPosition[0], 
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            { points.length ? 
              points.map(point => (
                <Marker
                  key={point.id}
                  style={styles.mapMarker}
                  onPress={() => { handleNavigateToDetail(point) }}
                  coordinate={{
                    latitude: point.latitude, 
                    longitude: point.longitude,
                  }}>
                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{
                      uri: point.image
                    }}/>
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))
              : null
            }

            <Marker 
              style={styles.mapMarker}
              onPress={() => { handleNavigateToDetail(staticPoint) }}
              coordinate={{
                latitude: -3.123188, 
                longitude: -59.979846,
              }}>
              <View style={styles.mapMarkerContainer}>
                <Image style={styles.mapMarkerImage} source={{
                  uri: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60"
                }}/>
                <Text style={styles.mapMarkerTitle}>Digiboard</Text>
              </View>
            </Marker>

            <Marker 
              style={styles.mapMarker}
              onPress={() => { handleNavigateToDetail(staticPoint) }}
              coordinate={{
                latitude: initialPosition[0], 
                longitude: initialPosition[1],
              }}>
            </Marker>
        </MapView> : null }
          
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

          { items.length ? 
            items.map((item) => (
              <TouchableOpacity key={item.id} style={styles.item} onPress={() => {}}>
                  <SvgUri width={42} height={42} uri={item.image}></SvgUri>
                  <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            )) : null 
          }
          
          {/* COMPONENTES ESTATICOS ENQUANTO NÃO HÁ CONEXÃO COM A API */}

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>


        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Points;