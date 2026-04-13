import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useLanguage } from "../context/LanguageContext";
import { colors, fonts, radii } from "../constants/theme";

export default function CameraScreen({ route, navigation }) {
  const { mode } = route.params;
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (mode === "gallery") {
      pickFromGallery();
    }
  }, [mode]);

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("error"), t("gallery_permission"));
        navigation.goBack();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert(t("error"), t("network_error"));
      navigation.goBack();
    }
  };

  const analyzeImage = () => {
    if (image) {
      navigation.replace("Result", { imageUri: image });
    }
  };

  if (image) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.preview} />
        <View style={[styles.buttonRow, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={() => setImage(null)}>
            <Text style={styles.buttonText}>{t("retake")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.analyzeButton]} onPress={analyzeImage}>
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                🔬 {t("analyze")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.sage} />
      <Text style={styles.loadingText}>{t("opening_gallery")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.paper,
  },
  loadingText: {
    marginTop: 20,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.muted,
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
    backgroundColor: colors.ink,
  },
  buttonRow: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    backgroundColor: colors.forest,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: radii.md,
    alignItems: "center",
  },
  retakeButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
  },
  analyzeButton: {
    backgroundColor: colors.sage,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.sansSemi,
    fontSize: 16,
  },
});
