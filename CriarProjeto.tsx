import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Platform, Alert, ActivityIndicator } from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from './api'; // <<-- SERVIÇO AXIOS
import { AppNavigationProp } from './App'; 

const { width } = Dimensions.get('window');

const assets = { backIcon: require('./assets/image-26.png'), group49: require('./assets/Group-49.png'), };

export const CriarProjeto = (): React.ReactElement => {
    const navigation = useNavigation<AppNavigationProp>();
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);

    const handleMediaSelection = () => { Alert.alert("Seleção de Mídia", "Aqui você chamaria a galeria/câmera. O mediaUri deve ser a URL pública da imagem."); setMediaUri('https://via.placeholder.com/150/000048/FFFFFF?text=IMAGEM_MOCK'); }; // Mocka a URL da imagem

    const handlePublish = async () => {
        if (!mediaUri || caption.trim().length === 0) { Alert.alert("Erro", "Por favor, adicione uma imagem e uma legenda."); return; }
        
        setLoading(true);
        try {
            await api.post('/posts', { // Chamada ao endpoint Node.js
                // Em uma aplicação real, mediaUri seria a URL pública da imagem
                postImage: mediaUri, 
                description: caption,
            });

            Alert.alert("Sucesso", "Projeto publicado com sucesso!");
            navigation.navigate('Feed');

        } catch (e: any) {
             let errorMessage = "Falha ao publicar. Sessão expirada ou erro do servidor.";
             if (e.response && e.response.data && e.response.data.message) {
                 errorMessage = e.response.data.message;
             }
            console.error("Erro ao publicar projeto: ", e);
            Alert.alert("Erro", errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoBack = () => { navigation.goBack(); };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerBackground} />
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}> <Image source={assets.backIcon} style={styles.backIcon} resizeMode="contain" /> </TouchableOpacity>
                    <Text style={styles.headerTitle}>Criar projetos</Text>
                </View>
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <TouchableOpacity style={styles.mediaBlock} onPress={handleMediaSelection} disabled={loading}>
                    {mediaUri ? ( <Image source={{ uri: mediaUri }} style={styles.uploadedMedia} resizeMode="cover" /> ) : (
                        <View style={styles.uploadPlaceholder}> <Icon name="image-outline" size={50} color="#000048" /> <Text style={styles.dragText}>Arraste a imagem</Text> </View>
                    )}
                </TouchableOpacity>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.searchImageButton} onPress={handleMediaSelection} disabled={loading}>
                        <Text style={styles.searchImageButtonText}>Procurar Imagem</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.captionBlock}>
                    <Text style={styles.captionLabel}>Adicione uma legenda...</Text>
                    <TextInput style={styles.captionInput} value={caption} onChangeText={setCaption} placeholder="Digite aqui a descrição do seu projeto..." placeholderTextColor="#666" multiline textAlignVertical="top" editable={!loading} />
                </View>
                <Image source={assets.group49} style={styles.separator} resizeMode="stretch" />
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.publishButton} onPress={handlePublish} activeOpacity={mediaUri && caption.trim().length > 0 ? 0.7 : 1} disabled={!mediaUri || caption.trim().length === 0 || loading} >
                        {loading ? ( <ActivityIndicator color="white" /> ) : ( <Text style={styles.publishButtonText}>Publicar</Text> )}
                    </TouchableOpacity>
                </View>
                <View style={{ height: 50 }} /> 
            </ScrollView>
        </View>
    );
};

// ... (Estilos Stylesheet)
const HEADER_HEIGHT = 85;
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', },
    header: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT, zIndex: 10, paddingTop: Platform.OS === 'ios' ? 40 : 10, paddingHorizontal: 15, },
    headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundColor: '#000048', },
    headerContent: { flexDirection: 'row', alignItems: 'center', }, backButton: { padding: 5, }, backIcon: { width: 30, height: 30, marginRight: 10, },
    headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', },
    scrollView: { flex: 1, marginTop: HEADER_HEIGHT, }, scrollContent: { paddingHorizontal: 15, alignItems: 'center', paddingBottom: 20, },
    mediaBlock: { width: '100%', height: 323, backgroundColor: '#d9d9d9', borderRadius: 15, marginTop: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', },
    uploadedMedia: { width: '100%', height: '100%', }, uploadPlaceholder: { justifyContent: 'center', alignItems: 'center', },
    dragText: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: '#000048', marginTop: 10, },
    buttonRow: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15, marginBottom: 15, },
    searchImageButton: { width: 200, height: 50, backgroundColor: '#000048', borderRadius: 15, justifyContent: 'center', alignItems: 'center', },
    searchImageButtonText: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: 'white', },
    captionBlock: { width: '100%', height: 323, backgroundColor: '#d9d9d9', borderRadius: 15, marginTop: 20, padding: 15, },
    captionLabel: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: '#000048', marginBottom: 5, },
    captionInput: { flex: 1, backgroundColor: 'white', borderRadius: 10, padding: 10, fontSize: 16, color: 'black', },
    separator: { width: '100%', height: 1, marginVertical: 15, },
    publishButton: { width: 200, height: 50, backgroundColor: '#000048', borderRadius: 15, justifyContent: 'center', alignItems: 'center', },
    publishButtonText: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: 'white', }
});