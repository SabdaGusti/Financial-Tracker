import Dexie from "dexie";

// IndexedDB melalui Dexie.js (blueprint section 2 & 12).
export const db = new Dexie("FinancialTrackerDB");

db.version(1).stores({
  // accountProviders: master data bank/e-wallet (section 8.1)
  accountProviders: "++id, type, name, isPopular, isActive",
  // accounts (section 8.2)
  accounts: "++id, providerId, type, status, createdAt",
  // financialRecords (section 8.3)
  financialRecords:
    "++id, type, accountId, destinationAccountId, categoryId, date, createdAt",
  // categories (section 8.4)
  categories: "++id, type, isDefault, isActive",
});

export default db;
