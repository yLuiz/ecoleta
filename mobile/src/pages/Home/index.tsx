import React from 'react';
import { Text, View, ImageBackground, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';

import { useNavigation } from "@react-navigation/native"; 

import styles from './styles';

const Home = () => {
  const point = "Points" as never;
  const navigation = useNavigation();

  function handleNavigationToPoints() {
    navigation.navigate(point);
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={ require('../../assets/logo.png') }/>
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

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

    </ImageBackground>
  )
};

export default Home;