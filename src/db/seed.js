import { db } from "./database";
import { bankProviders } from "../data/bankProviders";
import { ewalletProviders } from "../data/ewalletProviders";
import { defaultCategories } from "../data/defaultCategories";

/**
 * Seed master data (account providers & default categories) on first run,
 * and backfill fields added to master data later (e.g. `logo`) onto rows
 * that already exist, matched by name so existing accounts keep pointing
 * to the same provider id.
 */
export async function seedDatabaseIfNeeded() {
  await db.transaction("rw", db.accountProviders, db.categories, async () => {
    const masterProviders = [...bankProviders, ...ewalletProviders];
    const existingProviders = await db.accountProviders.toArray();

    if (existingProviders.length === 0) {
      await db.accountProviders.bulkAdd(masterProviders);
    } else {
      for (const master of masterProviders) {
        const existing = existingProviders.find((p) => p.name === master.name);
        if (!existing) {
          await db.accountProviders.add(master);
        } else if (existing.logo !== master.logo) {
          await db.accountProviders.update(existing.id, { logo: master.logo });
        }
      }
    }

    const categoryCount = await db.categories.count();
    if (categoryCount === 0) {
      await db.categories.bulkAdd(defaultCategories);
    }
  });
}
