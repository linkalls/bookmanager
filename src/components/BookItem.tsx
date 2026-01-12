import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Book as BookType, getProgressPercentage } from '../types';
import { Book as BookIcon, Check, Trash2, ShoppingCart, BookOpen, Clock, XCircle, Star, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useApp } from '../context/AppContext';
import { getAmazonUrl } from '../utils/isbn';
import { ProgressBar } from './ProgressBar';

interface BookItemProps {
  book: BookType;
  isSaved: boolean;
  onToggleSave: (book: BookType) => void;
  onRemove?: (id: string) => void;
  compact?: boolean;
}

export function BookItem({ book, isSaved, onToggleSave, onRemove, compact = false }: BookItemProps) {
  const router = useRouter();
  const { theme, isDark, t } = useApp();
  const amazonUrl = getAmazonUrl(book.isbn);
  const progress = getProgressPercentage(book);

  const handlePress = () => {
    router.push({
      pathname: "/book/[id]",
      params: { id: book.id, bookData: JSON.stringify(book) }
    });
  };
  
  const getStatusIcon = () => {
    switch (book.status) {
      case 'want_to_read':
        return <Clock size={12} color="#3b82f6" />;
      case 'reading':
        return <BookOpen size={12} color="#f59e0b" />;
      case 'completed':
        return <Check size={12} color="#22c55e" />;
      case 'dropped':
        return <XCircle size={12} color="#ef4444" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = () => {
    switch (book.status) {
      case 'want_to_read':
        return '#3b82f6';
      case 'reading':
        return '#f59e0b';
      case 'completed':
        return '#22c55e';
      case 'dropped':
        return '#ef4444';
      default:
        return theme.textMuted;
    }
  };

  if (compact) {
    return (
      <TouchableOpacity 
        onPress={handlePress} 
        style={[styles.compactContainer, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}
      >
        <View style={[styles.compactThumbnail, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          {book.thumbnail ? (
            <Image source={{ uri: book.thumbnail }} style={styles.compactImage} resizeMode="cover" />
          ) : (
            <BookIcon color={theme.textMuted} size={16} />
          )}
          {book.status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              {getStatusIcon()}
            </View>
          )}
        </View>
        <View style={styles.compactInfo}>
          <View style={styles.compactTitleRow}>
            <Text style={[styles.compactTitle, { color: theme.text }]} numberOfLines={1}>{book.title}</Text>
            {book.rating && book.rating > 0 && (
              <View style={styles.ratingBadge}>
                <Star size={10} color="#f59e0b" fill="#f59e0b" />
                <Text style={styles.ratingText}>{book.rating}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.compactAuthor, { color: theme.textSecondary }]} numberOfLines={1}>{book.authors.join(', ')}</Text>
          
          {/* Progress bar for reading books */}
          {book.status === 'reading' && book.totalPages && book.totalPages > 0 && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress} height={4} showLabel={false} />
              <Text style={[styles.progressText, { color: theme.textMuted }]}>
                {book.currentPage || 0}/{book.totalPages}
              </Text>
            </View>
          )}
          
          {/* Lending indicator */}
          {book.lendingStatus?.borrower && (
            <View style={[styles.lendingBadge, { backgroundColor: '#8b5cf620' }]}>
              <User size={10} color="#8b5cf6" />
              <Text style={styles.lendingText}>{book.lendingStatus.borrower}</Text>
            </View>
          )}
          
          {book.tags && book.tags.length > 0 && !book.lendingStatus?.borrower && !(book.status === 'reading' && book.totalPages) && (
            <View style={styles.tagsRow}>
              {book.tags.slice(0, 3).map((tag, idx) => (
                <View key={idx} style={[styles.tagBadge, { backgroundColor: theme.tagBg }]}>
                  <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
                </View>
              ))}
              {book.tags.length > 3 && (
                <Text style={[styles.moreText, { color: theme.textMuted }]}>+{book.tags.length - 3}</Text>
              )}
            </View>
          )}
        </View>
        {onRemove && (
          <TouchableOpacity onPress={() => onRemove(book.id)} style={styles.removeButton}>
            <Trash2 size={16} color={theme.danger} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme.card, borderColor: isSaved ? theme.successLight : theme.cardBorder }
    ]}>
      <TouchableOpacity onPress={handlePress} style={[styles.thumbnail, { backgroundColor: theme.inputBg }]}>
        {book.thumbnail ? (
          <Image source={{ uri: book.thumbnail }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.noImage}>
            <BookIcon color={theme.textMuted} size={32} />
          </View>
        )}
        {isSaved && (
          <View style={styles.savedBadge}>
            <Check size={12} color="white" />
          </View>
        )}
        {book.status && (
          <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor() }]}>
            {getStatusIcon()}
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.info}>
        <TouchableOpacity onPress={handlePress}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{book.title}</Text>
          </View>
          <Text style={[styles.author, { color: theme.textSecondary }]} numberOfLines={1}>{book.authors.join(', ')}</Text>
        </TouchableOpacity>
        
        {/* Rating display */}
        {book.rating && book.rating > 0 && (
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                color={star <= book.rating! ? '#f59e0b' : theme.textMuted}
                fill={star <= book.rating! ? '#f59e0b' : 'transparent'}
              />
            ))}
          </View>
        )}

        {book.tags && book.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {book.tags.slice(0, 2).map((tag, idx) => (
              <View key={idx} style={[styles.tagBadge, { backgroundColor: theme.tagBg }]}>
                <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
              </View>
            ))}
            {book.tags.length > 2 && (
              <Text style={[styles.moreText, { color: theme.textMuted }]}>+{book.tags.length - 2}</Text>
            )}
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => onToggleSave(book)}
            style={[styles.saveButton, isSaved ? { backgroundColor: theme.successLight } : { backgroundColor: '#4f46e5' }]}
          >
            {isSaved ? (
              <>
                <Check size={14} color={isDark ? '#4ade80' : '#15803d'} />
                <Text style={[styles.savedText, { color: isDark ? '#4ade80' : '#15803d' }]}>{t('saved')}</Text>
              </>
            ) : (
              <Text style={styles.saveText}>{t('save')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL(book.link)}
            style={[styles.linkButton, { backgroundColor: theme.inputBg }]}
          >
            <Text style={[styles.linkButtonText, { color: '#3b82f6' }]}>G</Text>
          </TouchableOpacity>

          {amazonUrl && (
            <TouchableOpacity
              onPress={() => Linking.openURL(amazonUrl)}
              style={[styles.linkButton, { backgroundColor: '#ff9900' }]}
            >
              <ShoppingCart size={14} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  thumbnail: {
    width: 80,
    height: 112,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#22c55e',
    padding: 4,
    borderBottomLeftRadius: 8,
  },
  statusBadgeLarge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 4,
    borderTopRightRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
    flex: 1,
  },
  author: {
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  moreText: {
    fontSize: 10,
    marginLeft: 2,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  savedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  compactContainer: {
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  compactThumbnail: {
    width: 40,
    height: 56,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 2,
    borderTopRightRadius: 4,
  },
  compactInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  compactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  compactAuthor: {
    fontSize: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  progressText: {
    fontSize: 10,
    minWidth: 45,
  },
  lendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  lendingText: {
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
});
