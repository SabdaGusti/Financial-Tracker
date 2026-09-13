// Master data provider e-wallet (section 11 blueprint).
// `logo` merujuk ke nama file PNG di src/assets/providers/ (lihat utils/providerLogos.js).
export const ewalletProviders = [
  { type: "ewallet", name: "GoPay", shortName: "GoPay", isPopular: true, isActive: true, icon: "wallet", logo: "gopay" },
  { type: "ewallet", name: "DANA", shortName: "DANA", isPopular: true, isActive: true, icon: "wallet", logo: "dana" },
  { type: "ewallet", name: "OVO", shortName: "OVO", isPopular: true, isActive: true, icon: "wallet", logo: "ovo" },
  { type: "ewallet", name: "ShopeePay", shortName: "ShopeePay", isPopular: true, isActive: true, icon: "wallet", logo: "shopeepay" },
  { type: "ewallet", name: "LinkAja", shortName: "LinkAja", isPopular: false, isActive: true, icon: "wallet", logo: "linkAja" },
  { type: "ewallet", name: "i.saku", shortName: "i.saku", isPopular: false, isActive: true, icon: "wallet", logo: "isaku" },
  { type: "ewallet", name: "Sakuku", shortName: "Sakuku", isPopular: false, isActive: true, icon: "wallet", logo: "sakuku" },
];
