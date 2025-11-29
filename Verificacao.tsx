import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Keyboard, 
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from './App'; 

const robotAdjustableWrench2 = require('./assets/robot-adjustable-wrench-2.png'); 

export const Verificacao = (): React.ReactElement => {
  const navigation = useNavigation<AppNavigationProp>(); 
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]); 

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) { return; }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    } else if (value && index === 4) {
      Keyboard.dismiss(); 
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const verificationCode = code.join("");
    if (verificationCode.length === 5) {
      console.log("Verification code submitted:", verificationCode);
      navigation.navigate('Feed');
    }
  };

  return (
    <View style={styles.container}>
      {/* ... conteúdo ... */}
      <View style={styles.contentArea}>
        <Image source={robotAdjustableWrench2} style={styles.image} />
        <Text style={styles.title}>Verifique o seu e-mail acabamos de {"\n"}enviar um código</Text>
        <Text style={styles.description}>Insira no campo abaixo o código recebido por e-mail</Text>

        <View style={styles.inputGroup}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              style={styles.inputBox}
              keyboardType="numeric" 
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={(e) => handleKeyDown(index, e)}
              aria-label={`Dígito ${index + 1} do código de verificação`}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} accessibilityLabel="Enviar código de verificação">
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', alignItems: 'center', paddingTop: 80, },
  contentArea: { width: '100%', maxWidth: 412, alignItems: 'center', paddingHorizontal: 20, },
  title: { fontWeight: 'bold', color: '#000048', fontSize: 20, textAlign: 'center', marginTop: 30, },
  image: { width: 239, height: 303, resizeMode: 'contain', marginBottom: 20, },
  description: { fontWeight: '500', color: '#aaa7a7', fontSize: 16, textAlign: 'center', marginTop: 15, marginBottom: 30, },
  inputGroup: { flexDirection: 'row', justifyContent: 'center', gap: 19, },
  inputBox: { width: 41, height: 48, backgroundColor: '#d9d9d9', borderRadius: 10, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#000048', borderWidth: 2, borderColor: 'transparent', },
  button: { width: 181, height: 44, backgroundColor: '#000048', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 40, },
  buttonText: { fontWeight: 'bold', color: 'white', fontSize: 20, },
});