import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { fetchWeather } from "../utils/api";
import WeatherCard from "../components/WeatherCard";
import LanguageSelector from "../components/LanguageSelector";
import { colors, fonts, radii } from "../constants/theme";

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
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

  async function doLogout() {
    await logout();
  }

  function confirmLogout() {
    const title = t("logout_confirm_title");
    const message = t("logout_confirm_message");
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const ok = window.confirm(`${title}\n\n${message}`);
      if (ok) void doLogout();
      return;
    }
    Alert.alert(title, message, [
      { text: t("no"), style: "cancel" },
      { text: t("yes"), style: "destructive", onPress: () => void doLogout() },
    ]);
  }

  const initial = (user?.name || "G").trim().charAt(0).toUpperCase();
  const { width: W } = Dimensions.get("window");

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.forest, colors.moss]} style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <View style={styles.heroNav}>
          <View style={styles.brandMini}>
            <View style={styles.brandDotSm} />
            <Text style={styles.brandMiniText}>{t("app_name")}</Text>
          </View>
          <View style={styles.heroNavRight}>
            <LanguageSelector variant="dark" />
            <TouchableOpacity onPress={confirmLogout} style={styles.logoutPill}>
              <Text style={styles.logoutPillText}>{t("logout")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.userLine} numberOfLines={1}>
            {user?.name ? t("home_greeting", { name: user.name }) : t("welcome_back")}
          </Text>
        </View>

        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>{t("hero_badge")}</Text>
        </View>

        <Text style={[styles.heroTitle, { fontSize: Math.min(40, W * 0.1), lineHeight: Math.min(44, W * 0.11) }]}>
          {t("hero_protect")}
          {"\n"}
          <Text style={styles.heroTomato}>{t("hero_tomato")}</Text> {t("hero_crops")}
        </Text>
        <Text style={styles.heroDesc}>{t("hero_desc")}</Text>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.btnWhite}
            onPress={() => navigation.navigate("Camera", { mode: "gallery" })}
            activeOpacity={0.9}
          >
            <Text style={styles.btnWhiteText}>🔬 {t("scan_leaf_cta")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.navigate("Diseases")}
            activeOpacity={0.9}
          >
            <Text style={styles.btnOutlineText}>{t("view_diseases")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statNum}>11</Text>
            <Text style={styles.statLabel}>{t("stat_diseases")}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statNum}>&lt;2s</Text>
            <Text style={styles.statLabel}>{t("stat_time")}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statNum}>AI</Text>
            <Text style={styles.statLabel}>{t("stat_model")}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLabel}>{t("stat_langs")}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionCream}>
        <WeatherCard weather={weather} loading={wLoading} error={wError} onRetry={loadWeather} t={t} />
        {!wLoading && wError ? <Text style={styles.hint}>{t("location_permission")}</Text> : null}
      </View>

      <View style={styles.sectionPaper}>
        <Text style={styles.kicker}>{t("nav_explore")}</Text>
        <Text style={styles.secTitle}>{t("home_scan_title")}</Text>
        <Text style={styles.secBody}>{t("home_scan_body")}</Text>

        <TouchableOpacity
          style={styles.scanCta}
          onPress={() => navigation.navigate("Camera", { mode: "gallery" })}
          activeOpacity={0.9}
        >
          <Text style={styles.scanCtaText}>{t("nav_scan_now")}</Text>
        </TouchableOpacity>

        <View style={styles.tileGrid}>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("Camera", { mode: "gallery" })} activeOpacity={0.9}>
            <Text style={styles.tileIcon}>📷</Text>
            <Text style={styles.tileLabel}>{t("take_photo")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("Camera", { mode: "gallery" })} activeOpacity={0.9}>
            <Text style={styles.tileIcon}>🖼️</Text>
            <Text style={styles.tileLabel}>{t("choose_gallery")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("Diseases")} activeOpacity={0.9}>
            <Text style={styles.tileIcon}>📋</Text>
            <Text style={styles.tileLabel}>{t("known_conditions")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("History")} activeOpacity={0.9}>
            <Text style={styles.tileIcon}>📜</Text>
            <Text style={styles.tileLabel}>{t("history")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tile, styles.tileWide]} onPress={() => navigation.navigate("Tips")} activeOpacity={0.9}>
            <Text style={styles.tileIcon}>🌱</Text>
            <Text style={styles.tileLabel}>{t("tips_title_short")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>{t("app_name")}</Text>
        <Text style={styles.footerNote}>AI · {t("auth_tagline").split(".")[0]}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  scrollContent: { paddingBottom: 28 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: "hidden",
  },
  heroNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  brandMini: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandDotSm: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sage },
  brandMiniText: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.white,
  },
  heroNavRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoutPill: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  logoutPillText: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
  },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: fonts.sansSemi, fontSize: 15, color: colors.ink },
  userLine: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(82,183,136,0.35)",
    backgroundColor: "rgba(82,183,136,0.12)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    marginBottom: 16,
  },
  badgeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.mint },
  badgeText: {
    fontFamily: fonts.sansSemi,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.mint,
  },
  heroTitle: {
    fontFamily: fonts.displayBlack,
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  heroTomato: {
    fontFamily: fonts.displayItalic,
    color: colors.sage,
  },
  heroDesc: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 20,
    maxWidth: 400,
  },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 22 },
  btnWhite: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnWhiteText: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    color: colors.ink,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radii.md,
  },
  btnOutlineText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.1)",
    gap: 12,
  },
  statCell: { width: "22%", minWidth: 72 },
  statNum: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.white,
  },
  statLabel: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: "rgba(255,255,255,0.38)",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCream: {
    backgroundColor: colors.cream,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 8,
  },
  hint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  sectionPaper: {
    backgroundColor: colors.paper,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
  },
  kicker: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.moss,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  secTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    marginBottom: 8,
  },
  secBody: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.body,
    marginBottom: 16,
    maxWidth: 420,
  },
  scanCta: {
    backgroundColor: colors.ink,
    borderRadius: radii.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  scanCtaText: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.white,
  },
  tileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tileWide: { width: "100%" },
  tileIcon: { fontSize: 28, marginBottom: 8 },
  tileLabel: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.ink,
    textAlign: "center",
    paddingHorizontal: 6,
  },
  footer: {
    backgroundColor: colors.ink,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  footerBrand: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: "rgba(255,255,255,0.35)",
    marginBottom: 6,
  },
  footerNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: "rgba(255,255,255,0.25)",
    textAlign: "center",
  },
});
