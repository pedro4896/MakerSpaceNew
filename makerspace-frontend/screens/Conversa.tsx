import React, { useState } from "react";
import {
    SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, Platform, KeyboardAvoidingView, useWindowDimensions,
} from "react-native";
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from './App'; 

interface Message { id: number; text: string; isUser: boolean; avatar?: any; }
const backIcon = require('../assets/image-37.png');
const userAvatar = require('../assets/image-36.png');
const friendAvatar = require('../assets/Image-38.png');
const mockMessages: Message[] = [ /* ... dados ... */ ];

const ChatBubble: React.FC<{ message: Message; maxWidth: number }> = ({ message, maxWidth }) => {
    const bubbleStyle = message.isUser ? bubbleStyles.userBubble : bubbleStyles.friendBubble;
    const containerStyle = message.isUser ? bubbleStyles.userContainer : bubbleStyles.friendContainer;
    const textColorStyle = message.isUser ? { color: '#ffffff' } : { color: '#000' };

    return (
        <View style={[containerStyle]}>
            {!message.isUser && ( <Image source={message.avatar} style={[bubbleStyles.avatar, { width: Math.round(maxWidth * 0.12), height: Math.round(maxWidth * 0.12), borderRadius: Math.round(maxWidth * 0.06) }]} resizeMode="cover" /> )}
            <View style={[bubbleStyle, { maxWidth }]}> <Text style={[bubbleStyles.text, textColorStyle]}>{message.text}</Text> </View>
        </View>
    );
};

export const ConversaComUsuario = (): React.ReactElement => {
    const navigation = useNavigation<AppNavigationProp>(); // Tipagem corrigida
    const [inputText, setInputText] = useState("");
    const { width, height } = useWindowDimensions();

    const headerHeight = Math.max(64, Math.round(height * 0.11));
    const inputHeight = Math.max(56, Math.round(height * 0.085));
    const avatarSize = Math.max(40, Math.round(width * 0.12));
    const bubbleMaxWidth = Math.round(width * 0.78);

    const handleSend = () => { if (inputText.trim()) { console.log("Mensagem enviada:", inputText); setInputText(""); } };
    
    const handleGoBack = () => { navigation.goBack(); }; // Funcional

    const renderMessage = ({ item }: { item: Message }) => ( <ChatBubble message={item} maxWidth={bubbleMaxWidth} /> );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { height: headerHeight, paddingTop: Platform.OS === 'ios' ? 12 : 8, borderBottomLeftRadius: Math.round(width * 0.06), borderBottomRightRadius: Math.round(width * 0.06) }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <Image source={backIcon} style={[styles.backIcon, { width: Math.round(avatarSize * 0.7), height: Math.round(avatarSize * 0.7) }]} resizeMode="contain" />
                    </TouchableOpacity>
                    <Image source={userAvatar} style={[styles.friendAvatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} resizeMode="cover" />
                    <Text style={[styles.friendName, { fontSize: Math.max(16, Math.round(width * 0.05)) }]}>Júlio César</Text>
                </View>
            </View>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={headerHeight + 10} >
                <FlatList data={mockMessages} renderItem={renderMessage} keyExtractor={(item) => item.id.toString()} contentContainerStyle={[styles.chatListContent, { paddingTop: headerHeight + 8, paddingBottom: inputHeight + 12 }]} style={styles.chatList} inverted keyboardShouldPersistTaps='handled' />
                <View style={[styles.inputArea, { height: inputHeight, paddingVertical: Math.round(inputHeight * 0.12) }]}>
                    <TouchableOpacity style={styles.micButton}> <Icon name="mic-outline" size={Math.round(inputHeight * 0.4)} color="#000048" /> </TouchableOpacity>
                    <TextInput style={[styles.textInput, { minHeight: inputHeight * 0.7, maxHeight: inputHeight * 1.5 }]} value={inputText} onChangeText={setInputText} placeholder="Digite sua mensagem..." placeholderTextColor="#999" multiline returnKeyType="send" onSubmitEditing={handleSend} />
                    <TouchableOpacity style={[styles.sendButton, { width: Math.round(inputHeight * 0.85), height: Math.round(inputHeight * 0.85), borderRadius: Math.round(inputHeight * 0.85 / 2) }]} onPress={handleSend} disabled={!inputText.trim()} >
                        <Icon name="send" size={Math.round(inputHeight * 0.38)} color={inputText.trim() ? 'white' : '#999'} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ConversaComUsuario;

const bubbleStyles = StyleSheet.create({
    friendContainer: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 6, marginRight: 60, }, userContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 6, marginLeft: 60, },
    avatar: { marginRight: 10, marginTop: 4, },
    friendBubble: { padding: 10, borderRadius: 12, borderTopLeftRadius: 0, backgroundColor: '#d9d9d9', }, userBubble: { padding: 10, borderRadius: 12, borderTopRightRadius: 0, backgroundColor: '#000048', },
    text: { fontSize: 16, },
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', },
    header: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#000048', zIndex: 10, paddingHorizontal: 12, }, headerContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, },
    backButton: { padding: 6, }, backIcon: { marginRight: 8, }, friendAvatar: { marginRight: 10, }, friendName: { color: 'white', fontWeight: '900', fontStyle: 'italic', },
    chatList: { flex: 1, }, chatListContent: { paddingHorizontal: 12, flexGrow: 1, justifyContent: 'flex-end', },
    inputArea: { position: 'relative', left: 0, right: 0, bottom: 0, backgroundColor: '#f5f5f5', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: '#ddd', zIndex: 15, },
    micButton: { padding: 8, marginRight: 8, justifyContent: 'center', alignItems: 'center', },
    textInput: { flex: 1, backgroundColor: '#d9d9d9', borderRadius: 10, paddingHorizontal: 12, fontSize: 16, marginRight: 10, color: '#000048', },
    sendButton: { backgroundColor: '#000048', justifyContent: 'center', alignItems: 'center', },
});