import { Receipt } from "lucide-react";
import TransactionCard from "./TransactionCard";
import EmptyState from "../common/EmptyState";
import Skeleton from "../common/Skeleton";
import { formatRelativeGroup } from "../../utils/date";

export default function TransactionList({
  records,
  accountsById,
  categoriesById,
  loading,
  perspectiveAccountId,
  onSelect,
  emptyTitle = "Belum ada transaksi",
  emptyDescription = "Transaksi yang kamu catat akan muncul di sini.",
}) {
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={66} />
        ))}
      </div>
    );
  }

  if (!records.length) {
    return <EmptyState icon={Receipt} title={emptyTitle} description={emptyDescription} />;
  }

  const groups = [];
  let currentKey = null;
  records.forEach((record) => {
    if (record.date !== currentKey) {
      groups.push({ key: record.date, label: formatRelativeGroup(record.date), items: [] });
      currentKey = record.date;
    }
    groups[groups.length - 1].items.push(record);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {groups.map((group) => (
        <div key={group.key}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--color-text-muted)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {group.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {group.items.map((record) => {
              const account = accountsById[record.accountId];
              const destination = accountsById[record.destinationAccountId];
              const category = categoriesById[record.categoryId];
              return (
                <TransactionCard
                  key={record.id}
                  record={record}
                  accountName={account?.name || "Account dihapus"}
                  destinationAccountName={destination?.name || "-"}
                  categoryName={category?.name}
                  perspectiveAccountId={perspectiveAccountId}
                  onClick={() => onSelect?.(record)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
