import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; 

const { width } = Dimensions.get('window');

// 1. Definição da interface de dados
interface PostData {
  id: number;
  author: string;
  authorImage: any; 
  postImage: any;
  description: string;
}

// 2. Importação e Mapeamento dos Assets
const assets = {
  authorImage1: require('./assets/image-8-3.png'),
  authorImage2: require('./assets/image-8-2.png'),
  authorImage3: require('./assets/image-8.png'),
  postImage1: require('./assets/2148863383-1.png'),
  postImage2: require('./assets/o-ensino-da-robotica-na-infancia-faz-diferenca-para-a-vida-1.png'),
  postImage3: require('./assets/hq720-1.png'),
  robotLogo: require('./assets/robot-6654031-640-2.png'),
};

const postsData: PostData[] = [
  {
    id: 1,
    author: "Ana Júlia",
    authorImage: assets.authorImage1,
    postImage: assets.postImage1,
    description: "Transforme ideias em realidade! Aprenda eletrônica do básico ao avançado e consquiste novas oportunidades. Inscreva-se agora.",
  },
  {
    id: 2,
    author: "Arthur Silva",
    authorImage: assets.authorImage2,
    postImage: assets.postImage2,
    description: "Desperte o engenheiro que há em você! Aprenda a criar e programar robôs do zero com nosso curso de robótica. Inscreva-se e domine o futuro!",
  },
  {
    id: 3,
    author: "Antônio Pedro",
    authorImage: assets.authorImage3,
    postImage: assets.postImage3,
    description: "Dê vida para suas ideias em 3D! Aprenda modelagem 3D do básico oa avançado e transforme criatividade em realidade. Inscreva-se agora!",
  },
];

// --- Componente de Ação (Curtir/Comentar/Enviar) --- 
const ActionButton: React.FC<{ label: string; iconName: string }> = ({ label, iconName }) => (
  <TouchableOpacity style={postStyles.actionButton}>
    <Icon name={iconName} size={24} color="black" />
    <Text style={postStyles.actionText}>{label}</Text>
  </TouchableOpacity>
);

// --- Componente de Post Individual --- 
const Post: React.FC<{ post: PostData }> = ({ post }) => {
  return (
    <View style={postStyles.postContainer}>
      <View style={postStyles.topLine} />

      {/* Cabeçalho do Post (Autor e Imagem do Perfil) */}
      <View style={postStyles.postHeader}>
        <Image 
          source={post.authorImage} 
          style={postStyles.authorImage} 
          resizeMode="cover" 
        />
        <Text style={postStyles.authorName}>{post.author}</Text>
      </View>

      {/* Imagem da Postagem */}
      <Image 
        source={post.postImage} 
        style={postStyles.postImage} 
        resizeMode="cover" 
      />

      {/* Descrição */}
      <View style={postStyles.descriptionContainer}>
        <Text style={postStyles.descriptionText}>
          <Text style={postStyles.authorNameInDescription}>{post.author} - </Text>
          <Text style={postStyles.descriptionContent}>{post.description}</Text>
        </Text>
      </View>

      {/* Botões de Ação (Curtir, Comentar, Enviar) */}
      <View style={postStyles.actionRow}>
        <ActionButton label="Curtir" iconName="heart-outline" />
        <ActionButton label="Comentar" iconName="chatbubble-outline" />
        <ActionButton label="Enviar" iconName="share-outline" />
      </View>

      {/* Linha de separação inferior (substituindo line-1-3.svg) */}
      <View style={postStyles.bottomLine} />
    </View>
  );
};

// --- Tela Principal do Feed ---
export const Feed = (): React.ReactElement => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Render Item para FlatList
  const renderPost = ({ item }: { item: PostData }) => <Post post={item} />;

  // Navegação para a tela de Chats
  const handleMessagePress = () => {
    navigation.navigate('Chats');
  };
  
  // Função de navegação para a Navbar
  const navigateToScreen = (screenName: keyof RootStackParamList) => {
    // Isso usa replace se você já estiver na tela, para evitar duplicação na pilha
    if (navigation.getState().routes[navigation.getState().index].name === screenName) {
        return;
    }
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      
      {/* --- HEADER (FIXO NO TOPO) --- */}
      <View style={styles.header}>
        {/* Logo (Robô) */}
        <Image source={assets.robotLogo} style={styles.logo} resizeMode="contain" />
        
        {/* Campo de Busca */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder=""
            placeholderTextColor="#999"
          />
          {/* Ícone de Busca */}
          <Icon name="search-outline" size={21} color="#333" style={styles.searchIcon} />
        </View>

        {/* Botão de Mensagens - CONECTADO */}
        <TouchableOpacity style={styles.messageButton} onPress={handleMessagePress}>
          <Icon name="chatbubble-ellipses-outline" size={30} color="#000048" />
        </TouchableOpacity>
      </View>

      {/* --- FEED DE POSTAGENS (SCROLLABLE) --- */}
      <FlatList
        data={postsData}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.feedList}
      />

      {/* --- FOOTER/NAV BAR (FIXO NA PARTE INFERIOR) - CONECTADO --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Feed')}>
          <Icon name="home-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('ConectaMaker')}>
          <Icon name="compass-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Conexoes')}>
          <Icon name="location-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Perfil')}>
          <Icon name="person-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('PublicarProjetos')}>
            <Icon name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Estilos Globais do Feed ---
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
    height: 86,
    backgroundColor: 'white', 
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 30, 
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    width: 73,
    height: 50, 
    marginLeft: 0,
  },
  searchBarContainer: {
    flex: 1,
    height: 33,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    paddingRight: 10,
  },
  messageButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Lista de Posts (FlatList)
  feedList: {
    paddingTop: 86, 
    paddingBottom: 82, 
    paddingHorizontal: 10,
  },

  // Footer Fixo (Navigation Bar)
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 82,
    backgroundColor: '#000048',
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    padding: 5,
  },
});

// --- Estilos do Componente Post ---
const postStyles = StyleSheet.create({
  postContainer: {
    width: width - 20, 
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  topLine: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  bottomLine: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    marginTop: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  authorImage: {
    width: 49,
    height: 47,
    borderRadius: 25, 
    marginRight: 10,
  },
  authorName: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    color: 'black',
  },
  postImage: {
    width: '90%',
    height: 330,
    alignSelf: 'center',
    borderRadius: 4,
  },
  descriptionContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  descriptionText: {
    fontSize: 11,
    color: 'black',
    lineHeight: 14,
  },
  authorNameInDescription: {
    fontWeight: '900',
    fontStyle: 'italic',
  },
  descriptionContent: {
    fontWeight: '600',
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'italic',
    color: 'black',
    marginLeft: 5,
  },
});