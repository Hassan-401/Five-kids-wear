import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  WhatsappIcon,
} from "../components/Icons";
import type { StoreSettings } from "./api";

/**
 * The store's social accounts, in the order they are shown.
 *
 * Every address comes from the dashboard, and an account the owner has not
 * filled in is left out entirely rather than rendered as a dead link.
 */
export function socialLinks(settings: StoreSettings) {
  const whatsapp = settings.whatsapp.replace(/\D/g, "");
  return [
    { Icon: FacebookIcon, href: settings.facebook, label: "Facebook" },
    { Icon: InstagramIcon, href: settings.instagram, label: "Instagram" },
    { Icon: TiktokIcon, href: settings.tiktok, label: "TikTok" },
    {
      Icon: WhatsappIcon,
      href: whatsapp ? `https://wa.me/${whatsapp}` : "",
      label: "WhatsApp",
    },
  ].filter((link) => link.href.trim().length > 0);
}
