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
  const [otherPlayerCard, setOtherPlayerCard] = useState(null);
  const [showMergeAnimation, setShowMergeAnimation] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarCards, setCalendarCards] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardAnimation = useRef(new Animated.Value(1)).current;
  const mergeAnimation = useRef(new Animated.Value(0)).current;
  const leftCardAnimation = useRef(new Animated.Value(0)).current;
  const rightCardAnimation = useRef(new Animated.Value(0)).current;
  const centerCardAnimation = useRef(new Animated.Value(0)).current;
  const transitionAnimation = useRef(new Animated.Value(0)).current;
  
  // Beautiful Aesthetic Animations
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const slideUpAnimation = useRef(new Animated.Value(50)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef([]);
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
    
    // Beautiful Aesthetic Animations on Load
    Animated.parallel([
      Animated.timing(fadeInAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Continuous Beautiful Animations
    startContinuousAnimations();
  }, [user]);
  
  const startContinuousAnimations = () => {
    // Gentle Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Shimmer Effect
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
    
    // Gentle Rotation
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  };

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
    const cardIndex = 3;
    
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

  const saveCardToCalendar = (card) => {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    setCalendarCards(prev => ({
      ...prev,
      [dateKey]: card
    }));
  };

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${currentMonth}-${day}`;
      calendar.push({
        day,
        card: calendarCards[dateKey] || null,
        isToday: day === today.getDate()
      });
    }
    
    return calendar;
  };

  const handleMergeCodeChange = (text, index) => {
    const newCode = [...mergeCode];
    newCode[index] = text.toUpperCase();
    setMergeCode(newCode);
    
    // Auto-focus to next input if text is entered
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Check if all 4 digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 4) {
      handleMerge(newCode.join(''));
    }
  };

  const handleMergeCodeKeyPress = (key, index) => {
    // Handle backspace - move to previous input
    if (key === 'Backspace' && !mergeCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleMerge = async (code) => {
    setIsMerging(true);
    
    // Base elemental cards
    const baseCards = [
      { name: 'FIRE', emoji: '🔥', color: '#FF4500', description: 'Element of passion and energy' },
      { name: 'WATER', emoji: '💧', color: '#00BFFF', description: 'Element of fluidity and adaptability' },
      { name: 'ICE', emoji: '❄️', color: '#87CEEB', description: 'Element of stillness and preservation' },
      { name: 'AIR', emoji: '💨', color: '#F0F8FF', description: 'Element of freedom and movement' },
      { name: 'SOIL', emoji: '🌍', color: '#8B4513', description: 'Element of stability and growth' },
      { name: 'MAGIC', emoji: '✨', color: '#9370DB', description: 'Element of mystery and power' },
      { name: 'ETHER', emoji: '⭐', color: '#4B0082', description: 'Element of the cosmos and infinity' },
      { name: 'LIGHTNING', emoji: '⚡', color: '#FFD700', description: 'Element of speed and electricity' }
    ];
    
    // Mock merge with another player - randomly select from base cards
    const randomIndex = Math.floor(Math.random() * baseCards.length);
    const otherCard = baseCards[randomIndex];
    const currentCard = dailyCard;
    
    // Merge results - comprehensive combinations
    const mergeResults = {
      'FIRE_WATER': { emoji: '💨', name: 'STEAM', description: 'Element of transformation', color: '#ff6b6b' },
      'FIRE_ICE': { emoji: '💧', name: 'MIST', description: 'Element of mystery', color: '#87ceeb' },
      'FIRE_AIR': { emoji: '🔥', name: 'INFERNO', description: 'Element of destruction', color: '#ff8c00' },
      'FIRE_SOIL': { emoji: '🌋', name: 'VOLCANO', description: 'Element of power', color: '#ff4500' },
      'FIRE_MAGIC': { emoji: '🌟', name: 'STARFIRE', description: 'Element of cosmic energy', color: '#ffd700' },
      'FIRE_ETHER': { emoji: '☀️', name: 'SOLAR', description: 'Element of light', color: '#ffaa00' },
      'FIRE_LIGHTNING': { emoji: '⚡', name: 'PLASMA', description: 'Element of energy', color: '#ff6600' },
      'WATER_ICE': { emoji: '🧊', name: 'GLACIER', description: 'Element of time', color: '#00bfff' },
      'WATER_AIR': { emoji: '🌊', name: 'TSUNAMI', description: 'Element of force', color: '#1e90ff' },
      'WATER_SOIL': { emoji: '🌱', name: 'LIFE', description: 'Element of growth', color: '#32cd32' },
      'WATER_MAGIC': { emoji: '🔮', name: 'AQUAMAGIC', description: 'Element of wisdom', color: '#9370db' },
      'WATER_ETHER': { emoji: '🌙', name: 'LUNAR', description: 'Element of cycles', color: '#4169e1' },
      'WATER_LIGHTNING': { emoji: '⚡', name: 'STORM', description: 'Element of chaos', color: '#00ffff' },
      'ICE_AIR': { emoji: '❄️', name: 'BLIZZARD', description: 'Element of purity', color: '#b0e0e6' },
      'ICE_SOIL': { emoji: '🏔️', name: 'MOUNTAIN', description: 'Element of endurance', color: '#708090' },
      'ICE_MAGIC': { emoji: '❄️', name: 'CRYSTAL', description: 'Element of clarity', color: '#e6e6fa' },
      'ICE_ETHER': { emoji: '🌌', name: 'VOID', description: 'Element of emptiness', color: '#483d8b' },
      'ICE_LIGHTNING': { emoji: '⚡', name: 'FROSTBOLT', description: 'Element of precision', color: '#add8e6' },
      'AIR_SOIL': { emoji: '🌪️', name: 'TORNADO', description: 'Element of change', color: '#8fbc8f' },
      'AIR_MAGIC': { emoji: '✨', name: 'AETHER', description: 'Element of spirit', color: '#dda0dd' },
      'AIR_ETHER': { emoji: '🌌', name: 'COSMOS', description: 'Element of infinity', color: '#9370db' },
      'AIR_LIGHTNING': { emoji: '⚡', name: 'THUNDER', description: 'Element of power', color: '#ffd700' },
      'SOIL_MAGIC': { emoji: '🌿', name: 'NATURE', description: 'Element of harmony', color: '#9acd32' },
      'SOIL_ETHER': { emoji: '🌑', name: 'SHADOW', description: 'Element of darkness', color: '#2f4f4f' },
      'SOIL_LIGHTNING': { emoji: '⚡', name: 'EARTHQUAKE', description: 'Element of foundation', color: '#daa520' },
      'MAGIC_ETHER': { emoji: '✨', name: 'ARCANE', description: 'Element of mystery', color: '#8b5cf6' },
      'MAGIC_LIGHTNING': { emoji: '⚡', name: 'SPARK', description: 'Element of creation', color: '#ff69b4' },
      'ETHER_LIGHTNING': { emoji: '⚡', name: 'VOIDBOLT', description: 'Element of destruction', color: '#4b0082' },
    };
    
    // Create merge key by sorting both card names alphabetically
    const mergeKey = [currentCard.name, otherCard.name].sort().join('_');
    console.log('Current card:', currentCard.name);
    console.log('Other card:', otherCard.name);
    console.log('Merge key:', mergeKey);
    console.log('Available combinations:', Object.keys(mergeResults));
    
    const result = mergeResults[mergeKey];
    
    if (result) {
      setOtherPlayerCard(otherCard);
      setMergedCard(result);
      setShowMergeAnimation(true);
      
      // Reset animations
      leftCardAnimation.setValue(0);
      rightCardAnimation.setValue(0);
      centerCardAnimation.setValue(0);
      
      // Start enhanced merge animation sequence
      Animated.sequence([
        // Phase 1: Show both cards sliding in smoothly
        Animated.parallel([
          Animated.timing(leftCardAnimation, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(rightCardAnimation, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        // Phase 2: Cards move to center and merge smoothly
        Animated.parallel([
          Animated.timing(leftCardAnimation, {
            toValue: 2,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(rightCardAnimation, {
            toValue: 2,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        // Phase 3: New card appears with smooth transition
        Animated.timing(centerCardAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update the daily card to the merged result with smooth transition
        setTimeout(() => {
          setIsTransitioning(true);
          setDailyCard(mergedCard);
          saveCardToCalendar(mergedCard);
          setShowMergeResult(true);
          setIsMerging(false);
          setShowMergeAnimation(false);
          
          // Start smooth transition animation
          Animated.timing(transitionAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start(() => {
            setIsTransitioning(false);
            transitionAnimation.setValue(0);
          });
        }, 1000);
      });
    } else {
      // Fallback: Create a random merge result if combination doesn't exist
      console.log('No specific combination found, creating fallback merge');
      const fallbackResult = {
        emoji: '✨',
        name: 'MYSTERY',
        description: 'Element of unknown power',
        color: '#8b5cf6'
      };
      
      setOtherPlayerCard(otherCard);
      setMergedCard(fallbackResult);
      setShowMergeAnimation(true);
      
      // Reset animations
      leftCardAnimation.setValue(0);
      rightCardAnimation.setValue(0);
      centerCardAnimation.setValue(0);
      
      // Start enhanced merge animation sequence
      Animated.sequence([
        // Phase 1: Show both cards sliding in smoothly
        Animated.parallel([
          Animated.timing(leftCardAnimation, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(rightCardAnimation, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        // Phase 2: Cards move to center and merge smoothly
        Animated.parallel([
          Animated.timing(leftCardAnimation, {
            toValue: 2,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(rightCardAnimation, {
            toValue: 2,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        // Phase 3: New card appears with smooth transition
        Animated.timing(centerCardAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update the daily card to the merged result with smooth transition
        setTimeout(() => {
          setIsTransitioning(true);
          setDailyCard(fallbackResult);
          saveCardToCalendar(fallbackResult);
          setShowMergeResult(true);
          setIsMerging(false);
          setShowMergeAnimation(false);
          
          // Start smooth transition animation
          Animated.timing(transitionAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start(() => {
            setIsTransitioning(false);
            transitionAnimation.setValue(0);
          });
        }, 1000);
      });
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
          <Animated.View style={[
            styles.storiesSection,
            {
              opacity: fadeInAnimation,
              transform: [
                {
                  translateY: slideUpAnimation,
                },
                {
                  scale: scaleAnimation,
                },
              ],
            },
          ]}>
            <Animated.Text style={[
              styles.storiesTitle,
              {
                opacity: fadeInAnimation,
                transform: [
                  {
                    scale: pulseAnimation,
                  },
                ],
              },
            ]}>STORIES</Animated.Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.storiesScroll}
            >
              {/* Add Story Item */}
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: pulseAnimation,
                    },
                  ],
                }}
              >
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
                    <Animated.View style={[
                      styles.plusIcon,
                      {
                        transform: [
                          {
                            rotate: rotateAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg'],
                            }),
                          },
                        ],
                      },
                    ]}>
                      <Text style={styles.plusText}>+</Text>
                    </Animated.View>
                  </View>
                  <Text style={styles.storyUsername}>Your Story</Text>
                </TouchableOpacity>
              </Animated.View>

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
          </Animated.View>

          {/* Daily Card Section */}
          <Animated.View style={[
            styles.dailyCardSection,
            {
              opacity: fadeInAnimation,
              transform: [
                {
                  translateY: slideUpAnimation,
                },
                {
                  scale: scaleAnimation,
                },
              ],
            },
          ]}>
            <Animated.Text style={[
              styles.dailyCardTitle,
              {
                opacity: fadeInAnimation,
                transform: [
                  {
                    scale: pulseAnimation,
                  },
                ],
              },
            ]}>TODAY'S CARD</Animated.Text>
                {dailyCard && (
                  <View style={styles.cardContainer}>
                    <View style={styles.dailyCardWrapper}>
                    <Animated.View style={[
                      styles.dailyCard, 
                      { 
                        shadowColor: showMergeAnimation ? mergedCard?.color : dailyCard.color,
                        borderWidth: showMergeAnimation ? 0 : 2,
                        transform: [
                          { scale: cardAnimation },
                          {
                            scale: showMergeAnimation ? centerCardAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.2],
                            }) : 1,
                          },
                          // Smooth transition animation
                          {
                            scale: isTransitioning ? transitionAnimation.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [1.2, 0.8, 1],
                            }) : 1,
                          },
                          {
                            rotateY: isTransitioning ? transitionAnimation.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: ['0deg', '180deg', '360deg'],
                            }) : '0deg',
                          },
                        ],
                        opacity: isTransitioning ? transitionAnimation.interpolate({
                          inputRange: [0, 0.3, 0.7, 1],
                          outputRange: [1, 0.3, 0.7, 1],
                        }) : 1,
                      }
                    ]}>
                        <LinearGradient
                          colors={[dailyCard.color + '20', dailyCard.color + '10', 'transparent']}
                          style={styles.cardGradient}
                        >
                          {/* Indian Mythological Art Pattern */}
                          <View style={styles.mythologicalPattern}>
                            <View style={styles.patternCorner} />
                            <View style={[styles.patternCorner, styles.patternCornerTopRight]} />
                            <View style={[styles.patternCorner, styles.patternCornerBottomLeft]} />
                            <View style={[styles.patternCorner, styles.patternCornerBottomRight]} />
                            
                            {/* Central Mandala */}
                            <View style={styles.mandalaContainer}>
                              <View style={styles.mandalaOuter} />
                              <View style={styles.mandalaInner} />
                              <View style={styles.mandalaCore} />
                            </View>
                            
                            {/* Lotus Petals */}
                            <View style={styles.lotusContainer}>
                              {Array.from({ length: 8 }).map((_, index) => (
                                <View
                                  key={index}
                                  style={[
                                    styles.lotusPetal,
                                    {
                                      transform: [{ rotate: `${index * 45}deg` }],
                                    },
                                  ]}
                                />
                              ))}
                            </View>
                          </View>
                          
                          {!showMergeAnimation && (
                            <>
                              <Text style={styles.dailyCardEmoji}>
                                {dailyCard.emoji}
                              </Text>
                              <Text style={[
                                styles.dailyCardName, 
                                { 
                                  textShadowColor: dailyCard.color,
                                  color: '#ffffff',
                                }
                              ]}>
                                {dailyCard.name}
                              </Text>
                            </>
                          )}
                        </LinearGradient>
                      </Animated.View>

                       {/* Simple Merge Animation */}
                       {showMergeAnimation && (
                         <View style={styles.simpleCardsContainer}>
                           {/* Your Card */}
                           <Animated.View style={[
                             styles.simpleCard,
                             {
                               transform: [
                                 {
                                   translateX: leftCardAnimation.interpolate({
                                     inputRange: [0, 1, 2],
                                     outputRange: [-100, 0, 0],
                                   }),
                                 },
                                 {
                                   scale: leftCardAnimation.interpolate({
                                     inputRange: [0, 1, 2],
                                     outputRange: [0.8, 1, 0.8],
                                   }),
                                 },
                               ],
                               opacity: leftCardAnimation.interpolate({
                                 inputRange: [0, 1, 2],
                                 outputRange: [0, 1, 0.3],
                               }),
                             },
                           ]}>
                             <LinearGradient
                               colors={[dailyCard?.color + '80', dailyCard?.color + '40', dailyCard?.color + '20']}
                               style={styles.homePageCardGradient}
                             >
                               {/* Indian Mythological Art Pattern */}
                               <View style={styles.mythologicalPattern}>
                                 <View style={styles.patternCorner} />
                                 <View style={[styles.patternCorner, styles.patternCornerTopRight]} />
                                 <View style={[styles.patternCorner, styles.patternCornerBottomLeft]} />
                                 <View style={[styles.patternCorner, styles.patternCornerBottomRight]} />
                                 
                                 {/* Central Mandala */}
                                 <View style={styles.mandalaContainer}>
                                   <View style={styles.mandalaOuter} />
                                   <View style={styles.mandalaInner} />
                                   <View style={styles.mandalaCore} />
                                 </View>
                                 
                                 {/* Lotus Petals */}
                                 <View style={styles.lotusContainer}>
                                   {Array.from({ length: 8 }).map((_, index) => (
                                     <View
                                       key={index}
                                       style={[
                                         styles.lotusPetal,
                                         {
                                           transform: [{ rotate: `${index * 45}deg` }],
                                         },
                                       ]}
                                     />
                                   ))}
                                 </View>
                               </View>
                               
                               <View style={styles.homePageCardInner}>
                                 <Text style={styles.homePageCardEmoji}>{dailyCard?.emoji}</Text>
                                 <Text style={[styles.homePageCardName, { color: dailyCard?.color }]}>{dailyCard?.name}</Text>
                               </View>
                             </LinearGradient>
                           </Animated.View>

                           {/* Other Player's Card */}
                           <Animated.View style={[
                             styles.simpleCard,
                             {
                               transform: [
                                 {
                                   translateX: rightCardAnimation.interpolate({
                                     inputRange: [0, 1, 2],
                                     outputRange: [100, 0, 0],
                                   }),
                                 },
                                 {
                                   scale: rightCardAnimation.interpolate({
                                     inputRange: [0, 1, 2],
                                     outputRange: [0.8, 1, 0.8],
                                   }),
                                 },
                               ],
                               opacity: rightCardAnimation.interpolate({
                                 inputRange: [0, 1, 2],
                                 outputRange: [0, 1, 0.3],
                               }),
                             },
                           ]}>
                             <LinearGradient
                               colors={[otherPlayerCard?.color + '80', otherPlayerCard?.color + '40', otherPlayerCard?.color + '20']}
                               style={styles.homePageCardGradient}
                             >
                               {/* Indian Mythological Art Pattern */}
                               <View style={styles.mythologicalPattern}>
                                 <View style={styles.patternCorner} />
                                 <View style={[styles.patternCorner, styles.patternCornerTopRight]} />
                                 <View style={[styles.patternCorner, styles.patternCornerBottomLeft]} />
                                 <View style={[styles.patternCorner, styles.patternCornerBottomRight]} />
                                 
                                 {/* Central Mandala */}
                                 <View style={styles.mandalaContainer}>
                                   <View style={styles.mandalaOuter} />
                                   <View style={styles.mandalaInner} />
                                   <View style={styles.mandalaCore} />
                                 </View>
                                 
                                 {/* Lotus Petals */}
                                 <View style={styles.lotusContainer}>
                                   {Array.from({ length: 8 }).map((_, index) => (
                                     <View
                                       key={index}
                                       style={[
                                         styles.lotusPetal,
                                         {
                                           transform: [{ rotate: `${index * 45}deg` }],
                                         },
                                       ]}
                                     />
                                   ))}
                                 </View>
                               </View>
                               
                               <View style={styles.homePageCardInner}>
                                 <Text style={styles.homePageCardEmoji}>{otherPlayerCard?.emoji}</Text>
                                 <Text style={[styles.homePageCardName, { color: otherPlayerCard?.color }]}>{otherPlayerCard?.name}</Text>
                               </View>
                             </LinearGradient>
                           </Animated.View>

                           {/* Merged Result Card */}
                           <Animated.View style={[
                             styles.mergedCard,
                             {
                               transform: [
                                 {
                                   scale: centerCardAnimation.interpolate({
                                     inputRange: [0, 1],
                                     outputRange: [0, 1],
                                   }),
                                 },
                               ],
                               opacity: centerCardAnimation.interpolate({
                                 inputRange: [0, 1],
                                 outputRange: [0, 1],
                               }),
                             },
                           ]}>
                             <LinearGradient
                               colors={[mergedCard?.color + '80', mergedCard?.color + '40', mergedCard?.color + '20']}
                               style={styles.homePageCardGradient}
                             >
                               {/* Indian Mythological Art Pattern */}
                               <View style={styles.mythologicalPattern}>
                                 <View style={styles.patternCorner} />
                                 <View style={[styles.patternCorner, styles.patternCornerTopRight]} />
                                 <View style={[styles.patternCorner, styles.patternCornerBottomLeft]} />
                                 <View style={[styles.patternCorner, styles.patternCornerBottomRight]} />
                                 
                                 {/* Central Mandala */}
                                 <View style={styles.mandalaContainer}>
                                   <View style={styles.mandalaOuter} />
                                   <View style={styles.mandalaInner} />
                                   <View style={styles.mandalaCore} />
                                 </View>
                                 
                                 {/* Lotus Petals */}
                                 <View style={styles.lotusContainer}>
                                   {Array.from({ length: 8 }).map((_, index) => (
                                     <View
                                       key={index}
                                       style={[
                                         styles.lotusPetal,
                                         {
                                           transform: [{ rotate: `${index * 45}deg` }],
                                         },
                                       ]}
                                     />
                                   ))}
                                 </View>
                               </View>
                               
                               <View style={styles.homePageCardInner}>
                                 <Text style={styles.homePageCardEmoji}>{mergedCard?.emoji}</Text>
                                 <Text style={[styles.homePageCardName, { color: mergedCard?.color }]}>{mergedCard?.name}</Text>
                               </View>
                             </LinearGradient>
                           </Animated.View>
                         </View>
                       )}
                    </View>
                    
                    <Text style={styles.dailyCardDescription}>
                      {dailyCard.description}
                    </Text>
                  </View>
                )}
          </Animated.View>
                
                {/* Merge Code Input */}
                <Animated.View style={[
                  styles.mergeSection,
                  {
                    opacity: fadeInAnimation,
                    transform: [
                      {
                        translateY: slideUpAnimation,
                      },
                      {
                        scale: scaleAnimation,
                      },
                    ],
                  },
                ]}>
                  <Animated.Text style={[
                    styles.mergeTitle,
                    {
                      opacity: fadeInAnimation,
                      transform: [
                        {
                          scale: pulseAnimation,
                        },
                      ],
                    },
                  ]}>ENTER MERGE CODE</Animated.Text>
                  <View style={styles.mergeCodeContainer}>
                    {mergeCode.map((digit, index) => (
                      <Animated.View
                        key={index}
                        style={{
                          transform: [
                            {
                              scale: pulseAnimation,
                            },
                          ],
                        }}
                      >
                        <TextInput
                          ref={(ref) => (inputRefs.current[index] = ref)}
                          style={[
                            styles.mergeCodeInput,
                            digit && styles.mergeCodeInputFilled,
                            isMerging && styles.mergeCodeInputMerging
                          ]}
                          value={digit}
                          onChangeText={(text) => handleMergeCodeChange(text, index)}
                          onKeyPress={({ nativeEvent }) => handleMergeCodeKeyPress(nativeEvent.key, index)}
                          maxLength={1}
                          autoCapitalize="characters"
                          keyboardType="default"
                          textAlign="center"
                          selectionColor="#00d4ff"
                        returnKeyType="next"
                      />
                      {/* Shimmer Effect */}
                      <Animated.View style={[
                        styles.shimmerOverlay,
                        {
                          opacity: shimmerAnimation.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0.3, 0],
                          }),
                          transform: [
                            {
                              translateX: shimmerAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-50, 50],
                              }),
                            },
                          ],
                        },
                      ]} />
                      </Animated.View>
                    ))}
                  </View>
                </Animated.View>
                  
                  {isMerging && (
                    <Animated.View style={[styles.mergeAnimation, { opacity: mergeAnimation }]}>
                      <Text style={styles.mergeAnimationText}>MERGING...</Text>
                    </Animated.View>
                  )}

                {/* Calendar Section */}
                <Animated.View style={[
                  styles.calendarSection,
                  {
                    opacity: fadeInAnimation,
                    transform: [
                      {
                        translateY: slideUpAnimation,
                      },
                      {
                        scale: scaleAnimation,
                      },
                    ],
                  },
                ]}>
                  <TouchableOpacity
                    style={styles.calendarToggle}
                    onPress={() => setShowCalendar(!showCalendar)}
                  >
                    <Text style={styles.calendarToggleText}>
                      {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                    </Text>
                  </TouchableOpacity>

                  {showCalendar && (
                    <View style={styles.calendarContainer}>
                      <Text style={styles.calendarTitle}>Your Cards This Month</Text>
                      <View style={styles.calendarGrid}>
                        {generateCalendar().map((day, index) => (
                          <View key={index} style={styles.calendarDay}>
                            {day ? (
                              <View style={[
                                styles.calendarDayContent,
                                day.isToday && styles.calendarToday
                              ]}>
                                <Text style={styles.calendarDayNumber}>{day.day}</Text>
                                {day.card && (
                                  <View style={styles.calendarCard}>
                                    <Text style={styles.calendarCardEmoji}>{day.card.emoji}</Text>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View style={styles.calendarEmptyDay} />
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </Animated.View>
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing.lg,
    fontFamily: 'Courier New',
    textAlign: 'center',
    paddingHorizontal: 0,
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  storiesScroll: {
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
  },

  storyItem: {
    alignItems: 'center',
    marginLeft: spacing.sm,
    width: 85,
  },

  storyAvatar: {
    width: 50,
    height: 50,
    padding: spacing.sm,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 2,
  },

  storyAvatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  storyUsername: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
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

  dailyCardWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mergeAnimationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 16,
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
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


  // Premium Merge Animation Styles
  premiumMergeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  premiumBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#00d4ff',
    borderRadius: 1,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  premiumTitleContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  premiumTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    fontFamily: 'Courier New',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  titleUnderline: {
    width: 60,
    height: 2,
    backgroundColor: '#00d4ff',
    borderRadius: 1,
  },

  mergeAnimationTitle: {
    color: '#00d4ff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    marginBottom: spacing.md,
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
  },

  progressBarContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 2,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  premiumCard: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },

  premiumLeftCard: {
    left: 40,
  },

  premiumRightCard: {
    right: 40,
  },

  premiumCenterCard: {
    left: '50%',
    marginLeft: -70,
    borderColor: '#00d4ff',
    borderWidth: 3,
    shadowColor: '#00d4ff',
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },

  premiumCardGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  premiumCardInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  premiumCardEmoji: {
    fontSize: 50,
    marginBottom: spacing.md,
  },

  premiumCardName: {
    color: '#ffffff',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },

  mergeEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },

  mergeEffectText: {
    fontSize: 40,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  // Premium Effects
  premiumMergeEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  premiumEffectRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(0, 212, 255, 0.8)',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },

  premiumEffectCore: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.6)',
  },

  premiumCompletionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  premiumCompletionText: {
    color: '#00d4ff',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    fontFamily: 'Courier New',
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  premiumCompletionSubtext: {
    color: '#ffffff',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    textAlign: 'center',
    opacity: 0.8,
  },

  // Ultra Cool Merge Animation Styles
  ultraCoolMergeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  cosmicBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  cosmicParticleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  cosmicParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },

  energyWaveContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  energyWave: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },

  epicTitleContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  epicTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    letterSpacing: 3,
    fontFamily: 'Courier New',
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  epicTitleGlow: {
    position: 'absolute',
    top: -5,
    left: -10,
    right: -10,
    bottom: -5,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 10,
    zIndex: -1,
  },

  epicSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    opacity: 0.8,
  },

  ultraCoolCard: {
    width: 160,
    height: 160,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },

  ultraCoolLeftCard: {
    position: 'absolute',
    left: -100,
    top: '50%',
    marginTop: -80,
  },

  ultraCoolRightCard: {
    position: 'absolute',
    right: -100,
    top: '50%',
    marginTop: -80,
  },

  ultraCoolCenterCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -80,
    marginLeft: -80,
    zIndex: 5,
  },

  ultraCoolMergeEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },

  ultraCoolEffectRing1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#00d4ff',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },

  ultraCoolEffectRing2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#ff00ff',
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
  },

  ultraCoolEffectRing3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ffff00',
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
  },

  ultraCoolEffectCore: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },

  energyBurstContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  energyBurst: {
    position: 'absolute',
    width: 4,
    height: 80,
    backgroundColor: '#00d4ff',
    borderRadius: 2,
    top: 10,
    left: '50%',
    marginLeft: -2,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },

  epicCompletionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  epicCompletionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: 'Courier New',
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  epicCompletionGlow: {
    position: 'absolute',
    top: -8,
    left: -15,
    right: -15,
    bottom: -8,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    borderRadius: 15,
    zIndex: -1,
  },

  epicCompletionSubtext: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
    fontFamily: 'Courier New',
    opacity: 0.9,
  },

  // Beautiful Aesthetic Animation Styles
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    zIndex: 1,
  },

  // Simple Two Cards Display Styles
  simpleCardsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 10,
  },

  simpleCard: {
    width: 120,
    height: 150,
    marginHorizontal: 20,
  },

  mergedCard: {
    position: 'absolute',
    width: 160,
    height: 200,
    zIndex: 5,
  },

  homePageCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 0,
    position: 'relative',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },

  homePageCardInner: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  homePageCardEmoji: {
    fontSize: 32,
    marginBottom: 8,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  homePageCardName: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  elementalCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 0,
    position: 'relative',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },

  elementalCardInner: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  elementalCardEmoji: {
    fontSize: 32,
    marginBottom: 8,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  elementalCardName: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  mythologicalPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  patternCorner: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 15,
    height: 15,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  patternCornerTopRight: {
    top: 10,
    right: 10,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 1,
  },

  patternCornerBottomLeft: {
    bottom: 10,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 1,
  },

  patternCornerBottomRight: {
    bottom: 10,
    right: 10,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },

  mandalaContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mandalaOuter: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  mandalaInner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  mandalaCore: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  lotusContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
    width: 30,
    height: 30,
  },

  lotusPetal: {
    position: 'absolute',
    width: 3,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1.5,
    top: 0,
    left: '50%',
    marginLeft: -1.5,
  },

  mysteryCard: {
    width: 140,
    height: 180,
    borderRadius: 20,
    position: 'absolute',
    zIndex: 3,
  },

  mysteryLeftCard: {
    position: 'absolute',
    left: -150,
    top: '50%',
    marginTop: -90,
    zIndex: 2,
  },

  mysteryRightCard: {
    position: 'absolute',
    right: -150,
    top: '50%',
    marginTop: -90,
    zIndex: 2,
  },

  mysteryCenterCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -90,
    marginLeft: -70,
    zIndex: 4,
  },

  mysteryCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    shadowColor: '#6B46C1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },

  cornerAccent: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 20,
    height: 20,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },

  cornerAccentTopRight: {
    top: 15,
    right: 15,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 2,
  },

  cornerAccentBottomLeft: {
    bottom: 15,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 2,
  },

  cornerAccentBottomRight: {
    bottom: 15,
    right: 15,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },

  gearSymbol: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.3,
  },

  starSparkles: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
  },

  starSparkle: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderRadius: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  starSparkleLarge: {
    width: 8,
    height: 8,
    top: 35,
    right: 25,
    transform: [{ rotate: '45deg' }],
  },

  starSparkleMedium: {
    width: 6,
    height: 6,
    top: 25,
    left: 30,
    transform: [{ rotate: '45deg' }],
  },

  starSparkleSmall: {
    width: 4,
    height: 4,
    bottom: 30,
    left: 35,
    transform: [{ rotate: '45deg' }],
  },

  mysteryCardInner: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingTop: 20,
  },

  mysteryCardEmoji: {
    fontSize: 32,
    marginBottom: 8,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  mysteryCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D4FF',
    fontFamily: 'Courier New',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },

  elementalMergeEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  elementalRing: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 3,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },

  elementalRing1: {
    width: 200,
    height: 200,
    borderColor: '#00d4ff',
  },

  elementalRing2: {
    width: 160,
    height: 160,
    borderColor: '#ff00ff',
  },

  elementalRing3: {
    width: 120,
    height: 120,
    borderColor: '#ffff00',
  },

  elementalCore: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },

  elementalEnergyBeams: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  elementalEnergyBeam: {
    position: 'absolute',
    width: 3,
    height: 60,
    backgroundColor: '#00d4ff',
    borderRadius: 1.5,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  elementalCompletionContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  elementalCompletionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    fontFamily: 'Courier New',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  elementalCompletionSubtext: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Courier New',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Calendar Styles
  calendarSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },

  calendarToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },

  calendarToggleText: {
    color: '#ffffff',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Courier New',
    letterSpacing: 1,
  },

  calendarContainer: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  calendarTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Courier New',
    textAlign: 'center',
    marginBottom: spacing.lg,
    letterSpacing: 1,
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  calendarDay: {
    width: '14%',
    aspectRatio: 1,
    marginBottom: spacing.sm,
  },

  calendarDayContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },

  calendarToday: {
    borderColor: '#00d4ff',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },

  calendarDayNumber: {
    color: '#ffffff',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Courier New',
  },

  calendarCard: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarCardEmoji: {
    fontSize: 8,
  },

  calendarEmptyDay: {
    flex: 1,
  },

  // Indian Mythological Art Patterns
  mythologicalPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },

  // Corner Patterns
  patternCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    top: 10,
    left: 10,
  },

  patternCornerTopRight: {
    top: 10,
    right: 10,
    left: 'auto',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },

  patternCornerBottomLeft: {
    bottom: 10,
    left: 10,
    top: 'auto',
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },

  patternCornerBottomRight: {
    bottom: 10,
    right: 10,
    top: 'auto',
    left: 'auto',
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },

  // Central Mandala
  mandalaContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mandalaOuter: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  mandalaInner: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  mandalaCore: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Lotus Petals
  lotusContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lotusPetal: {
    position: 'absolute',
    width: 8,
    height: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    top: 0,
    left: '50%',
    marginLeft: -4,
    transformOrigin: '4px 40px',
  },

  // Other Player's Card Styles
  otherPlayerCard: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
    right: -40,
    top: '50%',
    marginTop: -40,
  },

  otherPlayerCardGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otherPlayerCardEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },

  otherPlayerCardName: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
    fontFamily: 'Courier New',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
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
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden',
  },

  cardGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
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
