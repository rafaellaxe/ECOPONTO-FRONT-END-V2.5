// Icones SVG inline (stroke = currentColor). Sem dependencias externas.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 24, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      {children}
    </svg>
  )
}

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </Svg>
)

export const IconTrophy = (p) => (
  <Svg {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
    <path d="M12 13v4M9 21h6M10 17h4l.5 4h-5l.5-4Z" />
  </Svg>
)

export const IconActivity = (p) => (
  <Svg {...p}>
    <path d="M3 12h4l2.5-7 5 16 2.5-9H21" />
  </Svg>
)

export const IconUser = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Svg>
)

export const IconRecycle = (p) => (
  <Svg {...p}>
    <path d="M12 4.5 14 8l-3 .2" />
    <path d="m7 8.5-2.2 4a2 2 0 0 0 1.7 3H9" />
    <path d="m15.2 7.2 2.3.2 1.8 3.4a2 2 0 0 1-.5 2.6L17 18" />
    <path d="M9 20h6.5a2 2 0 0 0 1.8-2.9" />
    <path d="m4.6 12.5 1.9-3.3M9 20l-1.6-2.7" />
  </Svg>
)

export const IconQr = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3M21 14v.01M14 21h3M21 17v4M17.5 21H18" />
  </Svg>
)

export const IconScan = (p) => (
  <Svg {...p}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <path d="M4 12h16" />
  </Svg>
)

export const IconChevronLeft = (p) => (
  <Svg {...p}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
)
export const IconChevronRight = (p) => (
  <Svg {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
)
export const IconArrowRight = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

export const IconEye = (p) => (
  <Svg {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
)
export const IconEyeOff = (p) => (
  <Svg {...p}>
    <path d="M10.7 6.2A9.3 9.3 0 0 1 12 6c6.4 0 10 6 10 6a16 16 0 0 1-3 3.5M6.2 6.7A16 16 0 0 0 2 12s3.6 6 10 6a9 9 0 0 0 3.7-.8" />
    <path d="m9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
  </Svg>
)

export const IconMail = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
)
export const IconLock = (p) => (
  <Svg {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Svg>
)
export const IconUserOutline = IconUser
export const IconPhone = (p) => (
  <Svg {...p}>
    <path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 17l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3 6.6 1.5 1.5 0 0 1 4.5 5" />
  </Svg>
)
export const IconCalendar = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </Svg>
)

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)
export const IconX = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)
export const IconAlert = (p) => (
  <Svg {...p}>
    <path d="M12 3 2.5 20h19L12 3Z" />
    <path d="M12 10v4M12 17.5v.5" />
  </Svg>
)

export const IconTicket = (p) => (
  <Svg {...p}>
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" />
    <path d="M14 6v2M14 11v2M14 16v0" strokeDasharray="0.1 3.4" />
  </Svg>
)
export const IconGift = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="9" width="17" height="11" rx="2" />
    <path d="M3.5 12.5h17M12 9v11" />
    <path d="M12 9S10.5 4.5 8 5.2 9.5 9 12 9Zm0 0s1.5-4.5 4-3.8S14.5 9 12 9Z" />
  </Svg>
)
export const IconTarget = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" />
  </Svg>
)
export const IconSparkles = (p) => (
  <Svg {...p}>
    <path d="M12 4.5 13.6 9 18 10.5 13.6 12 12 16.5 10.4 12 6 10.5 10.4 9 12 4.5Z" />
    <path d="M18.5 4v3M20 5.5h-3M5 16v2.5M6.2 17.2H3.8" />
  </Svg>
)
export const IconCamera = (p) => (
  <Svg {...p}>
    <path d="M4 8.5a2 2 0 0 1 2-2h1.5L9 4.5h6L16.5 6.5H18a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
)
export const IconWifi = (p) => (
  <Svg {...p}>
    <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8 15.5a5 5 0 0 1 8 0" />
    <path d="M12 19h.01" />
  </Svg>
)
export const IconWifiOff = (p) => (
  <Svg {...p}>
    <path d="M3 3l18 18M8 15.5a5 5 0 0 1 6.5-.5M12 19h.01M5 12a10 10 0 0 1 3-2M19 12a10 10 0 0 0-7-2.9M2 8.5A15 15 0 0 1 6 6m6-1a15 15 0 0 1 10 3.5" />
  </Svg>
)
export const IconRefresh = (p) => (
  <Svg {...p}>
    <path d="M3.5 12a8.5 8.5 0 0 1 14.5-6l2 2M20.5 12A8.5 8.5 0 0 1 6 18l-2-2" />
    <path d="M20 4v4h-4M4 20v-4h4" />
  </Svg>
)
export const IconLogout = (p) => (
  <Svg {...p}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 12h10M16.5 8.5 20 12l-3.5 3.5" />
  </Svg>
)
export const IconEdit = (p) => (
  <Svg {...p}>
    <path d="M4 20h4L18.5 9.5a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0L4 16v4Z" />
    <path d="M13.5 7.5 16.5 10.5" />
  </Svg>
)
export const IconChevronDown = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)
export const IconLeafImpact = (p) => (
  <Svg {...p}>
    <path d="M5 19c0-8 6-13 14-13 0 8-5 14-13 14-1 0-1-1-1-1Z" />
    <path d="M9 15c2-3 5-5 8-6" />
  </Svg>
)
export const IconBolt = (p) => (
  <Svg {...p}>
    <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />
  </Svg>
)
export const IconDrop = (p) => (
  <Svg {...p}>
    <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" />
  </Svg>
)
export const IconLogoutSmall = IconLogout
export const IconMapPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
)
export const IconWrench = (p) => (
  <Svg {...p}>
    <path d="M15 4a5 5 0 0 0-6 6L4 15l5 5 5-5a5 5 0 0 0 6-6l-3 3-3-3 3-3a5 5 0 0 0-2-1Z" />
  </Svg>
)
