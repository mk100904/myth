import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  // Animation values for stars
  const starAnimations = useRef(
    Array.from({ length: 80 }, () => ({
      opacity: new Animated.Value(Math.random() * 0.3 + 0.1),
      scale: new Animated.Value(Math.random() * 0.8 + 0.2),
      blink: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Animate stars with blinking effect
    const animations = starAnimations.map((star, index) => {
      // Blinking animation
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(star.blink, {
            toValue: 1,
            duration: 500 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(star.blink, {
            toValue: 0,
            duration: 500 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Opacity animation
      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      );

      return Animated.parallel([
        blinkAnimation,
        opacityAnimation,
      ]);
    });

    // Start all animations with staggered delays
    animations.forEach((animation, index) => {
      setTimeout(() => {
        animation.start();
      }, index * 50);
    });

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, []);

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email.trim(), password.trim());
      
      if (result.success) {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    navigation.goBack();
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <LinearGradient
        colors={['#000011', '#000022', '#000033', '#000022', '#000011']}
        style={styles.gradient}
      >
        {/* Animated Stars */}
        <View style={styles.starsContainer}>
          {starAnimations.map((star, index) => (
            <Animated.View
              key={index}
              style={[
                styles.star,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: Animated.multiply(star.opacity, star.blink),
                  transform: [{ scale: star.scale }],
                },
              ]}
            />
          ))}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToWelcome} style={styles.backButton}>
              <Text style={styles.backText}>← BACK</Text>
            </TouchableOpacity>
            <Text style={styles.title}>WELCOME BACK</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor="#ffffff"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#666"
                secureTextEntry
                selectionColor="#ffffff"
              />
            </View>

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>FORGOT PASSWORD?</Text>
            </TouchableOpacity>

            <Button
              title={loading ? "LOGGING IN..." : "LOG IN"}
              onPress={handleLogin}
              variant="primary"
              size="medium"
              style={styles.loginButton}
              disabled={loading}
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  gradient: {
    flex: 1,
  },
  
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    zIndex: 1,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },

  backText: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
  },

  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
    letterSpacing: 3,
    fontFamily: 'Courier New',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  form: {
    flex: 1,
  },

  inputContainer: {
    marginBottom: spacing.xl,
  },

  inputLabel: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    fontFamily: 'Courier New',
  },

  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: '#ffffff',
    fontSize: typography.fontSize.base,
    fontFamily: 'Courier New',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },

  forgotPasswordText: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
  },

  loginButton: {
    marginTop: spacing.lg,
  },
});

export default LoginScreen;
