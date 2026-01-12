import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useBooks } from '../../src/hooks/useBooks';
import { Book } from '../../src/types';
import { ArrowLeft, Save, Trash2, Tag, MessageSquare, ExternalLink, ShoppingCart, BookOpen, Calendar, CheckCircle } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useApp } from '../../src/context/AppContext';
import { getAmazonUrl } from '../../src/utils/isbn';

export default function BookDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { saveBook, removeBook, getSavedBook, isSaved: checkIsSaved, updateBook } = useBooks();
  const { theme, isDark, t } = useApp();

  const [book, setBook] = useState<Book | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [comment, setComment] = useState('');

  // New fields state
  const [status, setStatus] = useState<Book['status']>('want_to_read');
  const [currentPage, setCurrentPage] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const amazonUrl = book?.isbn ? getAmazonUrl(book.isbn) : null;

  useEffect(() => {
    if (params.bookData) {
      const parsedBook = JSON.parse(params.bookData as string);
      const savedVersion = getSavedBook(parsedBook.id);

      if (savedVersion) {
        setBook(savedVersion);
        setTagsInput(savedVersion.tags?.join(', ') || '');
        setComment(savedVersion.comment || '');
        setStatus(savedVersion.status || 'want_to_read');
        setCurrentPage(savedVersion.currentPage?.toString() || '');
        setTotalPages(savedVersion.totalPages?.toString() || '');
        setStartDate(savedVersion.startDate || '');
        setFinishDate(savedVersion.finishDate || '');
        setIsEditing(true);
      } else {
        setBook(parsedBook);
        setTagsInput('');
        setComment('');
        setStatus('want_to_read');
        setCurrentPage('');
        setTotalPages('');
        setStartDate('');
        setFinishDate('');
        setIsEditing(false);
      }
    }
  }, [params.bookData, getSavedBook]);

  const handleSave = async () => {
    if (!book) return;

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);

    // Auto-update status based on progress if currently want_to_read
    let newStatus = status;
    if (status === 'want_to_read' && currentPage && parseInt(currentPage) > 0) {
      newStatus = 'reading';
      setStatus('reading');
    }
    if (status === 'reading' && currentPage && totalPages && currentPage === totalPages) {
       newStatus = 'completed';
       setStatus('completed');
       if (!finishDate) {
         const today = new Date().toISOString().split('T')[0];
         setFinishDate(today);
       }
    }

    const updatedBook: Book = {
      ...book,
      tags,
      comment,
      status: newStatus,
      currentPage: currentPage ? parseInt(currentPage) : undefined,
      totalPages: totalPages ? parseInt(totalPages) : undefined,
      startDate: startDate || undefined,
      finishDate: finishDate || undefined
    };

    if (checkIsSaved(book.id)) {
      await updateBook(updatedBook);
      Alert.alert(t('updated'), t('updatedMessage'));
    } else {
      await saveBook(updatedBook);
      Alert.alert(t('saved'), t('savedMessage'));
      setIsEditing(true);
    }
    setBook(updatedBook);
  };

  const handleDelete = async () => {
    if (!book) return;

    Alert.alert(
      t('deleteBook'),
      t('deleteConfirm'),
      [
        { text: t('cancel'), style: "cancel" },
        {
          text: t('delete'),
          style: "destructive",
          onPress: async () => {
            await removeBook(book.id);
            router.back();
          }
        }
      ]
    );
  };

  const setToday = (setter: (date: string) => void) => {
    const today = new Date().toISOString().split('T')[0];
    setter(today);
  };

  if (!book) return <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} />;

  const isSaved = checkIsSaved(book.id);

  const statusOptions: { value: Book['status'], label: string, color: string }[] = [
    { value: 'want_to_read', label: t('wantToRead') || 'Want to Read', color: theme.textMuted },
    { value: 'reading', label: t('reading') || 'Reading', color: theme.primary },
    { value: 'completed', label: t('completed') || 'Completed', color: '#22c55e' },
    { value: 'dropped', label: t('dropped') || 'Dropped', color: theme.danger },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{t('bookDetails')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.bookHeader}>
            <View style={[styles.thumbnailContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              {book.thumbnail ? (
                <Image source={{ uri: book.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
              ) : (
                <View style={styles.noImage}>
                  <Text style={[styles.noImageText, { color: theme.textMuted }]}>No Image</Text>
                </View>
              )}
            </View>
            <View style={styles.bookInfo}>
              <Text style={[styles.bookTitle, { color: theme.text }]}>{book.title}</Text>
              <Text style={[styles.bookAuthor, { color: theme.textSecondary }]}>{book.authors.join(', ')}</Text>
              {book.publishedDate && (
                <Text style={[styles.bookMeta, { color: theme.textMuted }]}>{t('published')}: {book.publishedDate}</Text>
              )}
              {book.isbn && (
                <Text style={[styles.bookMeta, { color: theme.textMuted }]}>ISBN: {book.isbn}</Text>
              )}

              <View style={styles.linkRow}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(book.link)}
                  style={[styles.linkButton, { backgroundColor: theme.inputBg }]}
                >
                  <ExternalLink size={14} color="#3b82f6" />
                  <Text style={styles.googleLinkText}>Google</Text>
                </TouchableOpacity>

                {amazonUrl && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(amazonUrl)}
                    style={[styles.linkButton, { backgroundColor: '#ff9900' }]}
                  >
                    <ShoppingCart size={14} color="white" />
                    <Text style={styles.amazonLinkText}>Amazon</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>

            {/* Status Section */}
            <View style={styles.formSection}>
              <View style={styles.formLabel}>
                <CheckCircle size={16} color={theme.primary} />
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('status') || 'Status'}</Text>
              </View>
              <View style={styles.statusContainer}>
                {statusOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setStatus(opt.value)}
                    style={[
                      styles.statusButton,
                      { borderColor: theme.inputBorder, backgroundColor: theme.inputBg },
                      status === opt.value && { backgroundColor: opt.color, borderColor: opt.color }
                    ]}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      { color: theme.text },
                      status === opt.value && { color: '#fff', fontWeight: 'bold' }
                    ]}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Progress Section */}
             <View style={styles.formSection}>
              <View style={styles.formLabel}>
                <BookOpen size={16} color={theme.primary} />
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('progress') || 'Progress'}</Text>
              </View>
              <View style={styles.rowInputs}>
                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('current') || 'Current'}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    value={currentPage}
                    onChangeText={setCurrentPage}
                    keyboardType="number-pad"
                  />
                </View>
                <Text style={[styles.slash, { color: theme.textMuted }]}>/</Text>
                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('total') || 'Total'}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    value={totalPages}
                    onChangeText={setTotalPages}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>

            {/* Dates Section */}
            <View style={styles.formSection}>
              <View style={styles.formLabel}>
                <Calendar size={16} color={theme.primary} />
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('dates') || 'Dates'}</Text>
              </View>
              <View style={styles.dateInputs}>
                <View style={styles.dateInputWrapper}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('started') || 'Started'}</Text>
                  <View style={styles.dateRow}>
                    <TextInput
                      style={[styles.input, styles.dateInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={theme.textMuted}
                      value={startDate}
                      onChangeText={setStartDate}
                    />
                    <TouchableOpacity onPress={() => setToday(setStartDate)} style={styles.todayButton}>
                      <Text style={[styles.todayButtonText, { color: theme.primary }]}>{t('today') || 'Today'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.dateInputWrapper}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('finished') || 'Finished'}</Text>
                   <View style={styles.dateRow}>
                    <TextInput
                      style={[styles.input, styles.dateInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={theme.textMuted}
                      value={finishDate}
                      onChangeText={setFinishDate}
                    />
                    <TouchableOpacity onPress={() => setToday(setFinishDate)} style={styles.todayButton}>
                      <Text style={[styles.todayButtonText, { color: theme.primary }]}>{t('today') || 'Today'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.formLabel}>
                <Tag size={16} color={theme.primary} />
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('tags')}</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder={t('tagsPlaceholder')}
                placeholderTextColor={theme.textMuted}
                value={tagsInput}
                onChangeText={setTagsInput}
              />
            </View>

            <View style={styles.formSection}>
              <View style={styles.formLabel}>
                <MessageSquare size={16} color={theme.primary} />
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('myThoughts')}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder={t('thoughtsPlaceholder')}
                placeholderTextColor={theme.textMuted}
                value={comment}
                onChangeText={setComment}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: theme.primary }]}>
              <Save color="white" size={20} />
              <Text style={styles.saveButtonText}>{isSaved ? t('updateLibrary') : t('saveToLibrary')}</Text>
            </TouchableOpacity>

            {isSaved && (
              <TouchableOpacity onPress={handleDelete} style={[styles.deleteButton, { backgroundColor: theme.card, borderColor: theme.dangerLight }]}>
                <Trash2 color={theme.danger} size={20} />
                <Text style={[styles.deleteButtonText, { color: theme.danger }]}>{t('removeFromLibrary')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bookHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  thumbnailContainer: {
    width: 120,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {},
  bookInfo: {
    flex: 1,
    gap: 6,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  bookAuthor: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookMeta: {
    fontSize: 12,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  googleLinkText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  amazonLinkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 20,
  },
  formSection: {
    gap: 8,
  },
  formLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formLabelText: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusButtonText: {
    fontSize: 13,
  },
  rowInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
  },
  slash: {
    fontSize: 20,
    marginTop: 18,
  },
  dateInputs: {
    gap: 12,
  },
  dateInputWrapper: {
    gap: 4,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInput: {
    flex: 1,
  },
  todayButton: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  todayButtonText: {
    fontWeight: '600',
    fontSize: 13,
  },
  actions: {
    gap: 12,
    marginBottom: 40,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
