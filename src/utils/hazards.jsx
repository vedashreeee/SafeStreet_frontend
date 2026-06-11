export const HAZARD_TYPES = [
  {
    id: 'pothole',
    color: '#C1440E',
    colorPale: '#FDF0E8',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="100%" height="100%">
        <ellipse cx="24" cy="28" rx="14" ry="6" fill="#3D2B1F" opacity="0.25"/>
        <path d="M4 22 Q12 14 20 22 Q24 26 28 22 Q36 14 44 22" stroke="#5C4A36" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="24" cy="28" rx="10" ry="4" fill="#1C1611" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: 'speedbreaker',
    color: '#E9A227',
    colorPale: '#FEF6E0',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="100%" height="100%">
        <rect x="4" y="28" width="40" height="6" rx="1" fill="#9C8872" opacity="0.4"/>
        <path d="M6 28 Q24 14 42 28" fill="#E9A227" opacity="0.9"/>
        <path d="M6 28 Q24 14 42 28" stroke="#854F0B" strokeWidth="1.5" fill="none"/>
        <line x1="24" y1="17" x2="24" y2="28" stroke="#854F0B" strokeWidth="2" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    id: 'blindcurve',
    color: '#B91C1C',
    colorPale: '#FEE2E2',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="100%" height="100%">
        <path d="M8 36 Q8 12 36 12" stroke="#5C4A36" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5"/>
        <circle cx="36" cy="12" r="6" fill="#B91C1C" opacity="0.9"/>
        <text x="36" y="16" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">!</text>
      </svg>
    ),
  },
  {
    id: 'lighting',
    color: '#2D6A4F',
    colorPale: '#E8F5EE',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="100%" height="100%">
        <rect x="4" y="36" width="40" height="4" rx="2" fill="#5C4A36" opacity="0.3"/>
        <line x1="24" y1="8" x2="24" y2="36" stroke="#5C4A36" strokeWidth="3" strokeLinecap="round"/>
        <line x1="24" y1="8" x2="36" y2="14" stroke="#5C4A36" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="36" cy="14" r="5" fill="#EFE8DA" stroke="#5C4A36" strokeWidth="1.5"/>
        <path d="M14 20 L10 16 M14 24 L8 24 M14 28 L10 32" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'collapse',
    color: '#7C3AED',
    colorPale: '#EDE9FE',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="100%" height="100%">
        <rect x="4" y="28" width="40" height="8" rx="2" fill="#9C8872" opacity="0.35"/>
        <path d="M12 20 L20 26 L28 16 L36 24" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="28" cy="16" r="4" fill="#B91C1C" opacity="0.8"/>
      </svg>
    ),
  },
]