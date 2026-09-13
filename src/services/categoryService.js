import { db } from "../db/database";

export async function getCategories({ type } = {}) {
  let categories = await db.categories.toArray();
  categories = categories.filter((c) => c.isActive);
  if (type) {
    categories = categories.filter((c) => c.type === type || c.type === "general");
  }
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategory(id) {
  return db.categories.get(id);
}

export async function createCategory(data) {
  const name = (data.name || "").trim();
  if (!name) throw new Error("Nama kategori wajib diisi.");
  const id = await db.categories.add({
    name,
    type: data.type || "general",
    icon: data.icon || "tag",
    isDefault: false,
    isActive: true,
  });
  return db.categories.get(id);
}

export async function updateCategory(id, updates) {
  await db.categories.update(id, updates);
  return db.categories.get(id);
}

export async function deactivateCategory(id) {
  return db.categories.update(id, { isActive: false });
}
