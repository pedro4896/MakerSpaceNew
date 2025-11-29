import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
} from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; 

// Mapeamento de Assets 
const assets = {
    backIcon: require('./assets/image-26.png'), 
    searchIcon: require('./assets/image-25.png'), 
};

// --- Componente de Item de Configuração ---
interface ConfigItemProps {
    iconName: string;
    title: string;
    onPress: () => void;
}

const ConfigItem: React.FC<ConfigItemProps> = ({ iconName, title, onPress }) => (
    <TouchableOpacity style={itemStyles.itemContainer} onPress={onPress}>
        <View style={itemStyles.iconWrapper}>
            <Icon name={iconName} size={30} color="black" />
        </View>

        {/* Título */}
        <Text style={itemStyles.title}>
            {title}
        </Text>
    </TouchableOpacity>
);

// --- Tela Principal de Configurações ---
export const Configuraes = (): React.ReactElement => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleAction = (action: string) => {
        console.log(`Ação clicada: ${action}`);
        if (action === 'Voltar') {
            navigation.goBack(); // CORREÇÃO: Chama a função goBack()
            return;
        }
        if (action === 'Dados da conta') {
            navigation.navigate('Perfil');
            return;
        }
        if (action === 'Sair') {
            navigation.navigate('Login');
            return;
        }
        // ... outras ações de configurações ...
    };

    return (
        <View style={styles.container}>

            {/* --- HEADER (Fixo no Topo) --- */}
            <View style={styles.header}>
                {/* Fundo do Header (rectangle10.svg) */}
                <View style={styles.headerBackground} />
                <View style={styles.headerContent}>

                    {/* Botão Voltar (image26) - CONECTADO */}
                    <TouchableOpacity onPress={() => handleAction('Voltar')} style={styles.backButton}>
                        <Image source={assets.backIcon} style={styles.backIcon} resizeMode="contain" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Configurações</Text>

                    {/* Ícone de Busca/Ação (image25) */}
                    <TouchableOpacity onPress={() => handleAction('Buscar/Ação')} style={styles.searchButton}>
                        <Image source={assets.searchIcon} style={styles.searchIcon} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- LISTA DE CONFIGURAÇÕES (Scrollable) - CONECTADO */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <ConfigItem
                    iconName="help-circle-outline"
                    title="Ajuda"
                    onPress={() => handleAction('Ajuda')}
                />
                <ConfigItem
                    iconName="lock-closed-outline"
                    title="Segurança"
                    onPress={() => handleAction('Segurança')}
                />
                <ConfigItem
                    iconName="shield-checkmark-outline"
                    title="Privacidade"
                    onPress={() => handleAction('Privacidade')}
                />
                <ConfigItem
                    iconName="person-circle-outline"
                    title="Dados da conta"
                    onPress={() => handleAction('Dados da conta')}
                />
                <ConfigItem
                    iconName="accessibility-outline"
                    title="Acessibilidade"
                    onPress={() => handleAction('Acessibilidade')}
                />
                <ConfigItem
                    iconName="log-out-outline"
                    title="Sair da conta"
                    onPress={() => handleAction('Sair')}
                />

                {/* Adicione mais espaço no final da lista, se necessário */}
                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
};

// --- Estilos do Item de Configuração ---
const itemStyles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconWrapper: {
        width: 45, 
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        fontStyle: 'italic',
        color: 'black',
        flex: 1, 
    },
});

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
        height: 80, 
        zIndex: 10,
        paddingTop: Platform.OS === 'ios' ? 40 : 10,
        paddingHorizontal: 15,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 77, 
        backgroundColor: '#000048', 
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        width: 50, 
        height: 25,
        marginLeft: 0,
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    searchButton: {
        padding: 5,
    },
    searchIcon: {
        width: 26,
        height: 21,
        marginRight: 0, 
    },

    // ScrollView (Conteúdo)
    scrollView: {
        flex: 1,
        marginTop: 77, 
    },
    scrollContent: {
        paddingTop: 10,
    },
});