import React, { useState } from "react";
import { 
    View, Text, TextInput, StyleSheet, TouchableOpacity, 
    Image, ScrollView, Alert, Platform, Dimensions, ActivityIndicator 
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import api from '../api'; 
import { AppNavigationProp } from './App';
import * as ImagePicker from 'expo-image-picker'; // 🔑 NOVO: Importa o ImagePicker
import { Ionicons as Icon } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');
const image26 = require('../assets/image-26.png'); 

export const Cadastro = (): React.ReactElement => {
  const navigation = useNavigation<AppNavigationProp>(); 
  const [formData, setFormData] = useState({
    username: "", login: "", password: "", email: "", 
    profileImage: null as string | null, // Guarda o URI da imagem
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => { setFormData((prev) => ({ ...prev, [field]: value, })); };
  
  // 📸 Implementação COMPLETA do ImagePicker
  const handleImagePick = async () => {
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão Necessária", "Precisamos da permissão para acessar a galeria de fotos.");
            return;
        }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 0.8, 
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setFormData((prev) => ({ ...prev, profileImage: uri }));
    }
  };

  const handleSubmit = async () => {
    const { email, password, username, login, profileImage } = formData;
    if (!email || !password || !username) { Alert.alert("Erro", "Preencha todos os campos obrigatórios."); return; }

    setLoading(true);
    
    // 🔑 1. CRIAÇÃO DO FORMDATA: Essencial para enviar arquivos (o que faltava!)
    const dataToSend = new FormData();
    dataToSend.append('username', username);
    dataToSend.append('login', login || username);
    dataToSend.append('email', email);
    dataToSend.append('password', password);

    // 🖼️ 2. ANEXANDO O ARQUIVO NO FORMATO REACT NATIVE/EXPO
    if (profileImage) {
        const filename = profileImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        // Garante um tipo MIME válido
        const type = match ? `image/${match[1]}` : `image/jpeg`; 

        dataToSend.append('profileImage', {
            uri: profileImage,
            name: filename,
            type: type,
        } as any); // O nome do campo 'profileImage' deve bater com o multer
    } else {
        // Envia null como string se nenhuma imagem for selecionada (tratado pelo backend)
        dataToSend.append('profileImage', ''); 
    }


    try {
        // 3. ENVIO: Axios lida com Content-Type: multipart/form-data.
        // O Multer no backend agora irá ler os campos de texto do FormData e o arquivo do req.file.
        const response = await api.post('/auth/register', dataToSend, {
             // Força o header caso o api.ts o sobrescreva
             headers: { 'Content-Type': 'multipart/form-data' },
        });

        Alert.alert("Sucesso", "Conta criada! Você pode fazer login agora.");
        
        navigation.navigate('Login');

    } catch (error: any) {
        let errorMessage = "Erro ao criar conta. Verifique sua conexão ou se o email já existe.";
        if (error.response) {
            errorMessage = error.response.data.message || "Email ou nome de usuário já em uso, ou falha no upload da imagem.";
        }
        Alert.alert("Erro de Cadastro", errorMessage);
    } finally {
        setLoading(false);
    }
  };
  
  const handleGoBack = () => { navigation.goBack(); }; 

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerBackground}>
          <Text style={styles.headerTitle}>Cadastro</Text>
          <TouchableOpacity onPress={handleGoBack} style={styles.headerIconWrapper}>
            <Image source={image26} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🖼️ SEÇÃO DE UPLOAD */}
      <View style={styles.uploadSection}>
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitleText}>ADICIONE SUA FOTO</Text>
        </View>
        <TouchableOpacity onPress={handleImagePick} style={styles.profileImageCircle}>
            {formData.profileImage ? (
                <Image source={{ uri: formData.profileImage }} style={styles.uploadedImage} />
            ) : (
                <View style={styles.uploadPlaceholder}>
                    <Icon name="person-circle-outline" size={50} color="#000048" />
                    <Text style={styles.dragText}>Clique para selecionar</Text>
                </View>
            )}
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}> <Text style={styles.label}>Nome de Usuário:</Text>
          <View style={styles.inputWrapper}> <TextInput value={formData.username} onChangeText={(text) => handleInputChange("username", text)} placeholder="Digite aqui..." placeholderTextColor="#979696" style={styles.input} /> </View>
        </View>
        <View style={styles.inputGroup}> <Text style={styles.label}>Login:</Text>
          <View style={styles.inputWrapper}> <TextInput value={formData.login} onChangeText={(text) => handleInputChange("login", text)} placeholder="Digite aqui..." placeholderTextColor="#979696" style={styles.input} autoCapitalize="none" /> </View>
        </View>
        <View style={styles.inputGroup}> <Text style={styles.label}>Senha:</Text>
          <View style={styles.inputWrapper}> <TextInput value={formData.password} onChangeText={(text) => handleInputChange("password", text)} placeholder="Digite aqui..." placeholderTextColor="#979696" style={styles.input} secureTextEntry /> </View>
        </View>
        <View style={styles.inputGroup}> <Text style={styles.label}>Email:</Text>
          <View style={styles.inputWrapper}> <TextInput value={formData.email} onChangeText={(text) => handleInputChange("email", text)} placeholder="Digite aqui..." placeholderTextColor="#979696" style={styles.input} keyboardType="email-address" autoCapitalize="none" /> </View>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
          {loading ? ( <ActivityIndicator color="white" size="small" /> ) : ( <Text style={styles.submitButtonText}>Cadastrar</Text> )}
        </TouchableOpacity>
      </View>
      {/* ... (Footer) */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', }, scrollContent: { paddingBottom: 0, minHeight: '100%', }, headerContainer: { width: '100%', height: 77, marginBottom: 20, },
  headerBackground: { width: '100%', height: '100%', backgroundColor: '#000048', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, justifyContent: 'flex-start', },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 60, }, headerIconWrapper: { position: 'absolute', left: 5, top: 15, padding: 10, },
  headerIcon: { width: 81, height: 42, resizeMode: 'contain', }, uploadSection: { alignItems: 'center', marginBottom: 30, },
  sectionTitleContainer: { width: '90%', maxWidth: 397, height: 48, borderWidth: 1, borderColor: '#000048', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20, backgroundColor: '#f0f0f0', },
  sectionTitleText: { color: '#000048', fontSize: 20, fontWeight: '900', fontStyle: 'italic', },
  profileImageCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#d9d9d9', justifyContent: 'center', alignItems: 'center', marginBottom: 10, overflow: 'hidden', },
  uploadPlaceholder: { alignItems: 'center', justifyContent: 'center', }, dragText: { fontSize: 10, color: '#000048', fontStyle: 'italic', fontWeight: '600', textAlign: 'center', marginTop: 5, },
  uploadedImage: { width: '100%', height: '100%', },
  searchImageButton: { backgroundColor: '#000048', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4, },
  searchImageButtonText: { color: 'white', fontSize: 10, fontWeight: '600', fontStyle: 'italic', },
  formContainer: { paddingHorizontal: 20, marginBottom: 20, },
  inputGroup: { marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  label: { width: '40%', color: '#000048', fontSize: 18, fontWeight: '900', fontStyle: 'italic', },
  inputWrapper: { width: '60%', height: 48, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, justifyContent: 'center', },
  input: { paddingHorizontal: 10, color: '#000048', fontSize: 16, fontStyle: 'italic', textAlign: 'center', },
  submitButton: { backgroundColor: '#000048', width: 107, height: 31, borderRadius: 4, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', marginTop: 10, },
  submitButtonText: { color: 'white', fontSize: 10, fontWeight: '600', fontStyle: 'italic', },
  footerContainer: { position: 'relative', height: 320, marginTop: 20, alignItems: 'center', },
  blueFooterBackground: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 314, backgroundColor: '#000048', },
  footerRobot: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: 361, zIndex: 1, },
  footerTitle: { position: 'absolute', bottom: 10, color: 'white', fontSize: 32, fontWeight: '900', fontStyle: 'italic', textAlign: 'center', zIndex: 2, width: '80%', },
});