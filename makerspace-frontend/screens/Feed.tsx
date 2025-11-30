import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, Platform, Alert, ActivityIndicator } from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../api'; // <<-- SERVIÇO AXIOS
import { AppNavigationProp, RootStackParamList } from './App'; 

const { width } = Dimensions.get('window');

interface PostData { id: string; author: string; authorImage: string; postImage: string; description: string; timestamp: string; }
const assets = {
 authorImage1: require('../assets/image-8-3.png'), authorImage2: require('../assets/image-8-2.png'), authorImage3: require('../assets/image-8.png'),
 postImage1: require('../assets/2148863383-1.png'), postImage2: require('../assets/o-ensino-da-robotica-na-infancia-faz-diferenca-para-a-vida-1.png'), postImage3: require('../assets/hq720-1.png'),
 robotLogo: require('../assets/robot-6654031-640-2.png'),
};

const ActionButton: React.FC<{ label: string; iconName: string }> = ({ label, iconName }) => (
 <TouchableOpacity style={postStyles.actionButton}> <Icon name={iconName} size={24} color="black" /> <Text style={postStyles.actionText}>{label}</Text> </TouchableOpacity>
);

const Post: React.FC<{ post: PostData }> = ({ post }) => {
  // Corrigido: Garantindo que o cabeçalho não tenha nós de texto indesejados
 return (
  <View style={postStyles.postContainer}>
   <View style={postStyles.topLine} />
   <View style={postStyles.postHeader}> 
            <Image source={assets.authorImage1} style={postStyles.authorImage} resizeMode="cover" /> 
            <Text style={postStyles.authorName}>{post.author}</Text>
        </View>
   <Image source={{ uri: post.postImage || assets.postImage1 }} style={postStyles.postImage} resizeMode="cover" />
   <View style={postStyles.descriptionContainer}>
        {/* CORREÇÃO APLICADA AQUI (LINHA 32 ORIGINAL): 
            Tudo deve estar dentro da primeira tag <Text>, incluindo strings literais.
            Isso resolve o "Unexpected text node" e garante que apenas strings sejam renderizadas.
        */}
    <Text style={postStyles.descriptionText}> 
            <Text style={postStyles.authorNameInDescription}>{post.author} </Text>
            <Text style={postStyles.descriptionContent}>- {post.description}</Text> 
        </Text>
   </View>
   <View style={postStyles.actionRow}> <ActionButton label="Curtir" iconName="heart-outline" /> <ActionButton label="Comentar" iconName="chatbubble-outline" /> <ActionButton label="Enviar" iconName="share-outline" /> </View>
   <View style={postStyles.bottomLine} />
  </View>
 );
};

