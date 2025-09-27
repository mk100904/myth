import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import StoryViewerScreen from './src/screens/main/StoryViewerScreen';
import CameraScreen from './src/screens/main/CameraScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="StoryViewer" component={StoryViewerScreen} />
              <Stack.Screen name="Camera" component={CameraScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
