import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/api";

export default function LoginScreen({ navigation }) {
  const { t } = useLanguage();
  const { setUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onLogin() {
    if (!phone.trim() || !password) {
      Alert.alert(t("error"), t("login_fill"));
      return;
    }
    setBusy(true);
    try {
      const data = await loginUser({ phone: phone.trim(), password });
      await setUser({ name: data.name, phone: data.phone });
    } catch (e) {
      const msg = e.response?.data?.error || t("network_error");
      Alert.alert(t("error"), msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <LinearGradient colors={["#2ecc71", "#27ae60", "#1e8449"]} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.logo}>{t("login_emoji_user")}</Text>
          <Text style={styles.title}>{t("app_name")}</Text>
          <Text style={styles.sub}>{t("login_subtitle")}</Text>
          <Text style={styles.welcome}>{t("welcome_back")}</Text>

          <View style={styles.field}>
            <Text style={styles.icon}>{t("login_emoji_phone")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("phone_placeholder")}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.icon}>{t("login_emoji_lock")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("password_placeholder")}
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, busy && { opacity: 0.7 }]}
            onPress={onLogin}
            disabled={busy}
            activeOpacity={0.9}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>{t("login")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.link}>{t("no_account")} </Text>
            <Text style={styles.linkBold}>{t("signup")}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },
  sub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    marginBottom: 28,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  primaryBtn: {
    backgroundColor: "#1e8449",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  link: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
  },
  linkBold: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
