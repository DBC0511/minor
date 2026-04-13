import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { predictDisease, saveHistory } from "../utils/api";
import ConfidenceDonut from "../components/ConfidenceDonut";
import TopPredictionsChart from "../components/TopPredictionsChart";
import DiagnosisCard from "../components/DiagnosisCard";
import StorageTipsCard from "../components/StorageTipsCard";
import { colors, fonts, radii } from "../constants/theme";

export default function ResultScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    analyzeImage();
  }, []);

  const analyzeImage = async () => {
    try {
      const response = await predictDisease(imageUri);
      setResult(response);

      if (response.valid && !response.rejected && user?.phone) {
        try {
          await saveHistory({
            phone: user.phone,
            disease_name: response.disease_name,
            confidence: response.confidence,
            severity: response.severity,
          });
        } catch {
          /* history optional */
        }
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.message || t("network_error");
      Alert.alert(t("error"), String(msg));
    } finally {
      setLoading(false);
    }
  };

  const speakResult = () => {
    if (!result || result.rejected) return;
    const diseaseName = result.disease_display || result.disease_name || "Unknown disease";
    const text = `${diseaseName}. ${t("confidence")} ${result.confidence} ${t("percent_unit")}. ${result.storage_tips || ""}. ${result.treatment_solution || ""}`;
    Speech.speak(text, { language: "en" });
  };

  const labels = {
    diagnosis: t("diagnosis"),
    disease: t("disease"),
    confidence: t("confidence"),
    severity: t("severity"),
    urgency: t("urgency"),
    storage_and_treatment: t("storage_and_treatment"),
    storage_tips: t("storage_tips"),
    solution: t("solution"),
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.sage} />
        <Text style={styles.loadingText}>{t("analyzing")}</Text>
      </View>
    );
  }

  if (result?.rejected || !result?.valid) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>{t("error")}</Text>
        <Text style={styles.errorMessage}>
          {result?.message || t("low_confidence")}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>{t("retake")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const shelfColor =
    result.shelf_status === "CRITICAL"
      ? colors.rust
      : result.shelf_status === "WARNING"
        ? colors.amber
        : result.shelf_status === "EXCELLENT"
          ? colors.sage
          : colors.moss;

  const chartItems = (result.top_predictions || []).map((p) => ({
    label: String(p.name || "").replace(/_/g, " "),
    value: Number(p.confidence) || 0,
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("results")}</Text>
        <TouchableOpacity onPress={speakResult} style={styles.speakButton}>
          <Text style={styles.speakText}>🔊</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
        <View style={[styles.badge, { backgroundColor: shelfColor }]}>
          <Text style={styles.badgeText}>{result.shelf_status || "GOOD"}</Text>
        </View>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.leftColumn}>
          <ConfidenceDonut percent={Number(result.confidence) || 0} confidenceLabel={t("confidence")} />
          <TopPredictionsChart items={chartItems} title={t("top_predictions")} />
        </View>
        <View style={styles.rightColumn}>
          <DiagnosisCard
            disease={result.disease_display || result.disease_name}
            confidence={result.confidence}
            severity={result.severity}
            urgency={result.urgency}
            labels={labels}
          />
          <StorageTipsCard
            storageTips={result.storage_tips}
            treatment={result.treatment_solution}
            labels={labels}
          />
        </View>
      </View>

      <View style={styles.shelfCard}>
        <Text style={styles.shelfLabel}>📦 {t("shelf_life")}</Text>
        <Text style={[styles.shelfDays, { color: shelfColor }]}>
          {result.adjusted_shelf_life || result.base_shelf_life || 5} {t("days")}
        </Text>
        <Text style={styles.shelfNote}>
          {t("base_shelf_life")}: {result.base_shelf_life || 5} {t("days")} · {t("confidence")}:{" "}
          {result.confidence || 0}
          {t("percent_unit")}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.paper,
  },
  loadingText: {
    marginTop: 20,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.muted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.paper,
  },
  errorIcon: { fontSize: 80, marginBottom: 20 },
  errorTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ember,
    marginBottom: 10,
  },
  errorMessage: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.body,
    textAlign: "center",
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: colors.forest,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: radii.pill,
  },
  retryButtonText: {
    fontFamily: fonts.sansSemi,
    color: colors.white,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.forest,
  },
  backButton: { width: 40 },
  backText: {
    fontSize: 28,
    color: colors.white,
    fontFamily: fonts.sansSemi,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.white,
  },
  speakButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
  },
  speakText: { fontSize: 14 },
  imageContainer: { margin: 20, position: "relative" },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: radii.lg,
    backgroundColor: colors.cream,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  badgeText: {
    color: colors.white,
    fontFamily: fonts.sansSemi,
    fontSize: 12,
  },
  dashboard: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    flexWrap: "wrap",
  },
  leftColumn: { flex: 1, minWidth: 150, gap: 10 },
  rightColumn: { flex: 1, minWidth: 150, gap: 10 },
  shelfCard: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: radii.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  shelfLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    marginBottom: 5,
  },
  shelfDays: {
    fontFamily: fonts.displayBlack,
    fontSize: 40,
  },
  shelfNote: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mutedLight,
    marginTop: 5,
    textAlign: "center",
  },
});
