import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showLabel?: boolean;
  color?: string;
}

export function ProgressBar({ progress, height = 8, showLabel = true, color }: ProgressBarProps) {
  const { theme } = useApp();
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const progressColor = color || (clampedProgress === 100 ? theme.success : theme.primary);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height, backgroundColor: theme.inputBg }]}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${clampedProgress}%`, 
              backgroundColor: progressColor,
              height,
            }
          ]} 
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {clampedProgress}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'right',
  },
});
