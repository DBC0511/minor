import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import ConfidenceDonut from '../components/ConfidenceDonut';
import TopPredictionsChart from '../components/TopPredictionsChart';
import DiagnosisCard from '../components/DiagnosisCard';
import StorageTipsCard from '../components/StorageTipsCard';

export default function ResultScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    analyzeImage();
  }, []);

  const analyzeImage = async () => {
    try {
      const response = await api.predict(imageUri);
      console.log('Prediction response:', response);
      setResult(response);
      
      if (response.valid && !response.rejected) {
        const phone = await AsyncStorage.getItem('userPhone');
        await api.saveHistory(phone, response.disease_name, response.confidence, response.severity, imageUri);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', error.error || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const speakResult = () => {
    if (!result || result.rejected) return;
    const diseaseName = result.disease_display || result.disease_name || 'Unknown disease';
    const text = `${diseaseName}. Confidence ${result.confidence} percent. ${result.storage_tips || ''}. ${result.treatment_solution || ''}`;
    Speech.speak(text, { language: 'en' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>{t('analyzing') || 'Analyzing...'}</Text>
      </View>
    );
  }

  if (result?.rejected || !result?.valid) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>Not a Tomato Leaf!</Text>
        <Text style={styles.errorMessage}>{result?.message || 'Please upload a clear tomato leaf image'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const diseaseDisplay = result.disease_display || result.disease_name || 'Unknown';
  const shelfColor = result.shelf_status === 'CRITICAL' ? '#e74c3c' : 
                     result.shelf_status === 'WARNING' ? '#f39c12' : 
                     result.shelf_status === 'EXCELLENT' ? '#2ecc71' : '#3498db';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('results') || 'Results'}</Text>
        <TouchableOpacity onPress={speakResult} style={styles.speakButton}>
          <Text style={styles.speakText}>{t('speak') || '🔊'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
        <View style={[styles.badge, { backgroundColor: shelfColor }]}>
          <Text style={styles.badgeText}>{result.shelf_status || 'GOOD'}</Text>
        </View>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.leftColumn}>
          <ConfidenceDonut confidence={(result.confidence || 0) / 100} />
          <TopPredictionsChart predictions={result.top_predictions || []} />
        </View>
        <View style={styles.rightColumn}>
          <DiagnosisCard result={result} />
          <StorageTipsCard result={result} />
        </View>
      </View>

      <View style={styles.shelfCard}>
        <Text style={styles.shelfLabel}>📦 {t('shelf_life') || 'Shelf Life'}</Text>
        <Text style={[styles.shelfDays, { color: shelfColor }]}>{result.adjusted_shelf_life || result.base_shelf_life || 5} days</Text>
        <Text style={styles.shelfNote}>Base: {result.base_shelf_life || 5} days | {t('confidence') || 'Confidence'}: {result.confidence || 0}%</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f0' },
  loadingText: { marginTop: 20, fontSize: 16, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorIcon: { fontSize: 80, marginBottom: 20 },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: '#e74c3c', marginBottom: 10 },
  errorMessage: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  retryButton: { backgroundColor: '#2ecc71', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  retryButtonText: { color: '#fff', fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: '#2ecc71' },
  backButton: { width: 40 },
  backText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  speakButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff', borderRadius: 20 },
  speakText: { fontSize: 12, fontWeight: 'bold', color: '#2ecc71' },
  imageContainer: { margin: 20, position: 'relative' },
  previewImage: { width: '100%', height: 220, borderRadius: 16, backgroundColor: '#ddd' },
  badge: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  dashboard: { flexDirection: 'row', paddingHorizontal: 20, gap: 12 },
  leftColumn: { flex: 1, gap: 12 },
  rightColumn: { flex: 1, gap: 12 },
  shelfCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  shelfLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  shelfDays: { fontSize: 40, fontWeight: 'bold' },
  shelfNote: { fontSize: 11, color: '#999', marginTop: 5 }
});