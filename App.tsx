import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
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