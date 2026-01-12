import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, StyleSheet, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Globe, Moon, Sun, Monitor, Check, Download, Upload } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File as ExpoFile, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

const STORAGE_KEY = '@bookmanager_books';

export default function SettingsScreen() {
  const { theme, isDark, t, language, setLanguage, themeMode, setThemeMode } = useApp();

  const handleExport = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        Alert.alert('Info', 'No data to export');
        return;
      }
      
      const fileName = `bookshelf_backup_${new Date().toISOString().split('T')[0]}.json`;
      const file = new ExpoFile(Paths.document, fileName);
      
      await file.write(data);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      } else {
        await Share.share({ message: data });
      }
      
      Alert.alert(t('exportSuccess'));
    } catch (e) {
      console.error('Export error:', e);
      Alert.alert('Error', 'Export failed');
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) return;
      
      const asset = result.assets[0];
      const file = new ExpoFile(asset.uri);
      const content = await file.text();
      
      // Validate JSON
      JSON.parse(content);
      
      Alert.alert(
        t('importData'),
        t('importConfirm'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: 'OK',
            onPress: async () => {
              await AsyncStorage.setItem(STORAGE_KEY, content);
              Alert.alert(t('importSuccess'));
            }
          }
        ]
      );
    } catch (e) {
      console.error('Import error:', e);
      Alert.alert('Error', 'Invalid file format');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.cardBorder }]}>
        <View style={styles.headerLeft}>
          <Settings color={theme.headerText} size={24} />
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>{t('settings')}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Language */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('language')}</Text>
          </View>
          
          <View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <TouchableOpacity
              onPress={() => setLanguage('ja')}
              style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}
            >
              <Text style={[styles.optionText, { color: theme.text }]}>日本語</Text>
              {language === 'ja' && <Check size={18} color={theme.success} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              style={[styles.optionRow, { borderBottomWidth: 0 }]}
            >
              <Text style={[styles.optionText, { color: theme.text }]}>English</Text>
              {language === 'en' && <Check size={18} color={theme.success} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Moon size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('theme')}</Text>
          </View>
          
          <View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <TouchableOpacity
              onPress={() => setThemeMode('light')}
              style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}
            >
              <View style={styles.optionLeft}>
                <Sun size={16} color={theme.textSecondary} />
                <Text style={[styles.optionText, { color: theme.text }]}>{t('lightMode')}</Text>
              </View>
              {themeMode === 'light' && <Check size={18} color={theme.success} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setThemeMode('dark')}
              style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}
            >
              <View style={styles.optionLeft}>
                <Moon size={16} color={theme.textSecondary} />
                <Text style={[styles.optionText, { color: theme.text }]}>{t('darkMode')}</Text>
              </View>
              {themeMode === 'dark' && <Check size={18} color={theme.success} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setThemeMode('system')}
              style={[styles.optionRow, { borderBottomWidth: 0 }]}
            >
              <View style={styles.optionLeft}>
                <Monitor size={16} color={theme.textSecondary} />
                <Text style={[styles.optionText, { color: theme.text }]}>{t('systemMode')}</Text>
              </View>
              {themeMode === 'system' && <Check size={18} color={theme.success} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Download size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('dataManagement')}</Text>
          </View>
          
          <View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <TouchableOpacity
              onPress={handleExport}
              style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}
            >
              <View style={styles.optionLeft}>
                <Upload size={16} color={theme.textSecondary} />
                <Text style={[styles.optionText, { color: theme.text }]}>{t('exportData')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleImport}
              style={[styles.optionRow, { borderBottomWidth: 0 }]}
            >
              <View style={styles.optionLeft}>
                <Download size={16} color={theme.textSecondary} />
                <Text style={[styles.optionText, { color: theme.text }]}>{t('importData')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.appName, { color: theme.text }]}>{t('appName')}</Text>
          <Text style={[styles.version, { color: theme.textMuted }]}>{t('version')} 1.0.0</Text>
        </View>
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
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionsCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  version: {
    fontSize: 13,
  },
});
