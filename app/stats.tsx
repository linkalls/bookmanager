import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooks } from '../src/hooks/useBooks';
import { useApp } from '../src/context/AppContext';
import { BarChart2, BookOpen, Check, Clock, XCircle, Star, TrendingUp, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { savedBooks } = useBooks();
  const { theme, isDark, t } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Status counts
    const statusCounts = {
      total: savedBooks.length,
      wantToRead: savedBooks.filter(b => b.status === 'want_to_read').length,
      reading: savedBooks.filter(b => b.status === 'reading').length,
      completed: savedBooks.filter(b => b.status === 'completed').length,
      dropped: savedBooks.filter(b => b.status === 'dropped').length,
      noStatus: savedBooks.filter(b => !b.status).length,
    };

    // Books completed this year
    const completedThisYear = savedBooks.filter(b => {
      if (b.status !== 'completed' || !b.finishDate) return false;
      const year = new Date(b.finishDate).getFullYear();
      return year === currentYear;
    }).length;

    // Books completed this month
    const completedThisMonth = savedBooks.filter(b => {
      if (b.status !== 'completed' || !b.finishDate) return false;
      const date = new Date(b.finishDate);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    }).length;

    // Average rating of completed books
    const ratedBooks = savedBooks.filter(b => b.rating && b.rating > 0);
    const avgRating = ratedBooks.length > 0
      ? ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length
      : 0;

    // Total pages read (for completed books with page info)
    const totalPagesRead = savedBooks
      .filter(b => b.status === 'completed' && b.totalPages)
      .reduce((sum, b) => sum + (b.totalPages || 0), 0);

    // Currently reading progress
    const readingBooks = savedBooks.filter(b => b.status === 'reading');
    const totalCurrentPages = readingBooks.reduce((sum, b) => sum + (b.currentPage || 0), 0);
    const totalRemainingPages = readingBooks.reduce((sum, b) => {
      const remaining = (b.totalPages || 0) - (b.currentPage || 0);
      return sum + Math.max(0, remaining);
    }, 0);

    // Monthly stats for bar chart (last 6 months)
    const monthlyData: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthName = date.toLocaleDateString('ja-JP', { month: 'short' });
      const count = savedBooks.filter(b => {
        if (b.status !== 'completed' || !b.finishDate) return false;
        const finishDate = new Date(b.finishDate);
        return finishDate.getFullYear() === date.getFullYear() && finishDate.getMonth() === date.getMonth();
      }).length;
      monthlyData.push({ month: monthName, count });
    }

    const maxMonthlyCount = Math.max(...monthlyData.map(d => d.count), 1);

    return {
      statusCounts,
      completedThisYear,
      completedThisMonth,
      avgRating,
      totalPagesRead,
      totalCurrentPages,
      totalRemainingPages,
      readingBooks,
      monthlyData,
      maxMonthlyCount,
    };
  }, [savedBooks]);

  const StatCard = ({ icon, title, value, subtitle, color }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
      {subtitle && <Text style={[styles.statSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.cardBorder }]}>
        <View style={styles.headerLeft}>
          <BarChart2 color={theme.headerText} size={24} />
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>{t('statistics')}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Status Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('readingStatus')}</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Clock size={20} color="#3b82f6" />}
              title={t('booksWantToRead')}
              value={stats.statusCounts.wantToRead}
              color="#3b82f6"
            />
            <StatCard
              icon={<BookOpen size={20} color="#f59e0b" />}
              title={t('booksReading')}
              value={stats.statusCounts.reading}
              color="#f59e0b"
            />
            <StatCard
              icon={<Check size={20} color="#22c55e" />}
              title={t('booksRead')}
              value={stats.statusCounts.completed}
              color="#22c55e"
            />
            <StatCard
              icon={<XCircle size={20} color="#ef4444" />}
              title={t('booksDropped')}
              value={stats.statusCounts.dropped}
              color="#ef4444"
            />
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('readingProgress')}</Text>
          <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <TrendingUp size={20} color={theme.primary} />
                <View>
                  <Text style={[styles.progressValue, { color: theme.text }]}>{stats.completedThisYear}</Text>
                  <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>{t('yearlyStats')}</Text>
                </View>
              </View>
              <View style={styles.progressItem}>
                <Calendar size={20} color={theme.primary} />
                <View>
                  <Text style={[styles.progressValue, { color: theme.text }]}>{stats.completedThisMonth}</Text>
                  <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>{t('monthlyStats')}</Text>
                </View>
              </View>
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Star size={20} color="#f59e0b" />
                <View>
                  <Text style={[styles.progressValue, { color: theme.text }]}>
                    {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
                  </Text>
                  <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>{t('averageRating')}</Text>
                </View>
              </View>
              <View style={styles.progressItem}>
                <BookOpen size={20} color={theme.success} />
                <View>
                  <Text style={[styles.progressValue, { color: theme.text }]}>
                    {stats.totalPagesRead.toLocaleString()}
                  </Text>
                  <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>{t('pages')}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Chart */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('monthlyStats')}</Text>
          <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.barChart}>
              {stats.monthlyData.map((data, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: data.count > 0 ? (data.count / stats.maxMonthlyCount) * 100 : 4,
                          backgroundColor: data.count > 0 ? theme.primary : theme.inputBorder,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.barLabel, { color: theme.textSecondary }]}>{data.month}</Text>
                  <Text style={[styles.barValue, { color: theme.text }]}>{data.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Currently Reading */}
        {stats.readingBooks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('booksReading')}</Text>
            <View style={[styles.readingCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              {stats.readingBooks.map((book) => {
                const progress = book.totalPages 
                  ? Math.round((book.currentPage || 0) / book.totalPages * 100) 
                  : 0;
                return (
                  <View key={book.id} style={[styles.readingItem, { borderBottomColor: theme.cardBorder }]}>
                    <View style={styles.readingInfo}>
                      <Text style={[styles.readingTitle, { color: theme.text }]} numberOfLines={1}>
                        {book.title}
                      </Text>
                      <Text style={[styles.readingProgress, { color: theme.textSecondary }]}>
                        {book.currentPage || 0} / {book.totalPages || '?'} {t('pages')}
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressTrack, { backgroundColor: theme.inputBg }]}>
                        <View 
                          style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.primary }]} 
                        />
                      </View>
                      <Text style={[styles.progressPercent, { color: theme.textMuted }]}>{progress}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 8,
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  readingCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  readingItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  readingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  readingProgress: {
    fontSize: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 11,
    minWidth: 32,
    textAlign: 'right',
  },
});
