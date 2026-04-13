import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../constants/theme";

const GREEN = colors.sage;
const BLUE = colors.moss;

/**
 * Horizontal bar chart using Views — no external chart library.
 * items: [{ label, value }] where value is 0–100
 */
export default function TopPredictionsChart({ items = [], title }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {items.map((row, idx) => {
        const w = Math.max(4, Math.min(100, row.value));
        const color = idx === 0 ? GREEN : BLUE;
        return (
          <View key={`${row.label}-${idx}`} style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {row.label}
            </Text>
            <View style={styles.track}>
              <View style={[styles.bar, { width: `${w}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.val}>{Math.round(row.value)}%</Text>
          </View>
        );
      })}
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
  title: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 12,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink,
    marginBottom: 4,
    maxWidth: "100%",
  },
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.cream,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 6,
  },
  val: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
    textAlign: "right",
  },
});
