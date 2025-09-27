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
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/ui/Button';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  // Animation values for stars
  const starAnimations = useRef(
    Array.from({ length: 60 }, () => ({
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

  const handleResetPassword = () => {
    console.log('Reset password for:', email);
    // Handle password reset logic here
  };

  const handleBackToLogin = () => {
    navigation.goBack();
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
            <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
              <Text style={styles.backText}>← BACK</Text>
            </TouchableOpacity>
            <Text style={styles.title}>RESET PASSWORD</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor="#ffffff"
              />
            </View>

            <Button
              title="SEND RESET LINK"
              onPress={handleResetPassword}
              variant="primary"
              size="medium"
              style={styles.resetButton}
            />

            <TouchableOpacity onPress={handleBackToLogin} style={styles.backToLogin}>
              <Text style={styles.backToLoginText}>REMEMBER YOUR PASSWORD? LOG IN</Text>
            </TouchableOpacity>
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

  descriptionContainer: {
    marginBottom: spacing['2xl'],
  },

  description: {
    color: '#cccccc',
    fontSize: typography.fontSize.base,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Courier New',
  },

  inputContainer: {
    marginBottom: spacing['2xl'],
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

  resetButton: {
    marginBottom: spacing.xl,
  },

  backToLogin: {
    alignSelf: 'center',
  },

  backToLoginText: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
