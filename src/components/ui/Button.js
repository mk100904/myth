import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'large', 
  disabled = false,
  style,
  textStyle,
  ...props 
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[variant], styles[size]];
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  const getGradientColors = () => {
    if (variant === 'primary') {
      return ['#f8fafc', '#e2e8f0', '#cbd5e1'];
    } else if (variant === 'secondary') {
      return ['#f1f5f9', '#e2e8f0', '#cbd5e1'];
    }
    return ['#059669', '#10b981', '#34d399'];
  };

  const getShadowColor = () => {
    if (variant === 'primary') return '#cbd5e1';
    if (variant === 'secondary') return '#cbd5e1';
    return '#059669';
  };

  if (variant === 'secondary') {
    return (
      <View style={[styles.shadowContainer, { shadowColor: getShadowColor() }]}>
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.8}
          {...props}
        >
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={getButtonStyle()}
          >
            <Text style={getTextStyle()}>{title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.shadowContainer, { shadowColor: getShadowColor() }]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={getButtonStyle()}
        >
          <Text style={getTextStyle()}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  primary: {
    // Handled by LinearGradient
  },
  secondary: {
    // Handled by LinearGradient
  },
  accent: {
    // Handled by LinearGradient
  },
  
  // Sizes
  small: {
    paddingVertical: spacing.sm + 6,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  medium: {
    paddingVertical: spacing.md + 6,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  large: {
    paddingVertical: spacing.lg + 6,
    paddingHorizontal: spacing.xl,
    minHeight: 60,
  },
  
  // States
  disabled: {
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.surfaceTertiary,
  },
  
  // Text styles
  text: {
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: 1,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontFamily: 'Courier New',
    lineHeight: 20,
  },
  primaryText: {
    color: '#1e293b',
  },
  secondaryText: {
    color: '#1e293b',
  },
  accentText: {
    color: '#ffffff',
  },
  
  // Text sizes
  smallText: {
    fontSize: typography.fontSize.xs,
  },
  mediumText: {
    fontSize: typography.fontSize.sm,
  },
  largeText: {
    fontSize: typography.fontSize.base,
  },
  
  disabledText: {
    color: colors.textTertiary,
  },
});

export default Button;
