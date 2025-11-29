import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Platform, SafeAreaView } from "react-native";
import { Ionicons as Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from './App'; 

const { width } = Dimensions.get('window');

const assets = {
  logo: require('./assets/image-26.png'), settingsIcon: require('./assets/image-24.png'), profileAvatar: require('./assets/image-8.png'), coverImage: require('./assets/2148863383-1.png'),
  postImage1: require('./assets/2148863383-1.png'), postImage2: require('./assets/espacomaker-1.png'), postImage3: require('./assets/IMG-4331-1.png'), postImage4: require('./assets/oficina-de-eletronica-no-ensino-medio-02-1.png'),
};
const projectGallery = [
  { id: 1, image: assets.postImage1 }, { id: 2, image: assets.postImage2 }, { id: 3, image: assets.postImage3 }, { id: 4, image: assets.postImage4 },
];

const GalleryItem: React.FC<{ image: any }> = ({ image }) => (
  <TouchableOpacity style={galleryStyles.itemContainer}> <Image source={image} style={galleryStyles.image} resizeMode="cover" /> </TouchableOpacity>
);

export const Perfil: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>(); // Tipagem corrigida

    const handleSettingsPress = () => { navigation.navigate('Configuracoes'); };
    const handleGoBack = () => { navigation.goBack(); }; // Funcional
    const navigateToScreen = (screenName: keyof RootStackParamList) => { navigation.navigate(screenName); };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerBackground} /> 
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={handleGoBack}> <Image source={assets.logo} style={styles.logo} resizeMode="contain" /> </TouchableOpacity>
                    <Text style={styles.headerTitle}>Perfil</Text>
                    <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}> <Image source={assets.settingsIcon} style={styles.settingsIcon} resizeMode="contain" /> </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileSection}>
                    <View style={styles.bioContainer}>
                        <Image source={assets.profileAvatar} style={styles.avatar} resizeMode="cover" />
                        <View style={styles.bioText}> <Text style={styles.nameText}>Ana Júlia</Text> <Text style={styles.usernameText}>@anajulia</Text> </View>
                    </View>
                    <Image source={assets.coverImage} style={styles.coverImage} resizeMode="cover" />
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}> <Text style={styles.statCount}>10</Text> <Text style={styles.statLabel}>Projetos</Text> </View>
                        <View style={styles.statItem}> <Text style={styles.statCount}>200</Text> <Text style={styles.statLabel}>Conexões</Text> </View>
                    </View>
                </View>
                <View style={styles.galleryHeader}>
                    <Text style={styles.galleryTitle}>Galeria de Projetos</Text>
                    <View style={styles.galleryIcons}>
                        <TouchableOpacity style={{ padding: 5 }}><Ionicons name="grid-outline" size={24} color="black" /></TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5 }}><Ionicons name="list-outline" size={24} color="black" /></TouchableOpacity>
                    </View>
                </View>
                <View style={styles.galleryContainer}>
                    {projectGallery.map((item) => ( <GalleryItem key={item.id} image={item.image} /> ))}
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Feed')}> <Ionicons name="home-outline" size={30} color="white" /> </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('ConectaMaker')}> <Ionicons name="compass-outline" size={30} color="white" /> </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Conexoes')}> <Ionicons name="location-outline" size={30} color="white" /> </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('Chats')}> <Ionicons name="chatbubble-outline" size={30} color="white" /> </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigateToScreen('PublicarProjetos')}> <Ionicons name="ellipsis-horizontal-circle-outline" size={30} color="white" /> </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// ... estilos removidos por brevidade ...
const ITEM_MARGIN = 5;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (width / NUM_COLUMNS) - (ITEM_MARGIN * 2);
const galleryStyles = StyleSheet.create({
  itemContainer: { width: ITEM_WIDTH, height: ITEM_WIDTH, margin: ITEM_MARGIN, },
  image: { width: '100%', height: '100%', borderRadius: 5, },
});
const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = 85;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', },
  header: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT, zIndex: 10, paddingTop: Platform.OS === 'ios' ? 20 : 10, paddingHorizontal: 15, },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundColor: '#000048', },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: '100%', },
  logo: { width: 81, height: 42, }, headerTitle: { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 'bold', },
  settingsButton: { padding: 5, }, settingsIcon: { width: 30, height: 30, },
  scrollView: { flex: 1, marginTop: HEADER_HEIGHT, }, scrollContent: { paddingBottom: FOOTER_HEIGHT, },
  profileSection: { alignItems: 'center', paddingBottom: 20, backgroundColor: '#f9f9f9', }, bioContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingVertical: 15, },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 10, }, bioText: { justifyContent: 'center', },
  nameText: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', color: 'black', }, usernameText: { fontSize: 15, fontWeight: '600', fontStyle: 'italic', color: 'black', },
  coverImage: { width: width * 0.95, height: 200, marginBottom: 15, borderRadius: 8, },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '60%', marginBottom: 10, },
  statItem: { alignItems: 'center', marginHorizontal: 10, },
  statCount: { fontSize: 15, fontWeight: '600', fontStyle: 'italic', color: 'black', }, statLabel: { fontSize: 15, fontWeight: '600', fontStyle: 'italic', color: 'black', },
  galleryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#ccc', borderBottomWidth: 1, borderBottomColor: '#ccc', marginTop: 10, },
  galleryTitle: { fontSize: 15, fontWeight: '600', fontStyle: 'italic', color: 'black', }, galleryIcons: { flexDirection: 'row', },
  galleryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', paddingHorizontal: 10, paddingVertical: 10, },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: FOOTER_HEIGHT, backgroundColor: '#000048', zIndex: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 20 : 5, },
  navButton: { padding: 5, },
});