import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const { user, loading } = useAuth();
  
  // Animation values for stars
  const starAnimations = useRef(
    Array.from({ length: 50 }, () => ({
      opacity: new Animated.Value(Math.random() * 0.3 + 0.1),
      scale: new Animated.Value(Math.random() * 0.8 + 0.2),
      blink: new Animated.Value(0),
    }))
  ).current;

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  useEffect(() => {
    // Redirect to Home if user is already logged in
    if (!loading && user) {
      navigation.navigate('Home');
    }
  }, [user, loading, navigation]);

  useEffect(() => {
    // Animate stars with blinking effect
    const animations = starAnimations.map((star, index) => {
      const delay = index * 100; // Stagger the animations
      
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

      // Scale animation
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(star.scale, {
            toValue: Math.random() * 0.5 + 0.8,
            duration: 2000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.timing(star.scale, {
            toValue: Math.random() * 0.3 + 0.2,
            duration: 2000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
        ])
      );

      return Animated.parallel([
        blinkAnimation,
        opacityAnimation,
        scaleAnimation,
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <LinearGradient
        colors={['#000000', '#000033', '#000066' , '#000033', '#000000']}
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

        {/* Main Content - Centered */}
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Text style={styles.logo}>MYTH</Text>
            <Text style={styles.tagline}>Connect • Merge • Evolve</Text>
          </View>

          {/* Action Buttons - Single Row */}
          <View style={styles.buttonRow}>
            <Button
              title="SIGN UP"
              onPress={handleSignup}
              variant="primary"
              size="medium"
              style={styles.button}
            />
            
            <Button
              title="LOG IN"
              onPress={handleLogin}
              variant="secondary"
              size="medium"
              style={styles.button}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 1,
  },
  
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing['5xl'],
  },
  
  logo: {
    fontSize: 72,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 8,
    marginBottom: spacing.md,
    textShadowColor: colors.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    fontFamily: 'System',
  },
  
  tagline: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    letterSpacing: 3,
    fontWeight: typography.fontWeight.medium,
  },
  
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  button: {
  },
});

export default WelcomeScreen;
