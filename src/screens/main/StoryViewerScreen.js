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
  Image,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');

const StoryViewerScreen = ({ navigation, route }) => {
  const { stories, currentIndex } = route.params;
  const [currentStoryIndex, setCurrentStoryIndex] = useState(currentIndex || 0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    startProgress();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStoryIndex]);

  const startProgress = () => {
    setProgress(0);
    progressAnimation.setValue(0);
    
    if (!isPaused) {
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 5000, // 5 seconds per story
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          nextStory();
        }
      });
    }
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // All stories viewed, go back
      navigation.goBack();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleScreenPress = (event) => {
    const { locationX } = event.nativeEvent;
    const screenWidth = width;
    
    if (locationX < screenWidth / 2) {
      // Left side - previous story
      previousStory();
    } else {
      // Right side - next story
      nextStory();
    }
  };

  const handleLongPress = () => {
    setIsPaused(true);
    progressAnimation.stopAnimation();
  };

  const handleLongPressEnd = () => {
    setIsPaused(false);
    startProgress();
  };

  const currentStory = stories[currentStoryIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <TouchableOpacity
        style={styles.storyContainer}
        activeOpacity={1}
        onPress={handleScreenPress}
        onLongPress={handleLongPress}
        onPressOut={handleLongPressEnd}
      >
        {/* Story Image Background */}
        <Image
          source={{ uri: currentStory.image }}
          style={styles.storyImage}
          resizeMode="cover"
        />
        
        {/* Dark overlay */}
        <View style={styles.overlay} />
        
        {/* Progress bars */}
        <View style={styles.progressContainer}>
          {stories.map((_, index) => (
            <View key={index} style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', index === currentStoryIndex ? '100%' : index < currentStoryIndex ? '100%' : '0%'],
                    }),
                  },
                ]}
              />
            </View>
          ))}
        </View>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.avatar}>{currentStory.avatar}</Text>
            <Text style={styles.username}>{currentStory.username}</Text>
            <Text style={styles.timestamp}>{currentStory.timestamp}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        {/* Story content overlay */}
        <View style={styles.contentOverlay}>
          <Text style={styles.storyText}>
            {currentStory.image.split('text=')[1]?.replace(/\+/g, ' ') || 'Epic Moment!'}
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  storyContainer: {
    flex: 1,
  },
  
  storyImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  avatar: {
    fontSize: 32,
  },
  
  username: {
    color: '#ffffff',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Courier New',
    letterSpacing: 1,
  },
  
  timestamp: {
    color: '#cccccc',
    fontSize: typography.fontSize.sm,
    fontFamily: 'Courier New',
  },
  
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  contentOverlay: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
  },
  
  storyText: {
    color: '#ffffff',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Courier New',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default StoryViewerScreen;
