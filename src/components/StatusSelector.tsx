import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ReadingStatus } from '../types';
import { BookOpen, Check, Clock, XCircle } from 'lucide-react-native';

interface StatusSelectorProps {
  status?: ReadingStatus;
  onStatusChange: (status: ReadingStatus | undefined) => void;
  compact?: boolean;
}

export function StatusSelector({ status, onStatusChange, compact = false }: StatusSelectorProps) {
  const { theme, t } = useApp();

  const statusOptions: { value: ReadingStatus | undefined; icon: React.ReactNode; label: string; color: string }[] = [
    { value: undefined, icon: null, label: t('noStatus'), color: theme.textMuted },
    { value: 'want_to_read', icon: <Clock size={compact ? 14 : 16} color="#3b82f6" />, label: t('wantToRead'), color: '#3b82f6' },
    { value: 'reading', icon: <BookOpen size={compact ? 14 : 16} color="#f59e0b" />, label: t('reading'), color: '#f59e0b' },
    { value: 'completed', icon: <Check size={compact ? 14 : 16} color="#22c55e" />, label: t('completed'), color: '#22c55e' },
    { value: 'dropped', icon: <XCircle size={compact ? 14 : 16} color="#ef4444" />, label: t('dropped'), color: '#ef4444' },
  ];

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {statusOptions.filter(o => o.value !== undefined).map((option) => (
          <TouchableOpacity
            key={option.value || 'none'}
            onPress={() => onStatusChange(option.value)}
            style={[
              styles.compactChip,
              { 
                backgroundColor: status === option.value ? option.color : theme.inputBg,
                borderColor: status === option.value ? option.color : theme.inputBorder,
              }
            ]}
          >
            {React.cloneElement(option.icon as React.ReactElement, {
              color: status === option.value ? '#fff' : option.color
            })}
            <Text style={[
              styles.compactText,
              { color: status === option.value ? '#fff' : theme.text }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {statusOptions.map((option) => (
        <TouchableOpacity
          key={option.value || 'none'}
          onPress={() => onStatusChange(option.value)}
          style={[
            styles.option,
            { 
              backgroundColor: status === option.value ? option.color : theme.inputBg,
              borderColor: status === option.value ? option.color : theme.inputBorder,
            }
          ]}
        >
          {option.icon && React.cloneElement(option.icon as React.ReactElement, {
            color: status === option.value ? '#fff' : option.color
          })}
          <Text style={[
            styles.optionText,
            { color: status === option.value ? '#fff' : theme.text }
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  compactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  compactText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
