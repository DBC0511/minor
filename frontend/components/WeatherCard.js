import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function weatherEmoji(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return "☔";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("clear") || c.includes("sun")) return "☀️";
  return "🌤️";
}

function riskColor(risk) {
  if (risk === "HIGH") return "#e74c3c";
  if (risk === "MEDIUM") return "#f39c12";
  return "#27ae60";
}

export default function WeatherCard({ weather, loading, error, onRetry, t }) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#2ecc71" />
        <Text style={styles.muted}>{t("fetching_weather")}</Text>
      </View>
    );
  }

  if (error || !weather) {
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

  const emoji = weatherEmoji(weather.condition);
  const rc = riskColor(weather.disease_risk);
  const riskLabel =
    weather.disease_risk === "HIGH"
      ? t("risk_high")
      : weather.disease_risk === "MEDIUM"
        ? t("risk_medium")
        : t("risk_low");

  return (
    <LinearGradient colors={["#2ecc71", "#27ae60"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.grad}>
      <View style={styles.headerRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t("weather")}</Text>
          {weather.is_mock ? <Text style={styles.mock}>{t("mock_weather")}</Text> : null}
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{t("temperature")}</Text>
          <Text style={styles.statVal}>
            {weather.temperature_c}
            {t("celsius")}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{t("humidity")}</Text>
          <Text style={styles.statVal}>
            {weather.humidity}
            {t("percent_unit")}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{t("wind_speed")}</Text>
          <Text style={styles.statVal}>{weather.wind_speed_ms} m/s</Text>
        </View>
      </View>
      <Text style={styles.cond}>
        {t("condition")}: {weather.condition}
      </Text>
      <View style={styles.riskRow}>
        <Text style={styles.riskText}>{t("risk_level")}: </Text>
        <Text style={[styles.riskBadge, { color: rc }]}>{riskLabel}</Text>
      </View>
      <Text style={styles.advice}>{weather.farming_advice}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 4,
  },
  grad: {
    borderRadius: 15,
    padding: 18,
    marginBottom: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  mock: {
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
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
  },
  statVal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginTop: 2,
  },
  cond: {
    fontSize: 13,
    color: "#fff",
    marginBottom: 8,
  },
  riskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  riskText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  riskBadge: {
    fontSize: 14,
    fontWeight: "900",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  advice: {
    fontSize: 13,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 18,
  },
  muted: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  err: {
    color: "#e74c3c",
    fontSize: 14,
    textAlign: "center",
  },
  retry: {
    marginTop: 10,
    color: "#3498db",
    fontWeight: "700",
  },
});
