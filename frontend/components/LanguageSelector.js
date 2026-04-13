import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { SUPPORTED_LANGS } from "../utils/translations";
import { colors, fonts, radii } from "../constants/theme";

/**
 * Opens a modal to pick app language; persists via LanguageContext.
 * @param {{ variant?: "dark" | "light" }} props
 */
export default function LanguageSelector({ variant = "light" }) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = SUPPORTED_LANGS.find((l) => l.code === lang)?.label || "English";
  const isDark = variant === "dark";

  return (
    <>
      <TouchableOpacity
        style={[styles.btn, isDark ? styles.btnDark : styles.btnLight]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={[styles.btnText, isDark && styles.btnTextDark]}>
          🌐 {current}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.sheetTitle}>{t("select_language")}</Text>
            <FlatList
              data={SUPPORTED_LANGS}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, item.code === lang && styles.itemActive]}
                  onPress={async () => {
                    await setLang(item.code);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.close} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    alignSelf: "flex-start",
  },
  btnLight: {
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  btnDark: {
    backgroundColor: colors.forest,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  btnText: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.ink,
  },
  btnTextDark: {
    color: "rgba(255,255,255,0.92)",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  sheetTitle: {
    fontFamily: fonts.sansSemi,
    fontSize: 17,
    color: colors.ink,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    marginBottom: 8,
    backgroundColor: colors.paper,
  },
  itemActive: {
    backgroundColor: colors.foam,
    borderWidth: 1,
    borderColor: colors.sage,
  },
  itemText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.ink,
  },
  close: {
    marginTop: 8,
    alignItems: "center",
    padding: 12,
  },
  closeText: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    color: colors.moss,
  },
});
