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
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "./App";
import * as ImagePicker from "expo-image-picker";
import { Ionicons as Icon } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const API_BASE_URL = "http://192.168.1.130:3000/api";
const { width } = Dimensions.get("window");

export const Cadastro = (): React.ReactElement => {
  const navigation = useNavigation<AppNavigationProp>();

  const [username, setUsername] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permissão negada", "Ative o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      // Primeiro: enviar dados normais
      const fields = {
        username,
        login: login || username,
        email,
        password,
      };

      let uploadOptions;
      let uploadUrl = `${API_BASE_URL}/auth/register`;

      // Caso tenha imagem
      if (profileImage) {
        const filename = profileImage.substring(profileImage.lastIndexOf("/") + 1);
        const extension = filename.split(".").pop();
        const mimeType = extension === "png" ? "image/png" : "image/jpeg";

        uploadOptions = {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "profileImage",
          mimeType,
          parameters: fields,
        };

        const uploadResponse = await FileSystem.uploadAsync(
          uploadUrl,
          profileImage,
          uploadOptions
        );

        const result = JSON.parse(uploadResponse.body);

        if (uploadResponse.status !== 201) {
          Alert.alert("Erro", result.message || "Falha no cadastro.");
          return;
        }

        Alert.alert("Sucesso", "Cadastro realizado com imagem!");
        navigation.navigate("Login");
        return;
      }

      // Sem imagem: enviar JSON normal
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erro", data.message || "Falha ao cadastrar.");
        return;
      }

      Alert.alert("Sucesso", "Cadastro realizado!");
      navigation.navigate("Login");

    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível se cadastrar.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Login"
        placeholderTextColor="#aaa"
        value={login}
        onChangeText={setLogin}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Icon name="image-outline" size={20} color="#fff" />
        <Text style={styles.imageButtonText}>Escolher foto</Text>
      </TouchableOpacity>

      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#111" },
  title: { color: "#fff", fontSize: 22, textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageButtonText: { color: "#fff", marginLeft: 8 },
  preview: { width: 80, height: 80, borderRadius: 40, alignSelf: "center" },
  button: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
});

export default Cadastro;
