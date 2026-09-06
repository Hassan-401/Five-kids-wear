type IconProps = { className?: string; strokeWidth?: number };

const base = "w-5 h-5";

export const CartIcon = ({ className = base, strokeWidth = 1.8 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L21 8H6" />
    <circle cx="10" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
  </svg>
);

export const HeartIcon = ({ className = base, filled = false }: IconProps & { filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20.3 4.3 12.9a4.6 4.6 0 0 1 6.5-6.5l1.2 1.2 1.2-1.2a4.6 4.6 0 1 1 6.5 6.5Z" />
  </svg>
);

export const UserIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const SearchIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.9} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const ChevronDown = ({ className = "w-4 h-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ArrowLeft = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </svg>
);

export const ArrowRight = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m0 0-6-6m6 6-6 6" />
  </svg>
);

export const TruckIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7.5h11v9H2z" />
    <path d="M13 10.5h4l3 3v3h-7z" />
    <circle cx="6" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const ShieldIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 6v6c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const BadgeIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5.2" />
    <path d="m8.5 13.5-1.3 6L12 17.6l4.8 1.9-1.3-6" />
  </svg>
);

export const SupportIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20.3 4.3 12.9a4.6 4.6 0 0 1 6.5-6.5l1.2 1.2 1.2-1.2a4.6 4.6 0 1 1 6.5 6.5Z" />
  </svg>
);

export const MailIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 7 8 5.5L20 7" />
  </svg>
);

export const PhoneIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3.5h3l1.6 4-2 1.4a12 12 0 0 0 5.5 5.5l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.7 2 2 0 0 1 5 3.5Z" />
  </svg>
);

export const PinIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s6.5-5.6 6.5-10.3a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.4" />
  </svg>
);

export const ClockIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const MenuIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2.1} stroke="currentColor" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2.1} stroke="currentColor" strokeLinecap="round">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const StarIcon = ({ className = "w-4 h-4", filled = true }: IconProps & { filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} strokeWidth={1.6} stroke="currentColor" strokeLinejoin="round">
    <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8Z" />
  </svg>
);

export const GiftIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="9" width="17" height="11" rx="2" />
    <path d="M3.5 13.5h17M12 9v11M12 9S9 4 7 5.6C5.4 6.9 7.4 9 12 9Zm0 0s3-5 5-3.4C18.6 6.9 16.6 9 12 9Z" />
  </svg>
);

export const TrashIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 7h15M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7M6.5 7l.9 12a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-12" />
  </svg>
);

export const CheckIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2.4} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const GlobeIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.4-3.3-8.5S9.8 5.9 12 3.5Z" />
  </svg>
);

/* --- social --- */
export const FacebookIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5H16.6V4.4A22 22 0 0 0 14.4 4.3c-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21Z" />
  </svg>
);

export const InstagramIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.9} stroke="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <circle cx="12" cy="12" r="3.4" />
    <circle cx="16.6" cy="7.4" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const TiktokIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.2 3h-2.7v12.1a2.4 2.4 0 1 1-2-2.4V10a5.4 5.4 0 1 0 4.7 5.3V9.1a6.4 6.4 0 0 0 3.6 1.1V7.5a3.7 3.7 0 0 1-3.6-3.6Z" />
  </svg>
);

export const YoutubeIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.6 8.2a2.5 2.5 0 0 0-1.8-1.8C18.2 6 12 6 12 6s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 3.8 2.5 2.5 0 0 0 1.8 1.8C5.8 18 12 18 12 18s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-3.8ZM10.2 14.7V9.3L14.8 12Z" />
  </svg>
);

export const WhatsappIcon = ({ className = base }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14c-.2.6-1.3 1.2-1.8 1.2s-1.2.3-3.9-.9a10.7 10.7 0 0 1-4.3-4.6c-.3-.6-.9-1.9-.9-2.9s.5-1.6.8-1.9c.2-.2.4-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4 0 .5l-.4.5c-.2.2-.3.3-.1.6a8 8 0 0 0 3.7 3.2c.3.2.5.1.6 0l.8-1c.2-.2.3-.2.6-.1l2 1c.2.1.4.2.4.3a2 2 0 0 1-.1.9Z" />
  </svg>
);
