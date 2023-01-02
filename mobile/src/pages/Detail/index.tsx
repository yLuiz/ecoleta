import React, { useEffect, useState } from "react";
import { Image, Linking, SafeAreaView, Text, View  } from "react-native";
import { Feather as Icon, FontAwesome} from '@expo/vector-icons';
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';
import styles from "./styles";

interface IParams {
  point_id: string;
}

interface Item {
  id: number;
  title: string;
  image: string;
}

interface IData {
  point: {
    name: string;
    image: string;
    email: string;
    whatsapp: string,
    city: string;
    uf: string;
  }
  items: Item[]
}

const Detail = () => {

  const { goBack } = useNavigation();
  const [data, setData] = useState<IData>({} as IData);

  const staticData = {
    point: {
      name: "Mercado Dantas",
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60",
      email: "luizvictor1231@gmail.com",
      whatsapp: "92993495014",
      city: "Manaus",
      uf: "AM",
    },
    items: [
      {
        id: 1,
        image: "http://localhost:3333/uploads/lampadas.svg",
        title: "Lâmpadas"
      },
      {
        id: 2,
        image: "http://localhost:3333/uploads/baterias.svg",
        title: "Pilhas e Batérias"
      },
      {
        id: 6,
        image: "http://localhost:3333/uploads/oleo.svg",
        title: "Oléo de Cozinha"
      },
    ]
  }

  const route = useRoute();
  const routeParams = route.params as IParams;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`)
      .then(response => {
        console.log(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  function handleNavigateBack() {
    goBack();
  }

  function handleMailComposer() {
    MailComposer.composeAsync({
      subject: "Interesse na coleta de resíduos.",
      recipients: [staticData.point.email]
    })
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${staticData.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos.`)
  }

  //  Descomentar está validação quanto tiver conexão com a API.
  // if (!data.point) {
  //   return null;
  // }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"/>
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{
          uri: staticData.point.image
        }} />

        <Text style={styles.pointName}>{staticData.point.name}</Text>
        <Text style={styles.pointItems}>
          { staticData.items.map(item => item.title).join(', ') }
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>Rio do Sul</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleMailComposer}>
          <Icon name="mail" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

export default Detail;