import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; 

const { width } = Dimensions.get('window');

// 1. Definição da interface e dos dados
interface ChatItemData {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: any; 
}

const avatarJulioCesar = require('./assets/image.png');
const backIcon = require('./assets/image-34.png'); 

const chatData: ChatItemData[] = [
  {
    id: 1,
    name: "Júlio César",
    message: "Aaah, que bom...",
    time: "2:40PM",
    avatar: avatarJulioCesar,
  },
  {
    id: 2,
    name: "Arthur Silva",
    message: "O projeto está quase pronto!",
    time: "1:15PM",
    avatar: avatarJulioCesar, 
  },
  {
    id: 3,
    name: "Ana Júlia",
    message: "Me encontre no Makerspace.",
    time: "Ontem",
    avatar: avatarJulioCesar, 
  },
];


// --- Componente de Item de Chat - CORRIGIDO O PROP navigation ---
const ChatItemComponent: React.FC<{ chat: ChatItemData, navigation: NavigationProp<RootStackParamList> }> = ({ chat, navigation }) => (
  <TouchableOpacity 
    style={itemStyles.itemContainer}
    onPress={() => navigation.navigate('Conversa', { chatName: chat.name })}
  >
    {/* Avatar */}
    <Image 
      source={chat.avatar} 
      style={itemStyles.avatar} 
      resizeMode="cover" 
    />

    {/* Conteúdo (Nome e Mensagem) */}
    <View style={itemStyles.content}>
      <Text style={itemStyles.name}>{chat.name}</Text>
      <Text style={itemStyles.message}>{chat.message}</Text>
    </View>
    
    {/* Horário */}
    <Text style={itemStyles.time}>{chat.time}</Text>
  </TouchableOpacity>
);


// --- Tela Principal de Chats ---
export const Chats: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Render Item para FlatList
  const renderItem = ({ item }: { item: ChatItemData }) => (
    <ChatItemComponent chat={item} navigation={navigation} />
  );
  
  const handleGoBack = () => {
      navigation.goBack(); // CORREÇÃO: Chama a função goBack()
  };

  return (
    <View style={styles.container}>
      
      {/* --- HEADER (Fixo) --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Botão de Retorno (image34) - CONECTADO */}
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Image source={backIcon} style={styles.backIcon} resizeMode="cover" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>

        {/* Campo de Busca */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder=""
            placeholderTextColor="#999"
          />
          {/* Botão de Busca (image36) */}
          <TouchableOpacity style={styles.searchButton} onPress={() => console.log('Buscar')}>
             <Icon name="search-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- LISTA DE CHATS (Scrollable) --- */}
      <FlatList
        data={chatData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      {/* --- Elementos de rodapé (div e footer azul) --- */}
      <View style={styles.decorativeFooter} />
      <View style={styles.absoluteFooter} />

    </View>
  );
};

// --- Estilos Globais da Tela ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  
  // Header Fixo
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 82 + (Platform.OS === 'ios' ? 20 : 0), // Adiciona padding para iOS status bar
    backgroundColor: '#000048',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 40 : 10, // Ajuste para status bar
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10, 
  },
  backIcon: {
    width: 30, 
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    width: width * 0.5, 
    height: 33,
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginRight: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    paddingLeft: 10,
  },
  searchButton: {
    padding: 5,
  },
  
  // Lista de Chats
  list: {
    flex: 1,
    marginTop: 82 + (Platform.OS === 'ios' ? 20 : 0), // Espaço para o Header
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 200, 
  },

  // Footers Decorativos (Simulando div e footer)
  decorativeFooter: {
    position: 'absolute',
    bottom: 82, 
    left: 0,
    right: 0,
    height: 303, 
    backgroundColor: 'white',
    borderRadius: 30, 
    zIndex: 1,
  },
  absoluteFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 166, 
    backgroundColor: '#000048',
    zIndex: 0,
  }
});

// --- Estilos do Item de Chat ---
const itemStyles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    width: '100%', 
  },
  avatar: {
    width: 49,
    height: 47,
    borderRadius: 25, 
    marginRight: 15,
  },
  content: {
    flex: 1, 
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    color: 'black',
  },
  message: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'black',
    opacity: 0.7, 
  },
  time: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'black',
    marginLeft: 10,
  },
});