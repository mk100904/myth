import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Image,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');

const CameraScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [isRecording, setIsRecording] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const [cameraType, setCameraType] = useState('back');
  const [showFilters, setShowFilters] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filters = [
    { id: 'normal', name: 'Normal', emoji: '📷' },
    { id: 'vintage', name: 'Vintage', emoji: '📸' },
    { id: 'blackwhite', name: 'B&W', emoji: '⚫' },
    { id: 'sepia', name: 'Sepia', emoji: '🟤' },
    { id: 'cool', name: 'Cool', emoji: '❄️' },
    { id: 'warm', name: 'Warm', emoji: '🔥' },
    { id: 'dramatic', name: 'Dramatic', emoji: '⚡' },
    { id: 'portrait', name: 'Portrait', emoji: '👤' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTakePhoto = () => {
    Alert.alert('Photo Taken!', 'Photo saved to your story!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleRecordVideo = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false);
        Alert.alert('Video Recorded!', 'Video saved to your story!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }, 3000); // 3 second recording
    }
  };

  const handleGallery = () => {
    Alert.alert('Gallery', 'Choose from gallery feature coming soon!');
  };

  const handleFilterSelect = (filterId) => {
    setSelectedFilter(filterId);
    setShowFilters(false);
  };

  const handleFlashToggle = () => {
    const modes = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flashMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlashMode(modes[nextIndex]);
  };

  const handleCameraFlip = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back');
  };

  const getFilterStyle = () => {
    switch (selectedFilter) {
      case 'vintage':
        return { opacity: 0.8, tintColor: '#8B4513' };
      case 'blackwhite':
        return { opacity: 0.9, tintColor: '#000000' };
      case 'sepia':
        return { opacity: 0.8, tintColor: '#704214' };
      case 'cool':
        return { opacity: 0.8, tintColor: '#87CEEB' };
      case 'warm':
        return { opacity: 0.8, tintColor: '#FFA500' };
      case 'dramatic':
        return { opacity: 0.7, tintColor: '#4B0082' };
      case 'portrait':
        return { opacity: 0.9, tintColor: '#FF69B4' };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <LinearGradient
        colors={['#000000', '#000011', '#000022']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>✕</Text>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>MYTH CAMERA</Text>
            
            <TouchableOpacity onPress={handleFlashToggle} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>
                {flashMode === 'off' ? '⚡' : flashMode === 'on' ? '⚡' : '⚡'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Camera View */}
          <View style={styles.cameraContainer}>
            <View style={[styles.cameraView, getFilterStyle()]}>
              {/* Mock camera view - in real app, this would be Camera component */}
              <View style={styles.mockCamera}>
                <Text style={styles.cameraText}>📷</Text>
                <Text style={styles.cameraLabel}>Camera View</Text>
                <Text style={styles.filterLabel}>Filter: {filters.find(f => f.id === selectedFilter)?.name}</Text>
              </View>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={handleGallery} style={styles.controlButton}>
              <Text style={styles.controlButtonText}>📁</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleTakePhoto} 
              style={[styles.captureButton, isRecording && styles.recordingButton]}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCameraFlip} style={styles.controlButton}>
              <Text style={styles.controlButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <TouchableOpacity 
              onPress={() => setShowFilters(!showFilters)}
              style={styles.filterToggle}
            >
              <Text style={styles.filterToggleText}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Text>
            </TouchableOpacity>

            {showFilters && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filtersScroll}
              >
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterItem,
                      selectedFilter === filter.id && styles.selectedFilter
                    ]}
                    onPress={() => handleFilterSelect(filter.id)}
                  >
                    <Text style={styles.filterEmoji}>{filter.emoji}</Text>
                    <Text style={styles.filterName}>{filter.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </Animated.View>
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
  
  content: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerButtonText: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  
  headerTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    fontFamily: 'Courier New',
  },
  
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  
  cameraView: {
    width: width - spacing.xl,
    height: height * 0.5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  mockCamera: {
    alignItems: 'center',
  },
  
  cameraText: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  
  cameraLabel: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Courier New',
    marginBottom: spacing.sm,
  },
  
  filterLabel: {
    color: '#00d4ff',
    fontSize: typography.fontSize.sm,
    fontFamily: 'Courier New',
  },
  
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  controlButtonText: {
    fontSize: typography.fontSize.xl,
  },
  
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#00d4ff',
  },
  
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00d4ff',
  },
  
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  
  filterToggle: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  
  filterToggleText: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Courier New',
  },
  
  filtersScroll: {
    paddingHorizontal: spacing.sm,
  },
  
  filterItem: {
    alignItems: 'center',
    marginRight: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    minWidth: 60,
  },
  
  selectedFilter: {
    backgroundColor: '#00d4ff',
  },
  
  filterEmoji: {
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.xs,
  },
  
  filterName: {
    color: '#ffffff',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'Courier New',
    textAlign: 'center',
  },
});

export default CameraScreen;
