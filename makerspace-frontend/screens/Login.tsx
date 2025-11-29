import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import api from '../api';
import { AppNavigationProp } from './App'; 

const { width, height } = Dimensions.get('window');
const robotImage = require('../assets/robot-6654031-640-1.png'); 

export const Login: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>(); 
  const [email, setEmail] = useState("maker@test.com"); // Email inicial para teste
  const [password, setPassword] = useState("123456");    // Senha inicial para teste
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => { 
    if (!email || !password) { Alert.alert("Erro", "Preencha todos os campos."); return; }
    setLoading(true);

    try {
        const response = await api.post('/auth/login', { // Chamada ao endpoint Node.js
            email: email,
            password: password,
        });

        const { token, user } = response.data; 

        await AsyncStorage.setItem('userToken', token);
        
        Alert.alert("Sucesso", `Bem-vindo, ${user.username || 'Maker'}!`);
        
        navigation.reset({
            index: 0,
            routes: [{ name: 'Feed' }],
        });

    } catch (error: any) {
        let errorMessage = "Erro de conexão. Servidor Node indisponível.";
        if (error.response) {
            errorMessage = error.response.data.message || "Email ou senha incorretos.";
        }
        Alert.alert("Erro de Login", errorMessage);

    } finally {
        setLoading(false);
    }
  };

  const handleGoogleLogin = () => { console.log("Login com Google clicado"); };
  const handleCreateAccount = () => { navigation.navigate('Cadastro'); };
  const handleForgotPassword = () => { navigation.navigate('Verificacao'); };

  return (
    <View style={styles.container}>
      <View style={styles.blueBackground} />
      <View style={styles.contentWrapper}>
        <Text style={styles.title}> BEM VINDO AO MAKERSPACE </Text>
        <Image source={robotImage} style={styles.robotImage} onError={() => console.log('Erro ao carregar imagem do robô')} accessibilityLabel="Mascote robô dando as boas-vindas ao Makerspace" />

        <View style={[styles.inputContainer, { marginTop: email ? 0 : 380 }]}>
          <View style={styles.iconPlaceholder}> <Text style={styles.iconText}>📧</Text> </View>
          <TextInput style={styles.inputField} onChangeText={setEmail} value={email} placeholder="Email" placeholderTextColor="#9c9393" keyboardType="email-address" autoCapitalize="none" textContentType="emailAddress" accessibilityLabel="Endereço de email" />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.iconPlaceholder}> <Text style={styles.iconText}>🔒</Text> </View>
          <TextInput style={styles.inputField} onChangeText={setPassword} value={password} placeholder="Password" placeholderTextColor="#979696" secureTextEntry textContentType="password" accessibilityLabel="Senha" />
        </View>

        <View style={styles.linkGroup}>
          <TouchableOpacity onPress={handleCreateAccount}> <Text style={styles.linkText}> Criar conta </Text> </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}> <Text style={styles.linkText}> Esqueceu a senha? </Text> </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton} activeOpacity={0.8} accessibilityLabel="Fazer Login" disabled={loading}>
          {loading ? ( <ActivityIndicator color="white" /> ) : ( <Text style={styles.loginButtonText}> LOGIN </Text> )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Google Login')} style={styles.googleButton} activeOpacity={0.7} accessibilityLabel="Fazer Login com Google">
          <Text style={styles.googleIcon}>G</Text> <Text style={styles.googleButtonText}> Fazer Login </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... (Estilos Stylesheet)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', alignItems: 'center', },
  blueBackground: { position: 'absolute', top: -64, left: -22, width: width + 44, height: 634, backgroundColor: '#000048', },
  contentWrapper: { width: '100%', maxWidth: 412, alignItems: 'center', paddingHorizontal: 20, position: 'relative', },
  title: { marginTop: 138, fontSize: 40, color: 'white', textAlign: 'center', fontStyle: 'italic', fontWeight: '900', width: '80%', lineHeight: 45, marginBottom: 20, },
  robotImage: { width: width * 0.9, height: 420, resizeMode: 'contain', position: 'absolute', top: 192, left: 0, right: 0, zIndex: 1, },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: 235, height: 56, backgroundColor: '#d9d9d9', borderRadius: 15, marginBottom: 23, zIndex: 10, },
  inputField: { flex: 1, height: '100%', paddingLeft: 50, fontSize: 14, fontWeight: '600', color: '#000048', },
  iconPlaceholder: { position: 'absolute', left: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', zIndex: 11, },
  iconText: { fontSize: 20, },
  linkGroup: { flexDirection: 'row', justifyContent: 'space-between', width: 235, marginTop: 10, marginBottom: 25, },
  linkText: { fontSize: 14, fontWeight: '600', color: '#000048', textDecorationLine: 'underline', },
  loginButton: { width: 173, height: 49, backgroundColor: '#3318e8', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10, },
  loginButtonText: { fontSize: 20, color: 'white', fontWeight: '900', fontStyle: 'italic', },
  googleButton: { flexDirection: 'row', width: 115, height: 38, backgroundColor: 'white', borderRadius: 5, borderWidth: 1, borderColor: '#000048', justifyContent: 'center', alignItems: 'center', marginTop: 20, },
  googleIcon: { fontSize: 20, color: '#000048', marginRight: 5, },
  googleButtonText: { fontSize: 10, fontWeight: '600', color: '#000048', }
});