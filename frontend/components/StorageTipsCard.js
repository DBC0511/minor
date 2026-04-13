import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";

export default function StorageTipsCard({ storageTips, treatment, labels }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{labels.storage_and_treatment}</Text>
      <Text style={styles.section}>{labels.storage_tips}</Text>
      <Text style={styles.body}>{storageTips}</Text>
      <Text style={[styles.section, { marginTop: 12 }]}>{labels.solution}</Text>
      <Text style={styles.body}>{treatment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardTitle: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 10,
  },
  section: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.moss,
    marginBottom: 6,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.inkMid,
    lineHeight: 20,
  },
});
