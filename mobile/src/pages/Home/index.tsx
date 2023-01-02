import React, { useState } from 'react';
import { Text, View, ImageBackground, Image, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';

import { useNavigation } from "@react-navigation/native"; 

import styles from './styles';

const Home = () => {
  const navigation = useNavigation<any>();

  const [uf, setUf] = useState<string>("");
  const [city, setCity] = useState<string>("");

  function handleNavigationToPoints() {

    if (!uf || !city) {
      Alert.alert("Oops...", "Você precisa digitar o estado e cidade que deseja.");
      return;
    };

    navigation.navigate("Points", {
      uf,
      city
    });
  }

  function handleInputUF(event: string) {
    setUf(event.toUpperCase());
  }

  return (

    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={ require('../../assets/logo.png') }/>
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          {/* Alterar os TextInputs para um picker-select e usar API do IBGE para pegar os estados e cidades. */}
          <TextInput 
            maxLength={2}
            value={uf}
            onChangeText={handleInputUF}
            autoCorrect={false}
            placeholder='Digite a UF'
            style={styles.input}
          />

          <TextInput 
            value={city}
            onChangeText={setCity}
            autoCorrect={false}
            placeholder='Digite a Cidade'
            style={styles.input}
          />

          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name='arrow-right' color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
};

export default Home;