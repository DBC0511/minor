import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { fetchWeather } from "../utils/api";
import WeatherCard from "../components/WeatherCard";
import LanguageSelector from "../components/LanguageSelector";

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [weather, setWeather] = useState(null);
  const [wLoading, setWLoading] = useState(true);
  const [wError, setWError] = useState(false);

  const loadWeather = useCallback(async () => {
    setWLoading(true);
    setWError(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setWeather(null);
        setWError(true);
        setWLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const data = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
      setWeather(data);
    } catch {
      setWError(true);
      setWeather(null);
    } finally {
      setWLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWeather();
    }, [loadWeather])
  );

  function confirmLogout() {
    Alert.alert(t("logout_confirm_title"), t("logout_confirm_message"), [
      { text: t("no"), style: "cancel" },
      { text: t("yes"), style: "destructive", onPress: () => logout() },
    ]);
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#2ecc71", "#27ae60"]} style={styles.header}>
        <View style={styles.headerTop}>
          <LanguageSelector />
          <TouchableOpacity onPress={confirmLogout} style={styles.logoutChip}>
            <Text style={styles.logoutText}>{t("logout")}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.greet}>
          {user?.name ? t("home_greeting", { name: user.name }) : t("welcome_back")}
        </Text>
        <Text style={styles.tag}>{t("app_name")}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <WeatherCard
          weather={weather}
          loading={wLoading}
          error={wError}
          onRetry={loadWeather}
          t={t}
        />

        <Text style={styles.section}>{t("analyze")}</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.tile}
            onPress={() => navigation.navigate("Camera", { mode: "camera" })}
            activeOpacity={0.9}
          >
            <Text style={styles.tileIcon}>📷</Text>
            <Text style={styles.tileLabel}>{t("take_photo")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tile}
            onPress={() => navigation.navigate("Camera", { mode: "gallery" })}
            activeOpacity={0.9}
          >
            <Text style={styles.tileIcon}>🖼️</Text>
            <Text style={styles.tileLabel}>{t("choose_gallery")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tile, styles.tileWide]}
            onPress={() => navigation.navigate("History")}
            activeOpacity={0.9}
          >
            <Text style={styles.tileIcon}>📜</Text>
            <Text style={styles.tileLabel}>{t("history")}</Text>
          </TouchableOpacity>
        </View>

        {wLoading ? null : wError ? (
          <Text style={styles.hint}>{t("location_permission")}</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    paddingTop: 52,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logoutChip: {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  logoutText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  greet: { fontSize: 22, fontWeight: "800", color: "#fff" },
  tag: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  scroll: { padding: 18, paddingBottom: 40 },
  section: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    marginTop: 8,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tileWide: {
    width: "100%",
  },
  tileIcon: { fontSize: 32, marginBottom: 8 },
  tileLabel: { fontSize: 15, fontWeight: "700", color: "#333", textAlign: "center" },
  hint: { fontSize: 12, color: "#666", marginTop: 8, textAlign: "center" },
});
