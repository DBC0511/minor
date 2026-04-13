import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, radii } from "../constants/theme";

function weatherEmoji(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return "☔";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("clear") || c.includes("sun")) return "☀️";
  return "🌤️";
}

function riskColor(risk) {
  if (!risk) return colors.sage;
  const r = String(risk).toUpperCase();
  if (r === "HIGH") return colors.rust;
  if (r === "MEDIUM") return colors.amber;
  return colors.sage;
}

/** Normalize Flask `/weather` JSON and any legacy field names. */
function normalize(raw) {
  if (!raw || typeof raw !== "object") return null;
  return {
    temperature_c: raw.temperature_c ?? raw.temperature,
    humidity: raw.humidity,
    condition: raw.condition,
    wind_speed_ms: raw.wind_speed_ms ?? raw.wind_speed,
    disease_risk: raw.disease_risk ?? raw.risk_level,
    farming_advice: raw.farming_advice ?? raw.advice,
    is_mock: raw.is_mock ?? false,
  };
}

export default function WeatherCard({ weather, loading, error, onRetry, t }) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={colors.sage} />
        <Text style={styles.muted}>{t("fetching_weather")}</Text>
      </View>
    );
  }

  const w = normalize(weather);
  if (error || !w) {
    return (
      <View style={styles.card}>
        <Text style={styles.err}>{t("weather_error")}</Text>
        {onRetry ? (
          <Text style={styles.retry} onPress={onRetry}>
            {t("retry")}
          </Text>
        ) : null}
      </View>
    );
  }

  const emoji = weatherEmoji(w.condition);
  const rc = riskColor(w.disease_risk);
  const riskLabel =
    String(w.disease_risk || "").toUpperCase() === "HIGH"
      ? t("risk_high")
      : String(w.disease_risk || "").toUpperCase() === "MEDIUM"
        ? t("risk_medium")
        : t("risk_low");

  return (
    <LinearGradient colors={[colors.moss, colors.forest]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.grad}>
      <View style={styles.headerRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t("weather")}</Text>
          {w.is_mock ? <Text style={styles.mock}>{t("mock_weather")}</Text> : null}
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{t("temperature")}</Text>
          <Text style={styles.statVal}>
            {w.temperature_c}
            {t("celsius")}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{t("humidity")}</Text>
          <Text style={styles.statVal}>
            {w.humidity}
            {t("percent_unit")}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{t("wind_speed")}</Text>
          <Text style={styles.statVal}>{w.wind_speed_ms} m/s</Text>
        </View>
      </View>
      <Text style={styles.cond}>
        {t("condition")}: {w.condition}
      </Text>
      <View style={styles.riskRow}>
        <Text style={styles.riskText}>{t("risk_level")}: </Text>
        <Text style={[styles.riskBadge, { color: rc }]}>{riskLabel}</Text>
      </View>
      <Text style={styles.advice}>{w.farming_advice}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  grad: {
    borderRadius: radii.lg,
    padding: 18,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emoji: {
    fontSize: 36,
    marginRight: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.white,
  },
  mock: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
  },
  statVal: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.white,
    marginTop: 2,
  },
  cond: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.white,
    marginBottom: 8,
  },
  riskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  riskText: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.white,
  },
  riskBadge: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  advice: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 18,
  },
  muted: {
    marginTop: 8,
    fontFamily: fonts.sans,
    color: colors.muted,
    fontSize: 14,
  },
  err: {
    fontFamily: fonts.sansSemi,
    color: colors.ember,
    fontSize: 14,
    textAlign: "center",
  },
  retry: {
    marginTop: 10,
    fontFamily: fonts.sansSemi,
    color: colors.moss,
    fontSize: 14,
  },
});
