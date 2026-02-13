import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Card from "../../components/Card";
import Chip from "../../components/Chip";
import ConfirmModal from "../../components/ConfirmModal";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenContainer from "../../components/ScreenContainer";
import TransactionItem from "../../components/TransactionItem";
import { useTheme } from "../../constants/theme";
import { useData } from "../../hooks/useData";

const filterOptions = ["All", "MTN", "Airtel", "Glo", "9mobile"];

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { purchases, deletePurchase } = useData();
  const [filter, setFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    return purchases
      .filter((p) => (filter === "All" ? true : p.provider === filter))
      .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
  }, [purchases, filter]);

  const confirmDelete = () => {
    if (deleteId == null) return;
    deletePurchase(deleteId);
    setDeleteId(null);
  };

  const renderTransaction = ({ item }) => (
    <TransactionItem item={item} onDelete={() => setDeleteId(item.id)} />
  );

  const renderChip = ({ item: opt }) => (
    <Chip
      label={opt}
      selected={filter === opt}
      onPress={() => setFilter(opt)}
    />
  );

  return (
    <ScreenContainer>
      {/* ✅ Make the whole screen layout "column" and allow list to fill remaining space */}
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 28,
              fontWeight: "700",
            }}
          >
            History
          </Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ✅ Chips: shorter + less spacing so it doesn't "eat" the screen */}
        <FlatList
          data={filterOptions}
          keyExtractor={(opt) => opt}
          renderItem={renderChip}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, marginBottom: 6, height: 40, flexGrow: 0 }}
          contentContainerStyle={{ paddingRight: 8, alignItems: "center" }}
        />

        {/* ✅ Content area should take remaining height */}
        <View style={{ flex: 1 }}>
          {filtered.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 24,
              }}
            >
              {/* Circle icon */}
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: "#EEF2FF",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <Ionicons name="receipt-outline" size={38} color="#CBD5E1" />
              </View>

              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 18,
                  fontWeight: "800",
                  marginBottom: 10,
                }}
              >
                No purchases yet
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  textAlign: "center",
                  lineHeight: 18,
                  marginBottom: 22,
                  maxWidth: 260,
                }}
              >
                You haven't bought any airtime yet.{"\n"}Start tracking your
                expenses today!
              </Text>

              {/* Button width like the mock */}
              <PrimaryButton
                onPress={() => router.push("/add-airtime")}
                style={{ width: "100%", maxWidth: 320 }}
              >
                Add Airtime
              </PrimaryButton>
            </View>
          ) : (
            <Card
              style={{
                flex: 1, // ✅ MUST be here so list fills remainder
                marginTop: 6,
                marginBottom: 0, // ✅ smaller (ScreenContainer + tabs already give space)
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}
            >
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={renderTransaction}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }} // ✅ ensure FlatList uses remaining height inside card
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1, // ✅ slimmer line like modern UI
                      backgroundColor: colors.border + "55",
                      marginLeft: 52,
                    }}
                  />
                )}
              />
            </Card>
          )}
        </View>

        <ConfirmModal
          visible={deleteId !== null}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          title="Delete Transaction?"
          message="This action can't be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </View>
    </ScreenContainer>
  );
}