export const Feed = (): React.ReactElement => {
// ... (O resto do componente Feed não foi alterado, pois os erros estavam em Post)
 const navigation = useNavigation<AppNavigationProp>(); 
 const [posts, setPosts] = useState<PostData[]>([]); 
 const [loading, setLoading] = useState(true);

 const fetchPosts = async () => {
  try {
    setLoading(true);
    // GET Request autenticado
    const response = await api.get('/posts'); 
    
    // Exemplo de dados mockados para garantir que a lista não fique vazia se o backend não estiver rodando
    if (!response.data || response.data.length === 0) {
      setPosts([{ id: 'mock-1', author: 'Mock User', authorImage: '', postImage: 'https://via.placeholder.com/150', description: 'Post de exemplo: Seu servidor Node.js precisa retornar dados aqui.', timestamp: '2025-11-29' }]);
    } else {
      setPosts(response.data);
    }
    
  } catch (error: any) {
    console.error("Erro ao buscar posts:", error);
    let errorMessage = "Falha ao carregar o Feed. Verifique o servidor Node.js.";

    if (error.response && error.response.status === 401) {
      errorMessage = "Sessão expirada. Faça login novamente.";
    }
    Alert.alert("Erro de Dados", errorMessage);

  } finally {
    setLoading(false);
  }
 };

 useEffect(() => {
  fetchPosts();
 }, []);

 const renderPost = ({ item }: { item: PostData }) => <Post post={item} />;
 const handleMessagePress = () => { navigation.navigate('Chats'); };
 const navigateToScreen = (screenName: keyof RootStackParamList) => { navigation.navigate(screenName); };

 if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#000048" />
      <Text style={{marginTop: 10}}>Buscando posts...</Text>
    </View>
  );
 }

 return (
  <View style={styles.container}>
   <View style={styles.header}>
    <Image source={assets.robotLogo} style={styles.logo} resizeMode="contain" />
    <View style={styles.searchBarContainer}>
     <TextInput style={styles.searchInput} placeholder="" placeholderTextColor="#999" />
     <Icon name="search-outline" size={21} color="#333" style={styles.searchIcon} />
    </View>
    <TouchableOpacity style={styles.messageButton} onPress={handleMessagePress}>
     <Icon name="chatbubble-ellipses-outline" size={30} color="#000048" />
    </TouchableOpacity>
   </View>
   <FlatList data={posts} renderItem={renderPost} keyExtractor={(item) => item.id} contentContainerStyle={styles.feedList} ListEmptyComponent={() => <Text style={{textAlign: 'center', marginTop: 50}}>Nenhum post encontrado. Publique um!</Text>} />
   <View style={styles.footer}>
    <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Feed')}> <Icon name="home-outline" size={30} color="white" /> </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('ConectaMaker')}> <Icon name="compass-outline" size={30} color="white" /> </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Conexoes')}> <Icon name="location-outline" size={30} color="white" /> </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Perfil')}> <Icon name="person-outline" size={30} color="white" /> </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('PublicarProjetos')}> <Icon name="add-circle-outline" size={30} color="white" /> </TouchableOpacity>
   </View>
  </View>
 );
};

// ... (Estilos Stylesheet)
const styles = StyleSheet.create({
 loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
 container: { flex: 1, backgroundColor: 'white', },
 header: { position: 'absolute', top: 0, left: 0, right: 0, height: 86, backgroundColor: 'white', zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 30, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', },
 logo: { width: 73, height: 50, marginLeft: 0, },
 searchBarContainer: { flex: 1, height: 33, backgroundColor: 'white', borderRadius: 15, marginHorizontal: 10, borderWidth: 1, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', },
 searchInput: { flex: 1, height: '100%', paddingHorizontal: 15, fontSize: 14, color: '#333', },
 searchIcon: { paddingRight: 10, },
 messageButton: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', },
 feedList: { paddingTop: 86, paddingBottom: 82, paddingHorizontal: 10, },
 footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 82, backgroundColor: '#000048', zIndex: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', },
 navButton: { padding: 5, },
});

const postStyles = StyleSheet.create({
 postContainer: { width: width - 20, marginBottom: 20, backgroundColor: 'white', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd', },
 topLine: { height: 1, backgroundColor: '#ccc', marginHorizontal: 10, marginVertical: 10, },
 bottomLine: { height: 1, backgroundColor: '#ccc', marginHorizontal: 10, marginTop: 10, },
 postHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10, },
 authorImage: { width: 49, height: 47, borderRadius: 25, marginRight: 10, },
 authorName: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', color: 'black', },
 postImage: { width: '90%', height: 330, alignSelf: 'center', borderRadius: 4, },
 descriptionContainer: { paddingHorizontal: 15, paddingVertical: 10, },
 descriptionText: { fontSize: 11, color: 'black', lineHeight: 14, },
 authorNameInDescription: { fontWeight: '900', fontStyle: 'italic', },
 descriptionContent: { fontWeight: '600', fontStyle: 'italic', },
 actionRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10, marginTop: 5, },
 actionButton: { flexDirection: 'row', alignItems: 'center', padding: 8, },
 actionText: { fontSize: 15, fontWeight: '600', fontStyle: 'italic', color: 'black', marginLeft: 5, },
});