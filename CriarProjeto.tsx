import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Platform,
    Alert,
} from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; 

const { width } = Dimensions.get('window');

// Mapeamento de Assets
const assets = {
    backIcon: require('./assets/image-26.png'),
    headerBackground: require('./assets/Rectangle-40.svg'), 
    uploadIcon: require('./assets/Vector.svg'),
    group49: require('./assets/Group-49.png'),
};

export const CriarProjeto = (): React.ReactElement => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [caption, setCaption] = useState("");

    const handleMediaSelection = () => {
        Alert.alert("Seleção de Mídia", "Aqui você chamaria a galeria/câmera.");
    };

    const handlePublish = () => {
        if (!mediaUri || caption.trim().length === 0) {
            Alert.alert("Erro", "Por favor, adicione uma imagem e uma legenda.");
            return;
        }
        console.log("Projeto Publicado:", { mediaUri, caption });
        navigation.goBack(); 
    };
    
    const handleGoBack = () => {
        navigation.goBack(); // CORREÇÃO: Chama a função goBack()
    };

    return (
        <View style={styles.container}>

            {/* --- HEADER (Fixo no Topo) --- */}
            <View style={styles.header}>
                {/* Fundo do Header */}
                <View style={styles.headerBackground} />
                <View style={styles.headerContent}>

                    {/* Botão Voltar (image38) - CONECTADO */}
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <Image source={assets.backIcon} style={styles.backIcon} resizeMode="contain" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Criar projetos</Text>
                </View>
            </View>

            {/* --- CONTEÚDO SCROLLABLE --- */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >

                {/* --- 1. BLOCO DE UPLOAD DE MÍDIA (Cinza Superior) --- */}
                <TouchableOpacity style={styles.mediaBlock} onPress={handleMediaSelection}>
                    {mediaUri ? (
                        <Image source={{ uri: mediaUri }} style={styles.uploadedMedia} resizeMode="cover" />
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            {/* Ícone de Upload (vector.svg) */}
                            <Icon name="image-outline" size={50} color="#000048" />
                            <Text style={styles.dragText}>Arraste a imagem</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Botão Procurar Imagem (Posicionado abaixo do bloco cinza) */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.searchImageButton}
                        onPress={handleMediaSelection}
                    >
                        <Text style={styles.searchImageButtonText}>Procurar Imagem</Text>
                    </TouchableOpacity>
                </View>


                {/* --- 2. BLOCO DE LEGENDA (Cinza Inferior) --- */}
                <View style={styles.captionBlock}>
                    <Text style={styles.captionLabel}>Adicione uma legenda...</Text>
                    <TextInput
                        style={styles.captionInput}
                        value={caption}
                        onChangeText={setCaption}
                        placeholder="Digite aqui a descrição do seu projeto..."
                        placeholderTextColor="#666"
                        multiline
                        textAlignVertical="top" 
                    />
                </View>

                {/* Separador (group-49.png) */}
                <Image source={assets.group49} style={styles.separator} resizeMode="stretch" />

                {/* --- 3. BOTÃO PUBLICAR (Fixo na parte inferior do scroll) - CONECTADO */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.publishButton}
                        onPress={handlePublish}
                        activeOpacity={mediaUri && caption.trim().length > 0 ? 0.7 : 1}
                        disabled={!mediaUri || caption.trim().length === 0}
                    >
                        <Text style={styles.publishButtonText}>Publicar</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 50 }} /> 

            </ScrollView>

        </View>
    );
};

// --- Estilos ---
const HEADER_HEIGHT = 85;

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
        height: HEADER_HEIGHT,
        zIndex: 10,
        paddingTop: Platform.OS === 'ios' ? 40 : 10,
        paddingHorizontal: 15,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: '#000048', 
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },

    // ScrollView (Conteúdo)
    scrollView: {
        flex: 1,
        marginTop: HEADER_HEIGHT, 
    },
    scrollContent: {
        paddingHorizontal: 15,
        alignItems: 'center',
        paddingBottom: 20,
    },

    // 1. Bloco de Mídia
    mediaBlock: {
        width: '100%',
        height: 323, 
        backgroundColor: '#d9d9d9',
        borderRadius: 15,
        marginTop: 20, 
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    uploadedMedia: {
        width: '100%',
        height: '100%',
    },
    uploadPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dragText: {
        fontSize: 16,
        fontWeight: '600',
        fontStyle: 'italic',
        color: '#000048',
        marginTop: 10,
    },

    // Botão "Procurar Imagem" (Posição absoluta no original, aqui usamos Flex)
    buttonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        marginTop: 15,
        marginBottom: 15,
    },
    searchImageButton: {
        width: 200,
        height: 50,
        backgroundColor: '#000048',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchImageButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontStyle: 'italic',
        color: 'white',
    },

    // 2. Bloco de Legenda
    captionBlock: {
        width: '100%',
        height: 323, 
        backgroundColor: '#d9d9d9',
        borderRadius: 15,
        marginTop: 20,
        padding: 15,
    },
    captionLabel: {
        fontSize: 16,
        fontWeight: '600',
        fontStyle: 'italic',
        color: '#000048',
        marginBottom: 5,
    },
    captionInput: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: 'black',
    },

    // Separador
    separator: {
        width: '100%',
        height: 1, 
        marginVertical: 15,
    },

    // Botão Publicar
    publishButton: {
        width: 200,
        height: 50,
        backgroundColor: '#000048',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    publishButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontStyle: 'italic',
        color: 'white',
    }
});