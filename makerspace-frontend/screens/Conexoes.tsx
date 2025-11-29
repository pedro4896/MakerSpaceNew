import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Dimensions } from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from './App'; 

const { width } = Dimensions.get('window');

const assets = { backIcon: require('../assets/image-26.png'), avatarMaria: require('../assets/image-14.png'), avatarJose: require('../assets/image-14.png'), };

interface Connection { id: number; name: string; description: string; avatar: any; status: 'Conectar' | 'Conectado'; }
const connectionsData: Connection[] = [
    { id: 1, name: "Maria Madalena", description: "Designer criativo com paixão por arte e tecnologia.", avatar: assets.avatarMaria, status: 'Conectar', },
    { id: 2, name: "José Davi", description: "Especialista em engenharia.", avatar: assets.avatarJose, status: 'Conectar', },
];

const ConnectionCard: React.FC<{ connection: Connection }> = ({ connection }) => {
    const handleConnect = () => { console.log(`Ação: ${connection.status} com ${connection.name}`); };
    return (
        <View style={cardStyles.cardContainer}>
            <View style={cardStyles.cardContent}>
                <Image source={connection.avatar} style={cardStyles.avatar} resizeMode="cover" />
                <View style={cardStyles.textGroup}>
                    <Text style={cardStyles.nameText}>{connection.name}</Text> <Text style={cardStyles.descriptionText}>{connection.description}</Text>
                </View>
                <TouchableOpacity style={cardStyles.connectButton} onPress={handleConnect} >
                    <Text style={cardStyles.connectButtonText}>{connection.status}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const Conexes = (): React.ReactElement => {
    const navigation = useNavigation<AppNavigationProp>();
    const handleVerMais = () => { console.log("Ver mais conexões clicado."); };
    
    const handleGoBack = () => { navigation.goBack(); }; // Funcional

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerBackground} />
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <Image source={assets.backIcon} style={styles.backIcon} resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Conexões</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {connectionsData.map((connection) => ( <ConnectionCard key={connection.id} connection={connection} /> ))}
                <TouchableOpacity style={styles.verMaisButton} onPress={handleVerMais}>
                    <Text style={styles.verMaisText}>Ver mais...</Text> <Icon name="chevron-down-outline" size={20} color="black" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
};

const cardStyles = StyleSheet.create({
    cardContainer: { width: width * 0.9, backgroundColor: '#000048', borderRadius: 20, padding: 15, marginBottom: 20, alignSelf: 'center', },
    cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }, avatar: { width: 50, height: 48, borderRadius: 24, marginRight: 10, },
    textGroup: { flex: 1, marginRight: 10, }, nameText: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 2, },
    descriptionText: { fontSize: 16, fontWeight: '600', color: 'white', lineHeight: 20, },
    connectButton: { width: 96, height: 27, backgroundColor: '#fdf6f6', borderRadius: 15, justifyContent: 'center', alignItems: 'center', },
    connectButtonText: { fontSize: 16, fontWeight: '600', color: 'black', }
});
const HEADER_HEIGHT = 85;
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', },
    header: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT, zIndex: 10, paddingTop: Platform.OS === 'ios' ? 40 : 10, paddingHorizontal: 15, },
    headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundColor: '#000048', },
    headerContent: { flexDirection: 'row', alignItems: 'center', },
    backButton: { padding: 5, }, backIcon: { width: 30, height: 30, marginRight: 10, },
    headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', },
    scrollView: { flex: 1, marginTop: HEADER_HEIGHT + 30, paddingHorizontal: 15, }, scrollContent: { paddingBottom: 20, alignItems: 'center', },
    verMaisButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 300, height: 50, backgroundColor: '#d9d9d9', borderRadius: 15, marginTop: 20, alignSelf: 'center', },
    verMaisText: { fontSize: 16, fontWeight: '500', color: 'black', },
});