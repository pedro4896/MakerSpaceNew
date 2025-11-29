import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Login } from './Login';
import { Cadastro } from './Cadastro';
import { Verificacao } from './Verificacao';
import { Feed } from './Feed';
import { Chats } from './Chats';
import ConversaComUsuario from './Conversa';
import { Perfil } from './Perfil';
import { Configuraes } from './Configuracoes';
import { PublicarProjetos } from './Publicar';
import { CriarProjeto } from './CriarProjeto';
import { ConectaMaker } from './ConectaMaker';
import { Conexes } from './Conexoes';

const Stack = createNativeStackNavigator();

// EXPORTAÇÃO DO TIPO DE ROTA
export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Verificacao: undefined;
  Feed: undefined;
  Chats: undefined;
  Conversa: { chatName: string };
  Perfil: undefined;
  Configuracoes: undefined;
  PublicarProjetos: undefined;
  CriarProjeto: undefined;
  ConectaMaker: undefined;
  Conexoes: undefined;
};

// Tipo de navegação universal para ser usado com useNavigation<AppNavigationProp>()
export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login' as keyof RootStackParamList);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          setInitialRoute('Feed'); 
        }
      } catch (e) {
        console.error("Failed to load login status", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={appStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#000048" />
        <Text style={{ marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute} 
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Verificacao" component={Verificacao} />
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="Conversa" component={ConversaComUsuario} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Configuracoes" component={Configuraes} />
        <Stack.Screen name="PublicarProjetos" component={PublicarProjetos} />
        <Stack.Screen name="CriarProjeto" component={CriarProjeto} />
        <Stack.Screen name="ConectaMaker" component={ConectaMaker} />
        <Stack.Screen name="Conexoes" component={Conexes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const appStyles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});