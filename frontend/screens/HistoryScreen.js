import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../utils/api";
import { colors, fonts, radii } from "../constants/theme";

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function HistoryScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.phone) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getHistory(user.phone);
      setItems(data.history || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.phone]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.sage} />
        <Text style={styles.muted}>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← {t("back")}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("history")}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item.timestamp || item._id || index)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.sage} colors={[colors.sage]} />
        }
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>{t("no_history")}</Text>
            <Text style={styles.emptySub}>{t("history_empty")}</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.idx}>
              <Text style={styles.idxText}>{index + 1}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.disease}>{String(item.disease_name || "").replace(/_/g, " ")}</Text>
              <Text style={styles.meta}>
                {t("confidence")}: {item.confidence ?? item.confidence_percent ?? "—"}
                {t("percent_unit")}
              </Text>
              {item.severity ? (
                <Text style={styles.meta}>
                  {t("severity")}: {item.severity}
                </Text>
              ) : null}
              <Text style={styles.date}>{formatDate(item.timestamp || item.created_at)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.paper,
  },
  muted: {
    marginTop: 10,
    fontFamily: fonts.sans,
    color: colors.muted,
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  back: {
    fontFamily: fonts.sansSemi,
    color: colors.moss,
    marginBottom: 6,
    fontSize: 15,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
  },
  list: { padding: 18, paddingBottom: 40 },
  emptyContainer: { flexGrow: 1 },
  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyTitle: {
    fontFamily: fonts.sansSemi,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  idx: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.foam,
    alignItems: "center",
    justifyContent: "center",
  },
  idxText: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.moss,
  },
  cardBody: { flex: 1 },
  disease: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 4,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.body,
    marginBottom: 2,
  },
  date: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
    marginTop: 6,
  },
});
