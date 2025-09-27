import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { CardDB } from '../../utils/database';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [dailyCard, setDailyCard] = useState(null);
  const [mergeCode, setMergeCode] = useState(['', '', '', '']);
  const [isMerging, setIsMerging] = useState(false);
  const [showMergeResult, setShowMergeResult] = useState(false);
  const [mergedCard, setMergedCard] = useState(null);
  const cardAnimation = useRef(new Animated.Value(1)).current;
  const mergeAnimation = useRef(new Animated.Value(0)).current;
  const { user, logout } = useAuth();

  // Animation values for stars
  const starAnimations = useRef(
    Array.from({ length: 80 }, () => ({
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
      scale: new Animated.Value(Math.random() * 0.8 + 0.2),
      blink: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
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

      // Movement animation
      const moveXAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(star.translateX, {
            toValue: Math.random() * 20 - 10, // -10 to +10 pixels
            duration: 3000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(star.translateX, {
            toValue: Math.random() * 20 - 10,
            duration: 3000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
        ])
      );

      const moveYAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(star.translateY, {
            toValue: Math.random() * 20 - 10, // -10 to +10 pixels
            duration: 4000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.timing(star.translateY, {
            toValue: Math.random() * 20 - 10,
            duration: 4000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
        ])
      );

      return Animated.parallel([
        blinkAnimation,
        opacityAnimation,
        moveXAnimation,
        moveYAnimation,
      ]);
    });

    // Start all animations with staggered delays
    animations.forEach((animation, index) => {
      setTimeout(() => {
        animation.start();
      }, index * 50);
    });

    return () => {
      animations.forEach(animation => {
        if (animation && animation.stop) {
          animation.stop();
        }
      });
    };
  }, []);

  useEffect(() => {
    loadUserCards();
    loadStories();
    generateDailyCard();
  }, [user]);

  const loadUserCards = async () => {
    try {
      if (user) {
        const cards = await CardDB.getUserCards(user.id);
        setUserCards(cards);
      }
    } catch (error) {
      console.error('Error loading user cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStories = async () => {
    try {
      // Mock stories data - in real app, this would come from database
      const mockStories = [
        {
          id: '1',
          username: 'Alex',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          image: 'https://via.placeholder.com/150x200/00d4ff/ffffff?text=Meeting+Snap',
          timestamp: '2h ago',
          isViewed: false,
        },
        {
          id: '2',
          username: 'Sarah',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          image: 'https://via.placeholder.com/150x200/8b5cf6/ffffff?text=Card+Merge',
          timestamp: '4h ago',
          isViewed: true,
        },
        {
          id: '3',
          username: 'Mike',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          image: 'https://via.placeholder.com/150x200/00ff88/ffffff?text=New+Connection',
          timestamp: '6h ago',
          isViewed: false,
        },
        {
          id: '4',
          username: 'Emma',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          image: 'https://via.placeholder.com/150x200/ffaa00/ffffff?text=Epic+Merge',
          timestamp: '1d ago',
          isViewed: true,
        },
        {
          id: '5',
          username: 'Jake',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          image: 'https://via.placeholder.com/150x200/ff0080/ffffff?text=Legendary+Card',
          timestamp: '2d ago',
          isViewed: false,
        },
      ];
      setStories(mockStories);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const generateDailyCard = () => {
    const cards = [
      { emoji: '🔥', name: 'FIRE', description: 'Element of passion and energy', color: '#ff4444' },
      { emoji: '💧', name: 'WATER', description: 'Element of flow and adaptability', color: '#00d4ff' },
      { emoji: '❄️', name: 'ICE', description: 'Element of clarity and focus', color: '#ffffff' },
      { emoji: '💨', name: 'AIR', description: 'Element of freedom and movement', color: '#e0e0e0' },
      { emoji: '🌍', name: 'SOIL', description: 'Element of stability and growth', color: '#8b5cf6' },
      { emoji: '✨', name: 'MAGIC', description: 'Element of mystery and power', color: '#8b5cf6' },
      { emoji: '🌌', name: 'ETHER', description: 'Element of void and space', color: '#4a148c' },
      { emoji: '⚡', name: 'LIGHTNING', description: 'Element of power and speed', color: '#ffaa00' },
    ];

    // Generate card based on current date for consistency
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const cardIndex = dayOfYear % cards.length;
    
    setDailyCard(cards[cardIndex]);
    
    // Start breathing animation after a short delay
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cardAnimation, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(cardAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 500);
  };

  const handleMergeCodeChange = (text, index) => {
    const newCode = [...mergeCode];
    newCode[index] = text.toUpperCase();
    setMergeCode(newCode);
    
    // Check if all 4 digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 4) {
      handleMerge(newCode.join(''));
    }
  };

  const handleMerge = async (code) => {
    setIsMerging(true);
    
    // Mock merge with another player
    const otherPlayerCard = 'WATER'; // Mock other player's card
    const currentCard = dailyCard?.name || 'FIRE';
    
    // Merge results
    const mergeResults = {
      'FIRE_WATER': { emoji: '💨', name: 'STEAM', description: 'Element of transformation', color: '#ff6b6b' },
      'FIRE_ICE': { emoji: '💧', name: 'MIST', description: 'Element of mystery', color: '#87ceeb' },
      'WATER_ICE': { emoji: '🧊', name: 'GLACIER', description: 'Element of time', color: '#00bfff' },
      'AIR_SOIL': { emoji: '🌪️', name: 'TORNADO', description: 'Element of change', color: '#8fbc8f' },
      'MAGIC_ETHER': { emoji: '✨', name: 'ARCANE', description: 'Element of mystery', color: '#8b5cf6' },
    };
    
    const mergeKey = [currentCard, otherPlayerCard].sort().join('_');
    const result = mergeResults[mergeKey];
    
    if (result) {
      setMergedCard(result);
      
      // Start merge animation
      Animated.sequence([
        Animated.timing(mergeAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowMergeResult(true);
        setIsMerging(false);
      });
    } else {
      Alert.alert('Merge Failed', 'Invalid merge combination!');
      setIsMerging(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Welcome');
          }
        }
      ]
    );
  };

  const handleConnect = () => {
    Alert.alert('Connect', 'Connect feature coming soon!');
  };

  const handleProfile = () => {
    Alert.alert('Profile', 'Profile feature coming soon!');
  };

  const handleStoryPress = (story, index) => {
    // Mark story as viewed
    const updatedStories = stories.map((s, i) => 
      i === index ? { ...s, isViewed: true } : s
    );
    setStories(updatedStories);
    
    // Navigate to story viewer
    navigation.navigate('StoryViewer', {
      stories: stories,
      currentIndex: index,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>LOADING...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.gradient}>
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
                    transform: [
                      { scale: star.scale },
                      { translateX: star.translateX },
                      { translateY: star.translateY },
                    ],
                  },
                ]}
            />
          ))}
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stories Section */}
          <View style={styles.storiesSection}>
            <Text style={styles.storiesTitle}>STORIES</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.storiesScroll}
            >
              {/* Add Story Item */}
              <TouchableOpacity
                style={styles.storyItem}
                onPress={() => navigation.navigate('Camera')}
              >
                <View style={styles.addStoryAvatar}>
                  <Image 
                    source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face' }} 
                    style={styles.storyAvatarImage}
                    resizeMode="cover"
                  />
                  <View style={styles.plusIcon}>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                </View>
                <Text style={styles.storyUsername}>Your Story</Text>
              </TouchableOpacity>

              {stories.map((story, index) => (
                <TouchableOpacity
                  key={story.id}
                  style={styles.storyItem}
                  onPress={() => handleStoryPress(story, index)}
                >
                  <View style={[
                    styles.storyAvatar,
                    { 
                      borderColor: story.isViewed ? '#666' : '#ffffff',
                      borderWidth: story.isViewed ? 2 : 3,
                      shadowColor: story.isViewed ? 'transparent' : '#ffffff',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: story.isViewed ? 0 : 0.8,
                      shadowRadius: story.isViewed ? 0 : 8,
                    }
                  ]}>
                    <Image 
                      source={{ uri: story.avatar }} 
                      style={styles.storyAvatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.storyUsername}>{story.username}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Daily Card Section */}
          <View style={styles.dailyCardSection}>
            <Text style={styles.dailyCardTitle}>TODAY'S CARD</Text>
            {dailyCard && (
              <View style={styles.cardContainer}>
                <Animated.View style={[
                  styles.dailyCard, 
                  { 
                    shadowColor: dailyCard.color,
                    transform: [{ scale: cardAnimation }]
                  }
                ]}>
                  <Text style={styles.dailyCardEmoji}>{dailyCard.emoji}</Text>
                  <Text style={[styles.dailyCardName, { textShadowColor: dailyCard.color }]}>{dailyCard.name}</Text>
                </Animated.View>
                <Text style={styles.dailyCardDescription}>{dailyCard.description}</Text>
                
                {/* Merge Code Input */}
                <View style={styles.mergeSection}>
                  <Text style={styles.mergeTitle}>ENTER MERGE CODE</Text>
                  <View style={styles.mergeCodeContainer}>
                    {mergeCode.map((digit, index) => (
                      <TextInput
                        key={index}
                        style={[
                          styles.mergeCodeInput,
                          digit && styles.mergeCodeInputFilled,
                          isMerging && styles.mergeCodeInputMerging
                        ]}
                        value={digit}
                        onChangeText={(text) => handleMergeCodeChange(text, index)}
                        maxLength={1}
                        autoCapitalize="characters"
                        keyboardType="default"
                        textAlign="center"
                        selectionColor="#00d4ff"
                      />
                    ))}
                  </View>
                  
                  {isMerging && (
                    <Animated.View style={[styles.mergeAnimation, { opacity: mergeAnimation }]}>
                      <Text style={styles.mergeAnimationText}>MERGING...</Text>
                    </Animated.View>
                  )}
                  
                  {showMergeResult && mergedCard && (
                    <View style={styles.mergeResult}>
                      <Text style={styles.mergeResultTitle}>NEW CARD!</Text>
                      <View style={[styles.mergedCard, { borderColor: mergedCard.color, shadowColor: mergedCard.color }]}>
                        <Text style={styles.mergedCardEmoji}>{mergedCard.emoji}</Text>
                        <Text style={[styles.mergedCardName, { color: mergedCard.color }]}>{mergedCard.name}</Text>
                        <Text style={styles.mergedCardDescription}>{mergedCard.description}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
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
    backgroundColor: '#000000',
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
    width: 4,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: spacing.xl,
    zIndex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontFamily: 'Courier New',
    letterSpacing: 2,
  },


  storiesSection: {
    marginBottom: spacing['2xl'],
    paddingHorizontal: 0,
    height: 120,
  },

  storiesTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 3,
    marginBottom: spacing.lg,
    fontFamily: 'Courier New',
    textAlign: 'center',
    paddingHorizontal: 0,
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  storiesScroll: {
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
  },

  storyItem: {
    alignItems: 'center',
    marginLeft: spacing.sm,
    width: 65,
  },

  storyAvatar: {
    width: 55,
    height: 55,
    padding: spacing.sm,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 2,
  },

  storyAvatarImage: {
    width: 51,
    height: 51,
    borderRadius: 25.5,
  },

  storyUsername: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  addStoryAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#666',
    position: 'relative',
  },

  plusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },

  plusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
  },

  dailyCardSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing['2xl'],
  },

  cardContainer: {
    alignItems: 'center',
  },

  cardTouchable: {
    // Touchable wrapper for the card
  },

  mergeSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },

  mergeTitle: {
    color: '#00d4ff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    marginBottom: spacing.md,
  },

  mergeCodeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  mergeCodeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Courier New',
    textAlign: 'center',
  },

  mergeCodeInputFilled: {
    borderColor: '#00d4ff',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },

  mergeCodeInputMerging: {
    borderColor: '#ffaa00',
    backgroundColor: 'rgba(255, 170, 0, 0.1)',
  },

  mergeAnimation: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  mergeAnimationText: {
    color: '#ffaa00',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
  },

  mergeResult: {
    alignItems: 'center',
  },

  mergeResultTitle: {
    color: '#00ff88',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    marginBottom: spacing.md,
  },

  mergedCard: {
    width: 150,
    height: 150,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },

  mergedCardEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },

  mergedCardName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    marginBottom: spacing.xs,
  },

  mergedCardDescription: {
    color: '#cccccc',
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    fontFamily: 'Courier New',
  },

  dailyCardTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing.lg,
    fontFamily: 'Courier New',
    textAlign: 'center',
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  dailyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },

  dailyCardEmoji: {
    fontSize: 80,
    marginBottom: spacing.md,
  },

  dailyCardName: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    marginBottom: spacing.sm,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  dailyCardDescription: {
    color: '#cccccc',
    fontSize: typography.fontSize.xs,
    fontFamily: 'Courier New',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: spacing.md,
    opacity: 0.8,
  },
});

export default HomeScreen;
