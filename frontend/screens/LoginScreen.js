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
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/api";
import { authStyles } from "../constants/authStyles";
import { fonts } from "../constants/theme";

export default function LoginScreen({ navigation }) {
  const { t } = useLanguage();
  const { setUser } = useAuth();
  const insets = useSafeAreaInsets();
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

  async function guestLogin() {
    await setUser({ name: t("guest_name"), phone: "guest" });
  }

  return (
    <View style={[authStyles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={authStyles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={authStyles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.card}>
            <View style={authStyles.brandRow}>
              <View style={authStyles.brandDot} />
              <Text style={authStyles.brandTitle}>{t("app_name")}</Text>
            </View>
            <Text style={authStyles.tagline}>{t("auth_tagline")}</Text>

            <View style={authStyles.titleWithIcon} accessibilityRole="header">
              <Text style={authStyles.titleIcon}>🔐</Text>
              <Text style={[styles.screenTitle, { fontFamily: fonts.sansSemi }]}>{t("login")}</Text>
            </View>

            <View style={authStyles.form}>
              <View>
                <View style={authStyles.labelRow}>
                  <Text style={authStyles.labelIcon}>📞</Text>
                  <Text style={authStyles.labelText}>{t("phone").toUpperCase()}</Text>
                </View>
                <View style={authStyles.inputRow}>
                  <Text style={authStyles.inputLeadingIcon}>📞</Text>
                  <TextInput
                    style={authStyles.inputInRow}
                    placeholder={t("phone_placeholder")}
                    placeholderTextColor="#8a9e8e"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    accessibilityLabel={t("phone")}
                  />
                </View>
              </View>

              <View>
                <View style={authStyles.labelRow}>
                  <Text style={authStyles.labelIcon}>🔒</Text>
                  <Text style={authStyles.labelText}>{t("password").toUpperCase()}</Text>
                </View>
                <View style={authStyles.inputRow}>
                  <Text style={authStyles.inputLeadingIcon}>🔑</Text>
                  <TextInput
                    style={authStyles.inputInRow}
                    placeholder={t("password_placeholder")}
                    placeholderTextColor="#8a9e8e"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    accessibilityLabel={t("password")}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[authStyles.btnForest, busy && authStyles.btnDisabled]}
                onPress={onLogin}
                disabled={busy}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={t("login")}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={authStyles.btnForestText}>
                    🔓 {t("login")} →
                  </Text>
                )}
              </TouchableOpacity>

              <View style={authStyles.dividerRow}>
                <View style={authStyles.dividerLine} />
                <Text style={authStyles.dividerOr}>{t("or")}</Text>
                <View style={authStyles.dividerLine} />
              </View>

              <TouchableOpacity
                style={authStyles.btnGuest}
                onPress={guestLogin}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={t("guest_continue")}
              >
                <Text style={authStyles.btnGuestText}>👤 {t("guest_continue")}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={authStyles.linkRow}
              onPress={() => navigation.navigate("Signup")}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`${t("no_account")} ${t("signup")}`}
            >
              <Text style={authStyles.link}>📝 {t("no_account")} </Text>
              <Text style={authStyles.linkBold}>{t("signup")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 18,
    color: "#0e1a12",
    flex: 1,
  },
});
