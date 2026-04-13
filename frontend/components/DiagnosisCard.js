import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";

/**
 * Shows primary diagnosis: disease, confidence, severity, urgency.
 */
export default function DiagnosisCard({ disease, confidence, severity, urgency, labels }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{labels.diagnosis}</Text>
      <View style={styles.grid}>
        <View style={styles.cell}>
          <Text style={styles.k}>{labels.disease}</Text>
          <Text style={styles.v}>{disease}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.k}>{labels.confidence}</Text>
          <Text style={styles.v}>{confidence}%</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.k}>{labels.severity}</Text>
          <Text style={styles.v}>{severity}</Text>
        </View>
        <View style={[styles.cell, styles.full]}>
          <Text style={styles.k}>{labels.urgency}</Text>
          <Text style={styles.vSmall}>{urgency}</Text>
        </View>
      </View>
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
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  cell: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  full: {
    width: "100%",
  },
  k: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    color: colors.muted,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  v: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.ink,
  },
  vSmall: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
});
