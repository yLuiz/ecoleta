import React from "react";
import { Image, SafeAreaView, Text, View  } from "react-native";
import { Feather as Icon, FontAwesome} from '@expo/vector-icons';
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const Detail = () => {

  const { goBack } = useNavigation();

  function handleNavigateBack() {
    goBack();
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"/>
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{
          uri: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60"
        }} />

        <Text style={styles.pointName}>Mercado Dantas</Text>
        <Text style={styles.pointItems}>Lâmpadas, Óleo de Cozinha</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>Rio do Sul</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => {}}>
          <FontAwesome name="whatsapp" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={() => {}}>
          <Icon name="mail" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

export default Detail;