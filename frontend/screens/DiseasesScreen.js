import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../context/LanguageContext";
import { KNOWN_CONDITIONS } from "../constants/knownConditions";
import { colors, fonts, radii } from "../constants/theme";

function sevStyle(key) {
  switch (key) {
    case "critical":
      return { backgroundColor: "#fee", borderColor: "#f5c6cb" };
    case "high":
      return { backgroundColor: "#fde8e8", borderColor: "#f5c6cb" };
    case "medium":
      return { backgroundColor: "#fef8e7", borderColor: "#f0e0a8" };
    case "low":
      return { backgroundColor: "#eaf7ef", borderColor: "#b8e0c8" };
    case "none":
    default:
      return { backgroundColor: "#e8f4fd", borderColor: "#b8d4ec" };
  }
}

export default function DiseasesScreen({ navigation }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.back}>← {t("back")}</Text>
        </TouchableOpacity>
        <Text style={styles.kicker}>{t("ref_guide")}</Text>
        <Text style={styles.title}>{t("known_conditions")}</Text>
        <Text style={styles.sub}>{t("diseases_blurb")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {KNOWN_CONDITIONS.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <View style={styles.cardHead}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={[styles.tag, sevStyle(item.sevKey)]}>
                  <Text style={styles.tagText}>{item.severity.toUpperCase()}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  back: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.moss,
    marginBottom: 12,
  },
  kicker: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.moss,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
    marginBottom: 8,
  },
  sub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.body,
  },
  list: {
    padding: 18,
    gap: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  emoji: { fontSize: 32 },
  cardHead: { flex: 1 },
  name: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 8,
  },
  tag: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: fonts.sansSemi,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.inkMid,
  },
  desc: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.body,
  },
});
