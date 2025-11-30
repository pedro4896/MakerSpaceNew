import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Alert, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { AppNavigationProp } from './App'; 
import api from '../api'; // <<-- SERVIÇO AXIOS (Usado indiretamente no logout)

const { width } = Dimensions.get('window');
const assets = { backIcon: require('../assets/image-26.png'), searchIcon: require('../assets/image-25.png'), };

interface ConfigItemProps { iconName: string; title: string; onPress: () => void; }

const ConfigItem: React.FC<ConfigItemProps> = ({ iconName, title, onPress }) => (
    <TouchableOpacity style={itemStyles.itemContainer} onPress={onPress}>
        <View style={itemStyles.iconWrapper}> <Icon name={iconName} size={30} color="black" /> </View>
        <Text style={itemStyles.title}> {title} </Text>
    </TouchableOpacity>
);

export const Configuraes = (): React.ReactElement => {
    const navigation = useNavigation<AppNavigationProp>(); 

const handleLogout = () => {
        console.log("1. handleLogout chamado. Tentando exibir o Alert."); // Seu log original

        // 💡 CORREÇÃO: Usando setTimeout para resolver problemas de timing/bloqueio do UI Thread
        setTimeout(() => {
            Alert.alert(
                "Sair da Conta", "Tem certeza que deseja sair?",
                [
                    { 
                        text: "Cancelar", 
                        style: "cancel",
                        onPress: () => console.log("Ação: Cancelar") 
                    },
                    { 
                        text: "Sair", 
                        onPress: async () => {
                            console.log("2. Botão 'Sair' do Alert pressionado. Tentando remover token.");
                            try {
                                // 1. Remove o token de persistência localmente
                                await AsyncStorage.removeItem('userToken');
                                console.log("3. userToken removido com sucesso."); 
                                
                                // 2. Navega para Login (limpa o histórico)
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }], });
                                console.log("4. Navegação para Login realizada.");
                            } catch (e) {
                                Alert.alert("Erro", "Não foi possível encerrar a sessão.");
                                console.error("ERRO ASYNCSTORAGE/LOGOUT:", e);
                            }
                        }
                    }
                ]
            );
        }, 0); // 0ms garante a execução no próximo tick

    };

    const handleAction = (action: string) => {
        if (action === 'Voltar') { navigation.goBack(); return; }
        if (action === 'Dados da conta') { navigation.navigate('Perfil'); return; }
        if (action === 'Sair') { handleLogout(); return; }
        console.log(`Ação clicada: ${action}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerBackground} />
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => handleAction('Voltar')} style={styles.backButton}>
                        <Image source={assets.backIcon} style={styles.backIcon} resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Configurações</Text>
                    <TouchableOpacity onPress={() => handleAction('Buscar/Ação')} style={styles.searchButton}>
                        <Image source={assets.searchIcon} style={styles.searchIcon} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <ConfigItem iconName="help-circle-outline" title="Ajuda" onPress={() => handleAction('Ajuda')} />
                <ConfigItem iconName="lock-closed-outline" title="Segurança" onPress={() => handleAction('Segurança')} />
                <ConfigItem iconName="shield-checkmark-outline" title="Privacidade" onPress={() => handleAction('Privacidade')} />
                <ConfigItem iconName="person-circle-outline" title="Dados da conta" onPress={() => handleAction('Dados da conta')} />
                <ConfigItem iconName="accessibility-outline" title="Acessibilidade" onPress={() => handleAction('Acessibilidade')} />
                <ConfigItem iconName="log-out-outline" title="Sair da conta" onPress={() => handleAction('Sair')} />
                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
};

// ... (Estilos Stylesheet)
const itemStyles = StyleSheet.create({
    itemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 25, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', },
    iconWrapper: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', marginRight: 15, },
    title: { fontSize: 20, fontWeight: '600', fontStyle: 'italic', color: 'black', flex: 1, },
});
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', },
    header: { position: 'absolute', top: 0, left: 0, right: 0, height: 80, zIndex: 10, paddingTop: Platform.OS === 'ios' ? 40 : 10, paddingHorizontal: 15, },
    headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 77, backgroundColor: '#000048', },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: '100%', },
    backButton: { padding: 5, }, backIcon: { width: 50, height: 25, marginLeft: 0, },
    headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', }, searchButton: { padding: 5, }, searchIcon: { width: 26, height: 21, marginRight: 0, },
    scrollView: { flex: 1, marginTop: 77, }, scrollContent: { paddingTop: 10, },
});