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
    {
      Icon: FacebookIcon,
      href: settings.facebook,
      label: "Facebook",
      color: "text-[#1877f2]",
    },
    {
      Icon: InstagramIcon,
      href: settings.instagram,
      label: "Instagram",
      color: "text-[#e1306c]",
    },
    { Icon: TiktokIcon, href: settings.tiktok, label: "TikTok", color: "text-[#111]" },
    {
      Icon: WhatsappIcon,
      href: whatsapp ? `https://wa.me/${whatsapp}` : "",
      label: "WhatsApp",
      color: "text-[#25d366]",
    },
  ].filter((link) => link.href.trim().length > 0);
}
