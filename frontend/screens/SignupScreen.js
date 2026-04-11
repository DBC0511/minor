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
import { signupUser } from "../utils/api";

export default function SignupScreen({ navigation }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSignup() {
    if (!name.trim() || !phone.trim() || password.length < 6) {
      Alert.alert(t("error"), t("fill_form"));
      return;
    }
    if (password !== confirm) {
      Alert.alert(t("error"), t("password_mismatch"));
      return;
    }
    setBusy(true);
    try {
      await signupUser({ name: name.trim(), phone: phone.trim(), password });
      Alert.alert(t("signup"), t("signup_complete"), [
        { text: t("login"), onPress: () => navigation.navigate("Login") },
      ]);
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← {t("back")}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t("signup_subtitle")}</Text>
          <Text style={styles.sub}>{t("create_account")}</Text>

          <View style={styles.field}>
            <Text style={styles.icon}>{t("login_emoji_user")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("name_placeholder")}
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>
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
          <View style={styles.field}>
            <Text style={styles.icon}>{t("login_emoji_lock")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("confirm_password")}
              placeholderTextColor="#999"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, busy && { opacity: 0.7 }]}
            onPress={onSignup}
            disabled={busy}
            activeOpacity={0.9}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>{t("signup")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>{t("have_account")} </Text>
            <Text style={styles.linkBold}>{t("login")}</Text>
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
    paddingTop: 56,
    paddingBottom: 40,
  },
  backBtn: { marginBottom: 16 },
  backText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },
  sub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 22,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 12,
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
    marginTop: 8,
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
    marginTop: 22,
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
