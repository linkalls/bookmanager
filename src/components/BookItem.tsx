import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Book as BookType } from '../types';
import { Book as BookIcon, Check, Trash2, ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useApp } from '../context/AppContext';
import { getAmazonUrl } from '../utils/isbn';

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

  const handlePress = () => {
    router.push({
      pathname: "/book/[id]",
      params: { id: book.id, bookData: JSON.stringify(book) }
    });
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
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{book.title}</Text>
          <Text style={[styles.compactAuthor, { color: theme.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">{book.authors.join(', ')}</Text>

          {/* Progress Bar for compact view */}
          {book.totalPages && book.currentPage ? (
            <View style={styles.compactProgressContainer}>
              <View style={[styles.compactProgressBar, { backgroundColor: theme.inputBorder }]}>
                <View
                  style={[
                    styles.compactProgressFill,
                    {
                      backgroundColor: theme.primary,
                      width: `${Math.min(100, (book.currentPage / book.totalPages) * 100)}%`
                    }
                  ]}
                />
              </View>
              <Text style={[styles.compactProgressText, { color: theme.textSecondary }]}>
                {Math.round((book.currentPage / book.totalPages) * 100)}%
              </Text>
            </View>
          ) : book.status === 'reading' ? (
             <View style={styles.statusBadge}>
                <Text style={[styles.statusText, { color: theme.primary }]}>Reading</Text>
             </View>
          ) : null}

          {book.tags && book.tags.length > 0 && (
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
      </TouchableOpacity>

      <View style={styles.info}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{book.title}</Text>
          <Text style={[styles.author, { color: theme.textSecondary }]} numberOfLines={1}>{book.authors.join(', ')}</Text>
        </TouchableOpacity>

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
  info: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
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
  compactInfo: {
    flex: 1,
    minWidth: 0,
  },
  compactTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
  compactAuthor: {
    fontSize: 12,
    lineHeight: 18,
  },
  compactProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  compactProgressBar: {
    height: 4,
    flex: 1,
    maxWidth: 100,
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  compactProgressText: {
    fontSize: 10,
  },
  statusBadge: {
    marginTop: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
  },
});
