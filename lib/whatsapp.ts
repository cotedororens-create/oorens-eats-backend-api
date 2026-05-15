import { SITE_CONFIG } from "./config";
import { formatPrice } from "./menu";
import type { DetailedLine } from "./cart";

export type OrderMode = "cafeteria" | "livraison";

type DeliveryOpts = {
  mode: OrderMode;
  location?: string; // ex: "Pédiatrie, Salle 12, Lit 03"
};

export function buildWhatsAppOrderUrl(
  lines: DetailedLine[],
  total: number,
  delivery: DeliveryOpts
): string {
  const date = new Date().toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemLines = lines
    .map((l) => {
      const name = l.accompLabel
        ? `${l.itemName} + ${l.accompLabel}`
        : l.itemName;
      return `• ${l.qty} × ${name} — ${formatPrice(l.subtotal)}`;
    })
    .join("\n");

  const locationBlock =
    delivery.mode === "livraison"
      ? `\n🚚 Livraison : ${delivery.location?.trim() || "(emplacement non précisé)"}`
      : `\n🍽️ Récupération : À la cafétéria Orens-Eats`;

  const text = [
    `*Nouvelle commande — ${SITE_CONFIG.name}*`,
    `_${date}_`,
    "",
    itemLines,
    "",
    `*TOTAL : ${formatPrice(total)}*`,
    locationBlock,
    "",
    "Merci de me confirmer la disponibilité et le délai. 🙏",
  ].join("\n");

  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
