import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({ rating, onRatingChange, size = 24, readonly = false }: StarRatingProps) {
  const { theme } = useApp();

  const handlePress = (selectedRating: number) => {
    if (readonly || !onRatingChange) return;
    // Toggle off if clicking the same rating
    onRatingChange(selectedRating === rating ? 0 : selectedRating);
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handlePress(star)}
          disabled={readonly}
          style={styles.starButton}
        >
          <Star
            size={size}
            color={star <= rating ? '#f59e0b' : theme.textMuted}
            fill={star <= rating ? '#f59e0b' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
  starButton: {
    padding: 2,
  },
});
