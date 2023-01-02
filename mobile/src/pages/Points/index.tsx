import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Image, SafeAreaView, Alert } from "react-native";

import { Feather as Icon } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";

import styles from './styles';
import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image: string;
}

interface IPoint {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface IParams {
  uf: string;
  city: string;
}

const Points = () => {
  const route = useRoute();
  const { city, uf } = route.params as IParams;

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [points, setPoints] = useState<IPoint[]>([]);
  const { goBack, navigate } = useNavigation<any>();
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  // Ponto estático para apenas testar o visual da aplicação
  const staticPoint: IPoint = {
    id: 1,
    name: 'Digiboard',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
    latitude: -3.123188, 
    longitude: -59.979846,
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

    console.log(selectedItems);

    api.get("points", {
      params: {
        city,
        uf,
        items: selectedItems
      }
    })
      .then(response => {
        setPoints(response.data);
      })
      .catch(err => console.log(err));
  }, [selectedItems]);

  useEffect(() => {
    setItems(
      [
        {
          "id": 1,
          "image": "http://localhost:3333/uploads/lampadas.svg",
          "title": "Lâmpadas"
        },
        {
          "id": 2,
          "image": "http://localhost:3333/uploads/baterias.svg",
          "title": "Pilhas e Batérias"
        },
        {
          "id": 3,
          "image": "http://localhost:3333/uploads/papeis-papelao.svg",
          "title": "Papéis e Papelão"
        },
        {
          "id": 4,
          "image": "http://localhost:3333/uploads/eletronicos.svg",
          "title": "Resíduos Eletrônicos"
        },
        {
          "id": 5,
          "image": "http://localhost:3333/uploads/organicos.svg",
          "title": "Resíduos Orgânicos"
        },
        {
          "id": 6,
          "image": "http://localhost:3333/uploads/oleo.svg",
          "title": "Oléo de Cozinha"
        }
      ]
    );

    console.log({ uf, city })
  }, []);

  function handleNavigateBack() {
    goBack();
  }

  function handleNavigateToDetail(id: number) {
    const detail = "Detail";
    navigate(detail, { point_id: id });
  }

  function handleSelectItems(itemId: number) {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((item) => item !== itemId));
      return;
    }

    setSelectedItems([...selectedItems, itemId]);
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
                  onPress={() => { handleNavigateToDetail(point.id) }}
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
              onPress={() => { handleNavigateToDetail(staticPoint.id) }}
              coordinate={{
                latitude: -3.123188, 
                longitude: -59.979846,
              }}>
              <View style={styles.mapMarkerContainer}>
                <Image style={styles.mapMarkerImage} source={{
                  uri: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60"
                }}/>
                <Text style={styles.mapMarkerTitle}>{staticPoint.name}</Text>
              </View>
            </Marker>

            <Marker 
              style={styles.mapMarker}
              onPress={() => { handleNavigateToDetail(staticPoint.id) }}
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
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : null
                ]}
                onPress={() => handleSelectItems(item.id)}>
                  <SvgUri width={42} height={42} uri={item.image}></SvgUri>
                  <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            )) : null 
          }
          
          {/* COMPONENTES ESTATICOS ENQUANTO NÃO HÁ CONEXÃO COM A API */}

          {/* <TouchableOpacity style={styles.item} onPress={() => handleSelectItems(items[0].id)}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => handleSelectItems(items[0].id)}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => handleSelectItems(items[0].id)}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => handleSelectItems(items[0].id)}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => handleSelectItems(items[0].id)}>
            <SvgUri width={42} height={42} uri={""}></SvgUri>
            <Text style={styles.itemTitle}></Text>
          </TouchableOpacity>
          */}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Points;