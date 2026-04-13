import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../context/LanguageContext";
import { colors, fonts, radii } from "../constants/theme";

export default function TipsScreen({ navigation }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={[colors.forest, "#163d28"]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backWrap} activeOpacity={0.85}>
          <Text style={styles.back}>← {t("back")}</Text>
        </TouchableOpacity>

        <Text style={styles.kicker}>{t("farming_advice")}</Text>
        <Text style={styles.title}>{t("tips_title")}</Text>
        <Text style={styles.sub}>{t("tips_sub")}</Text>

        {[1, 2, 3, 4, 5, 6].map((n) => (
          <View key={n} style={styles.tipCard}>
            <Text style={styles.tipNum}>{String(n).padStart(2, "0")}</Text>
            <Text style={styles.tipCardTitle}>{t(`tip_${n}_t`)}</Text>
            <Text style={styles.tipCardBody}>{t(`tip_${n}_b`)}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
  },
  backWrap: { marginBottom: 12 },
  back: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
  },
  kicker: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.mint,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.white,
    marginBottom: 8,
  },
  sub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.45)",
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 10,
  },
  tipNum: {
    fontFamily: fonts.displayBlack,
    fontSize: 22,
    color: "rgba(255,255,255,0.12)",
    marginBottom: 6,
  },
  tipCardTitle: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.white,
    marginBottom: 4,
  },
  tipCardBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(255,255,255,0.45)",
  },
});
