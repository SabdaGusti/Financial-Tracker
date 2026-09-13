// Eagerly import every logo in src/assets/providers so each one is bundled
// and addressable by its filename (without extension), e.g. "bca" -> bca.png.
const modules = import.meta.glob("../assets/providers/*.png", {
  eager: true,
  import: "default",
});

const logoMap = {};
Object.entries(modules).forEach(([path, url]) => {
  const key = path.split("/").pop().replace(".png", "");
  logoMap[key] = url;
});

export function getProviderLogo(logoKey) {
  if (!logoKey) return null;
  return logoMap[logoKey] || null;
}
