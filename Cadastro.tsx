import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; 

// Importações de assets 
const image26 = require('./assets/image-26.png'); 
const robotImage = require('./assets/robot-6654031-640-1.png'); 

export const Cadastro = (): React.ReactElement => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState({
    username: "",
    login: "",
    password: "",
    email: "",
    profileImage: null as string | null, 
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePick = async () => {
    Alert.alert("Upload de Imagem", "Aqui abriria a galeria para selecionar a foto.");
    console.log("Abrir seletor de imagem");
  };

  const handleSubmit = () => {
    console.log("Formulário submetido:", formData);
    navigation.navigate('Verificacao');
  };
  
  const handleGoBack = () => {
      navigation.goBack(); // CORREÇÃO: Chama a função goBack()
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      
      {/* --- Cabeçalho Azul Superior --- */}
      <View style={styles.headerContainer}>
        {/* Fundo do cabeçalho (rectangle10.svg convertido em View) */}
        <View style={styles.headerBackground}>
          <Text style={styles.headerTitle}>Cadastro</Text>
          {/* Botão de Voltar - CONECTADO */}
          <TouchableOpacity onPress={handleGoBack} style={styles.headerIconWrapper}>
            <Image source={image26} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Área de Upload de Imagem --- */}
      <View style={styles.uploadSection}>
        {/* Título da seção de imagem (fundo 'image.svg' convertido em estilo) */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitleText}>Insira uma imagem de Perfil</Text>
        </View>

        {/* Círculo de Imagem / Botão de Upload */}
        <TouchableOpacity onPress={handleImagePick} style={styles.profileImageCircle}>
          {formData.profileImage ? (
            <Image 
              source={{ uri: formData.profileImage }} 
              style={styles.uploadedImage} 
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              {/* Ícone de upload (vector.svg) placeholder */}
              <Text style={{ fontSize: 24 }}>📷</Text> 
              <Text style={styles.dragText}>Arraste a imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Botão 'Procurar Imagem' */}
        <TouchableOpacity onPress={handleImagePick} style={styles.searchImageButton}>
          <Text style={styles.searchImageButtonText}>Procurar Imagem</Text>
        </TouchableOpacity>
      </View>

      {/* --- Formulário --- */}
      <View style={styles.formContainer}>
        
        {/* Campo: Nome de Usuário */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome de Usuário:</Text>
          <View style={styles.inputWrapper}>
             {/* Simula o 'rectangle28.svg' com estilos */}
            <TextInput
              value={formData.username}
              onChangeText={(text) => handleInputChange("username", text)}
              placeholder="Digite aqui..."
              placeholderTextColor="#979696"
              style={styles.input}
            />
          </View>
        </View>

        {/* Campo: Login */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Login:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={formData.login}
              onChangeText={(text) => handleInputChange("login", text)}
              placeholder="Digite aqui..."
              placeholderTextColor="#979696"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Campo: Senha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              placeholder="Digite aqui..."
              placeholderTextColor="#979696"
              style={styles.input}
              secureTextEntry
            />
          </View>
        </View>

        {/* Campo: Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Digite aqui..."
              placeholderTextColor="#979696"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Botão Cadastrar - CONECTADO */}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Cadastrar</Text>
        </TouchableOpacity>

      </View>

      {/* --- Rodapé com Robô --- */}
      <View style={styles.footerContainer}>
        {/* Fundo Azul Inferior */}
        <View style={styles.blueFooterBackground} />

        {/* Imagem do Robô */}
        <Image 
          source={robotImage} 
          style={styles.footerRobot} 
          resizeMode="contain" 
        />

        {/* Título Final */}
        <Text style={styles.footerTitle}>
          BEM VINDO AO MAKERSPACE
        </Text>
      </View>

    </ScrollView>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 0, 
    minHeight: '100%',
  },
  
  // Header
  headerContainer: {
    width: '100%',
    height: 77,
    marginBottom: 20,
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000048', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 60, 
  },
  headerIconWrapper: {
    position: 'absolute',
    left: 5,
    top: 15,
    padding: 10,
  },
  headerIcon: {
    width: 81,
    height: 42,
    resizeMode: 'contain',
  },

  // Seção de Upload
  uploadSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitleContainer: {
    width: '90%',
    maxWidth: 397,
    height: 48,
    borderWidth: 1, 
    borderColor: '#000048', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0', 
  },
  sectionTitleText: {
    color: '#000048',
    fontSize: 20,
    fontWeight: '900', 
    fontStyle: 'italic',
  },
  profileImageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragText: {
    fontSize: 10,
    color: '#000048',
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  searchImageButton: {
    backgroundColor: '#000048',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  searchImageButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  // Formulário
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  label: {
    width: '40%', 
    color: '#000048',
    fontSize: 18,
    fontWeight: '900', 
    fontStyle: 'italic',
  },
  inputWrapper: {
    width: '60%', 
    height: 48,
    backgroundColor: '#f5f5f5', 
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8, 
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 10,
    color: '#000048', 
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#000048',
    width: 107,
    height: 31,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end', 
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  // Footer
  footerContainer: {
    position: 'relative',
    height: 320, 
    marginTop: 20,
    alignItems: 'center',
  },
  blueFooterBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 314, 
    backgroundColor: '#000048',
  },
  footerRobot: {
    position: 'absolute',
    bottom: 0, 
    left: 0,
    width: '100%',
    height: 361, 
    zIndex: 1,
  },
  footerTitle: {
    position: 'absolute',
    bottom: 10, 
    color: 'white',
    fontSize: 32, 
    fontWeight: '900',
    fontStyle: 'italic',
    textAlign: 'center',
    zIndex: 2, 
    width: '80%',
  },
});