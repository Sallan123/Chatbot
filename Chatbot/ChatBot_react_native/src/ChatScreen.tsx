import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } from "@google/generative-ai";
import Loading from './components/Loading';
import Markdown from 'react-native-markdown-display';
import { trigger } from 'react-native-haptic-feedback';

const MODEL_NAME = "gemini-1.0-pro";

type ConversationItem = {
  user: string;
  ai: string;
};

const ChatScreen = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const textColor = colorScheme === 'dark' ? 'white' : 'black';

  const handleSendMessage = async (message: string) => {
    const genAI = new GoogleGenerativeAI('AIzaSyCxI9SjzCYUhUWyjt-qAaVl4pmUrIHaFjM');
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "hi" }],
        },
        {
          role: "model",
          parts: [{ text: "Hey there! How can I assist you today?" }],
        },
      ],
    });

    try {
      if (message.trim() !== '') {
        setError(false)
        setIsLoading(true);
        setInput('');
        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text;

        console.log(response.text());
        setConversation((prevConversation: ConversationItem[]) => [
          ...prevConversation,
          { user: message, ai: text() }
        ]);
        trigger("impactHeavy", options);
        setIsLoading(false);
      } else {
        console.log('please enter prompt');
      }
    } catch (error) {
      // console.error("Error:--", error);
      setError(true)
      setIsLoading(false);
      // setErrorMsg(error);
      setErrorMsg('Your message violates our guidelines and cannot be processed. Please ensure it follows our community standards.');
    }
  };

  const markdownStyles = {
    text: {
      color: 'white',
      fontSize: 21,
      marginTop: 15,
      marginBottom: 15,
      // backgroundColor:backgroundColor
    },
  };

  const renderConversation = () => {
    return conversation.map((message, index) => (
      <View key={index}>
        <Text style={[styles.user]}>User: {message.user}</Text>
        {/* <Text style={styles.ai}>AI: {message.ai}</Text> */}
        <Markdown style={markdownStyles}>{message.ai}</Markdown>

      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.conversationContainer}>
          {renderConversation()}
          {isLoading && <Loading />}
          {error && <Text style={styles.errorText}>{errorMsg}</Text>}
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          autoFocus
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={() => handleSendMessage(input)}
          value={input}
          placeholder="Type your message..."
          placeholderTextColor={'gray'}
          multiline={true}
        />
        <Pressable style={styles.buttonContainer} onPress={() => handleSendMessage(input)}>
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 15,
  },
  conversationContainer: {
    flex: 1,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 20,
    borderRadius: 10,
    marginRight: 10,
    marginVertical: 20,
    minHeight: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 20,
    marginTop: 5,
    fontWeight: '500'
  },
  buttonContainer: {
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  user: {
    color: '#009688',
    fontSize: 16,
  },
  ai: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
});

export default ChatScreen;
