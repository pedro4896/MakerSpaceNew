import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions,
} from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; 

const { width } = Dimensions.get('window');

// Mapeamento de Assets
const assets = {
    backIcon: require('./assets/image-26.png'),
};

// --- Componente Botão de Ação ---
interface ActionButtonProps {
    title: string;
    isPrimary?: boolean; 
    isWhite?: boolean;  
    onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, isPrimary = false, isWhite = false, onPress }) => {
    let buttonStyle: any[] = [actionStyles.button];
    let textStyle: any[] = [actionStyles.buttonText];

    if (isPrimary) {
        buttonStyle.push(actionStyles.primaryBackground);
        textStyle.push(actionStyles.whiteText);
    } else if (isWhite) {
        buttonStyle.push(actionStyles.whiteBackground);
        textStyle.push(actionStyles.darkText);
    } else {
        buttonStyle.push(actionStyles.primaryBackground);
        textStyle.push(actionStyles.whiteText);
    }

    textStyle.push(actionStyles.semiBoldItalic);

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={textStyle}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

// --- Tela Principal ---
export const PublicarProjetos = (): React.ReactElement => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleAction = (action: string) => {
        console.log(`Ação clicada: ${action}`);
        if (action === 'Voltar') {
            navigation.goBack(); // CORREÇÃO: Chama a função goBack()
            return;
        }
        if (action === 'Criar Projeto') {
            navigation.navigate('CriarProjeto');
            return;
        }
        if (action === 'Ver Projetos' || action === 'Gerenciar Conteúdo') {
            navigation.navigate('Feed');
            return;
        }
    };

    return (
        <View style={styles.container}>

            {/* --- HEADER (Fixo no Topo) --- */}
            <View style={styles.header}>
                {/* Fundo do Header (rectangle40.svg) */}
                <View style={styles.headerBackground} />
                <View style={styles.headerContent}>

                    {/* Botão Voltar (image38) - CONECTADO */}
                    <TouchableOpacity onPress={() => handleAction('Voltar')} style={styles.backButton}>
                        <Image source={assets.backIcon} style={styles.backIcon} resizeMode="contain" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Publicar projetos</Text>
                </View>
            </View>

            {/* --- CONTEÚDO PRINCIPAL (Centralizado) --- */}
            <View style={styles.contentArea}>

                {/* Fundo Cinza para o Menu (d9d9d9) */}
                <View style={styles.menuBackground}>

                    {/* Botão 1: Criar novo projeto (Fundo Branco) - CONECTADO */}
                    <ActionButton
                        title="Criar novo projeto"
                        isWhite
                        onPress={() => handleAction('Criar Projeto')}
                    />

                    {/* Botão 2: Ver projetos existentes (Fundo Azul) - CONECTADO */}
                    <ActionButton
                        title="Ver projetos existentes"
                        isPrimary
                        onPress={() => handleAction('Ver Projetos')}
                    />

                    {/* Botão 3: Gerenciar conteúdo publicado (Fundo Azul) - CONECTADO */}
                    <ActionButton
                        title="Gerenciar conteúdo publicado"
                        isPrimary
                        onPress={() => handleAction('Gerenciar Conteúdo')}
                    />

                </View>

            </View>

        </View>
    );
};

// --- Estilos dos Botões de Ação ---
const actionStyles = StyleSheet.create({
    button: {
        width: 280, 
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, 
        ...Platform.select({ 
            ios: { shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { height: 2, width: 0 } },
            android: { elevation: 3 },
        }),
    },
    primaryBackground: {
        backgroundColor: '#000048', 
    },
    whiteBackground: {
        backgroundColor: 'white',
        borderWidth: 1, 
        borderColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    darkText: {
        color: 'black',
    },
    whiteText: {
        color: 'white',
    },
    semiBoldItalic: {
        fontWeight: '600',
        fontStyle: 'italic',
    }
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
        height: 85,
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

    // Área de Conteúdo (Menu)
    contentArea: {
        flex: 1,
        marginTop: 85, 
        alignItems: 'center',
        paddingTop: 30, 
    },
    menuBackground: {
        width: width * 0.9, 
        maxWidth: 380,
        paddingVertical: 30,
        backgroundColor: '#d9d9d9', 
        borderRadius: 15,
        alignItems: 'center',
    },
});