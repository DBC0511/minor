import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../context/LanguageContext";
import { signupUser } from "../utils/api";
import { authStyles } from "../constants/authStyles";
import { fonts } from "../constants/theme";

export default function SignupScreen({ navigation }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
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
            <TouchableOpacity
              style={authStyles.backLink}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t("back")}
            >
              <Text style={authStyles.backLinkText}>⬅️ {t("back")}</Text>
            </TouchableOpacity>

            <View style={authStyles.brandRow}>
              <View style={authStyles.brandDot} />
              <Text style={authStyles.brandTitle}>{t("app_name")}</Text>
            </View>
            <Text style={authStyles.tagline}>{t("signup_subtitle")}</Text>

            <View style={authStyles.titleWithIcon} accessibilityRole="header">
              <Text style={authStyles.titleIcon}>📋</Text>
              <Text style={styles.screenTitle}>{t("create_account")}</Text>
            </View>

            <View style={authStyles.form}>
              <View>
                <View style={authStyles.labelRow}>
                  <Text style={authStyles.labelIcon}>👤</Text>
                  <Text style={authStyles.labelText}>{t("name").toUpperCase()}</Text>
                </View>
                <View style={authStyles.inputRow}>
                  <Text style={authStyles.inputLeadingIcon}>✏️</Text>
                  <TextInput
                    style={authStyles.inputInRow}
                    placeholder={t("name_placeholder")}
                    placeholderTextColor="#8a9e8e"
                    value={name}
                    onChangeText={setName}
                    accessibilityLabel={t("name")}
                  />
                </View>
              </View>

              <View>
                <View style={authStyles.labelRow}>
                  <Text style={authStyles.labelIcon}>📞</Text>
                  <Text style={authStyles.labelText}>{t("phone").toUpperCase()}</Text>
                </View>
                <View style={authStyles.inputRow}>
                  <Text style={authStyles.inputLeadingIcon}>📱</Text>
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

              <View>
                <View style={authStyles.labelRow}>
                  <Text style={authStyles.labelIcon}>🔁</Text>
                  <Text style={authStyles.labelText}>{t("confirm_password").toUpperCase()}</Text>
                </View>
                <View style={authStyles.inputRow}>
                  <Text style={authStyles.inputLeadingIcon}>✅</Text>
                  <TextInput
                    style={authStyles.inputInRow}
                    placeholder={t("confirm_password")}
                    placeholderTextColor="#8a9e8e"
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                    accessibilityLabel={t("confirm_password")}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[authStyles.btnForest, busy && authStyles.btnDisabled]}
                onPress={onSignup}
                disabled={busy}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={t("create_account")}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={authStyles.btnForestText}>✅ {t("create_account_cta")}</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={authStyles.linkRow}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`${t("have_account")} ${t("login")}`}
            >
              <Text style={authStyles.link}>🔐 {t("have_account")} </Text>
              <Text style={authStyles.linkBold}>{t("login")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontFamily: fonts.sansSemi,
    fontSize: 18,
    color: "#0e1a12",
    flex: 1,
  },
});
