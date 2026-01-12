import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useBooks } from '../../src/hooks/useBooks';
import { Book, Quote, ReadingStatus, getProgressPercentage } from '../../src/types';
import { ArrowLeft, Save, Trash2, Tag, MessageSquare, ExternalLink, ShoppingCart, BookOpen, Calendar, Plus, Edit2, X, User, Clock } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useApp } from '../../src/context/AppContext';
import { getAmazonUrl } from '../../src/utils/isbn';
import { StarRating } from '../../src/components/StarRating';
import { ProgressBar } from '../../src/components/ProgressBar';
import { StatusSelector } from '../../src/components/StatusSelector';

export default function BookDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { saveBook, removeBook, getSavedBook, isSaved: checkIsSaved, updateBook } = useBooks();
  const { theme, isDark, t } = useApp();

  const [book, setBook] = useState<Book | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Phase 1: Reading Status & Progress
  const [status, setStatus] = useState<ReadingStatus | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  
  // Phase 2: Rating & Review
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [quoteText, setQuoteText] = useState('');
  const [quotePage, setQuotePage] = useState('');
  const [quoteComment, setQuoteComment] = useState('');
  
  // Phase 4: Lending
  const [borrower, setBorrower] = useState('');
  const [lentDate, setLentDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const amazonUrl = book?.isbn ? getAmazonUrl(book.isbn) : null;

  useEffect(() => {
    if (params.bookData) {
      const parsedBook = JSON.parse(params.bookData as string);
      const savedVersion = getSavedBook(parsedBook.id);

      if (savedVersion) {
        setBook(savedVersion);
        setTagsInput(savedVersion.tags?.join(', ') || '');
        setComment(savedVersion.comment || '');
        setStatus(savedVersion.status);
        setCurrentPage(savedVersion.currentPage?.toString() || '');
        setTotalPages(savedVersion.totalPages?.toString() || '');
        setStartDate(savedVersion.startDate || '');
        setFinishDate(savedVersion.finishDate || '');
        setRating(savedVersion.rating || 0);
        setReview(savedVersion.review || '');
        setQuotes(savedVersion.quotes || []);
        setBorrower(savedVersion.lendingStatus?.borrower || '');
        setLentDate(savedVersion.lendingStatus?.lentDate || '');
        setDueDate(savedVersion.lendingStatus?.dueDate || '');
        setIsEditing(true);
      } else {
        setBook(parsedBook);
        resetForm();
        setIsEditing(false);
      }
    }
  }, [params.bookData, getSavedBook]);
  
  const resetForm = () => {
    setTagsInput('');
    setComment('');
    setStatus(undefined);
    setCurrentPage('');
    setTotalPages('');
    setStartDate('');
    setFinishDate('');
    setRating(0);
    setReview('');
    setQuotes([]);
    setBorrower('');
    setLentDate('');
    setDueDate('');
  };

  const handleSave = async () => {
    if (!book) return;

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const updatedBook: Book = {
      ...book,
      tags,
      comment,
      status,
      currentPage: currentPage ? parseInt(currentPage) : undefined,
      totalPages: totalPages ? parseInt(totalPages) : undefined,
      startDate: startDate || undefined,
      finishDate: finishDate || undefined,
      rating: rating || undefined,
      review: review || undefined,
      quotes: quotes.length > 0 ? quotes : undefined,
      lendingStatus: borrower ? {
        borrower,
        lentDate: lentDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || undefined,
      } : undefined,
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
  
  const handleStatusChange = (newStatus: ReadingStatus | undefined) => {
    setStatus(newStatus);
    // Auto-set start date when starting to read
    if (newStatus === 'reading' && !startDate) {
      setStartDate(new Date().toISOString().split('T')[0]);
    }
    // Auto-set finish date when completed
    if (newStatus === 'completed' && !finishDate) {
      setFinishDate(new Date().toISOString().split('T')[0]);
    }
  };
  
  const handleAddQuote = () => {
    setEditingQuote(null);
    setQuoteText('');
    setQuotePage('');
    setQuoteComment('');
    setShowQuoteModal(true);
  };
  
  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteText(quote.text);
    setQuotePage(quote.page?.toString() || '');
    setQuoteComment(quote.comment || '');
    setShowQuoteModal(true);
  };
  
  const handleSaveQuote = () => {
    if (!quoteText.trim()) return;
    
    if (editingQuote) {
      setQuotes(quotes.map(q => 
        q.id === editingQuote.id 
          ? { ...q, text: quoteText, page: quotePage ? parseInt(quotePage) : undefined, comment: quoteComment || undefined }
          : q
      ));
    } else {
      const newQuote: Quote = {
        id: Date.now().toString(),
        text: quoteText,
        page: quotePage ? parseInt(quotePage) : undefined,
        comment: quoteComment || undefined,
        createdAt: new Date().toISOString(),
      };
      setQuotes([...quotes, newQuote]);
    }
    setShowQuoteModal(false);
  };
  
  const handleDeleteQuote = (id: string) => {
    Alert.alert(
      t('deleteQuote'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => setQuotes(quotes.filter(q => q.id !== id)) }
      ]
    );
  };
  
  const clearLending = () => {
    setBorrower('');
    setLentDate('');
    setDueDate('');
  };

  if (!book) return <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} />;

  const isSaved = checkIsSaved(book.id);
  const progress = getProgressPercentage({ ...book, currentPage: parseInt(currentPage) || 0, totalPages: parseInt(totalPages) || 0 });

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
          {/* Book Header */}
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

          {/* Reading Status */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.formSection}>
              <View style={styles.formLabel}>
                <BookOpen size={16} color={theme.primary} />
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('readingStatus')}</Text>
              </View>
              <StatusSelector status={status} onStatusChange={handleStatusChange} />
            </View>
            
            {/* Progress */}
            {(status === 'reading' || status === 'completed') && (
              <View style={styles.formSection}>
                <View style={styles.formLabel}>
                  <Text style={[styles.formLabelText, { color: theme.text }]}>{t('progress')}</Text>
                </View>
                <View style={styles.progressInputRow}>
                  <TextInput
                    style={[styles.pageInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                    placeholder={t('currentPage')}
                    placeholderTextColor={theme.textMuted}
                    value={currentPage}
                    onChangeText={setCurrentPage}
                    keyboardType="numeric"
                  />
                  <Text style={[styles.ofText, { color: theme.textSecondary }]}>{t('of')}</Text>
                  <TextInput
                    style={[styles.pageInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                    placeholder={t('totalPages')}
                    placeholderTextColor={theme.textMuted}
                    value={totalPages}
                    onChangeText={setTotalPages}
                    keyboardType="numeric"
                  />
                  <Text style={[styles.pagesText, { color: theme.textMuted }]}>{t('pages')}</Text>
                </View>
                {parseInt(totalPages) > 0 && (
                  <ProgressBar progress={progress} />
                )}
              </View>
            )}
            
            {/* Dates */}
            {status && status !== 'want_to_read' && (
              <View style={styles.dateRow}>
                <View style={styles.dateInput}>
                  <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>{t('startDate')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={theme.textMuted}
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
                {status === 'completed' && (
                  <View style={styles.dateInput}>
                    <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>{t('finishDate')}</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={theme.textMuted}
                      value={finishDate}
                      onChangeText={setFinishDate}
                    />
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Rating & Review */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.formSection}>
              <View style={styles.formLabel}>
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('rating')}</Text>
              </View>
              <StarRating rating={rating} onRatingChange={setRating} size={28} />
            </View>
            
            <View style={styles.formSection}>
              <View style={styles.formLabel}>
                <MessageSquare size={16} color={theme.primary} />
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('review')}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder={t('reviewPlaceholder')}
                placeholderTextColor={theme.textMuted}
                value={review}
                onChangeText={setReview}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
          
          {/* Quotes */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.formLabelText, { color: theme.text }]}>{t('quotes')}</Text>
              <TouchableOpacity onPress={handleAddQuote} style={[styles.addButton, { backgroundColor: theme.primary }]}>
                <Plus size={16} color="#fff" />
                <Text style={styles.addButtonText}>{t('addQuote')}</Text>
              </TouchableOpacity>
            </View>
            
            {quotes.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>{t('noQuotes')}</Text>
            ) : (
              quotes.map((quote) => (
                <View key={quote.id} style={[styles.quoteCard, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                  <Text style={[styles.quoteText, { color: theme.text }]}>"{quote.text}"</Text>
                  {quote.page && (
                    <Text style={[styles.quoteMeta, { color: theme.textMuted }]}>p.{quote.page}</Text>
                  )}
                  {quote.comment && (
                    <Text style={[styles.quoteComment, { color: theme.textSecondary }]}>{quote.comment}</Text>
                  )}
                  <View style={styles.quoteActions}>
                    <TouchableOpacity onPress={() => handleEditQuote(quote)} style={styles.quoteActionButton}>
                      <Edit2 size={14} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteQuote(quote.id)} style={styles.quoteActionButton}>
                      <Trash2 size={14} color={theme.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Tags & Notes */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
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
          
          {/* Lending Section */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.formLabel}>
                <User size={16} color={theme.primary} />
                <Text style={[styles.formLabelText, { color: theme.text }]}>{t('lending')}</Text>
              </View>
              {borrower && (
                <TouchableOpacity onPress={clearLending} style={[styles.clearButton, { borderColor: theme.danger }]}>
                  <X size={14} color={theme.danger} />
                  <Text style={[styles.clearButtonText, { color: theme.danger }]}>{t('markAsReturned')}</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.formSection}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                placeholder={t('borrower')}
                placeholderTextColor={theme.textMuted}
                value={borrower}
                onChangeText={setBorrower}
              />
            </View>
            
            {borrower && (
              <View style={styles.dateRow}>
                <View style={styles.dateInput}>
                  <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>{t('lentDate')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={theme.textMuted}
                    value={lentDate}
                    onChangeText={setLentDate}
                  />
                </View>
                <View style={styles.dateInput}>
                  <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>{t('dueDate')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={theme.textMuted}
                    value={dueDate}
                    onChangeText={setDueDate}
                  />
                </View>
              </View>
            )}
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
      
      {/* Quote Modal */}
      <Modal visible={showQuoteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {editingQuote ? t('editQuote') : t('addQuote')}
              </Text>
              <TouchableOpacity onPress={() => setShowQuoteModal(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder={t('quoteText')}
              placeholderTextColor={theme.textMuted}
              value={quoteText}
              onChangeText={setQuoteText}
              multiline
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder={t('quotePage')}
              placeholderTextColor={theme.textMuted}
              value={quotePage}
              onChangeText={setQuotePage}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder={t('quoteComment')}
              placeholderTextColor={theme.textMuted}
              value={quoteComment}
              onChangeText={setQuoteComment}
            />
            
            <TouchableOpacity onPress={handleSaveQuote} style={[styles.saveButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
    gap: 16,
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
  progressInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  ofText: {
    fontSize: 14,
  },
  pagesText: {
    fontSize: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    gap: 4,
  },
  dateLabel: {
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
  quoteCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  quoteMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  quoteComment: {
    fontSize: 13,
    marginTop: 8,
  },
  quoteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  quoteActionButton: {
    padding: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
