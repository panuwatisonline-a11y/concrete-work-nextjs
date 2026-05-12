/** Primary app sections — add entries here to extend desktop + mobile tab nav. */
export const NAV_TABS = [
  { id: "home", label: "Request", href: "/dashboard" },
  { id: "mixed-codes", label: "Mixed Code", href: "/mixed-codes" },
  { id: "profile", label: "Profile", href: "/profile" },
] as const;

export type NavTabId = (typeof NAV_TABS)[number]["id"];
