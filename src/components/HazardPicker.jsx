import React from 'react';

/* HazardPicker.jsx — Fixed: inline SVGs, 5 New Hazards + "Other" Option */

const HAZARDS = [
  {
    id: 'pothole',
    labels: { te: 'గుంత', en: 'Pothole' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16" cy="22" rx="11" ry="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 22 C5 18 8 14 11 13 L13 10 L19 10 L21 13 C24 14 27 18 27 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M12 13 C12 11 14 9 16 9 C18 9 20 11 20 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'speedbreaker',
    labels: { te: 'విరిగిన స్పీడ్ బ్రేకర్', en: 'Broken Speed\nBreaker' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 22 Q9 12 16 14 Q20 15 24 10 L29 22 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M14 14 L17 10 L19 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="22" x2="29" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="22" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="20" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'blindcurve',
    labels: { te: 'అంధ మలుపు', en: 'Blind Curve' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 26 C6 16 10 8 20 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <path d="M16 8 L20 8 L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
        <line x1="22" y1="6" x2="22" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="12" x2="25.5" y2="13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'lighting',
    labels: { te: 'అసమానమైన వెలుతురు', en: 'Poor Lighting' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 6 L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 8 L20.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 8 L11.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16" cy="14" r="4.5" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 18.5 L16 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M13 22 L19 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="4" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
        <path d="M8 10 L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    id: 'collapse',
    labels: { te: 'రోడ్డు కూలిపోయింది', en: 'Road Collapse' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 24 L10 20 L14 23 L18 17 L22 21 L29 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 28 L29 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 16 L16 8 L18 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 12 L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'waste_dump',
    labels: { te: 'చెత్త కుప్ప', en: 'Waste Dumpage' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 10h20 M12 14v8 M20 14v8 M8 10l1.5 16a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2L24 10 M12 10V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'open_manhole',
    labels: { te: 'తెరిచి ఉన్న మ్యాన్‌హోల్', en: 'Open Manhole' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16" cy="20" rx="12" ry="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 16l2-8h-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="6" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'water_logging',
    labels: { te: 'నీరు నిలిచిపోవడం', en: 'Water Logging' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 16c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3 M3 24c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3 M16 4v7 M16 11l-3-3 M16 11l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'drain_leak',
    labels: { te: 'తెరిచి ఉన్న డ్రైనేజీ', en: 'Drain / Leak' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18a10 10 0 0 0 20 0 M16 18v10 M10 28h12 M16 2v8 M16 14v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'fallen_tree',
    labels: { te: 'కూలిన చెట్టు', en: 'Fallen Tree' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 26h24 M21 26L10 8l-4 5 M14 16l6 4 M10 8c3-4 8-4 10 0s1 7-2 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'other',
    labels: { te: 'ఇతర సమస్య', en: 'Other Issue' },
    svg: (
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="16" r="2.5" fill="currentColor"/>
        <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
        <circle cx="24" cy="16" r="2.5" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function HazardPicker({ lang = 'en', value, onChange, customValue, onCustomChange }) {
  return (
    <div style={{ width: '100%' }}>
      <div className="hazard-grid">
        {HAZARDS.map((hz) => {
          const isSelected = value === hz.id
          const rawLabel = hz.labels[lang] ?? hz.labels.en
          const labelParts = rawLabel.split('\n')

          return (
            <button
              key={hz.id}
              type="button"
              className={`hazard-tile${isSelected ? ' is-selected' : ''}`}
              onClick={() => onChange(hz.id)}
              aria-pressed={isSelected}
              aria-label={rawLabel}
            >
              {isSelected && (
                <span className="hazard-check-badge" aria-hidden="true">✓</span>
              )}

              <div
                className="hazard-tile-icon"
                style={{ color: isSelected ? '#E0C070' : '#4A607A' }}
              >
                {hz.svg}
              </div>

              <span className={`hazard-tile-name${lang === 'te' ? ' telugu' : ''}`}>
                {labelParts.map((part, i) => (
                  <span key={i} style={{ display: 'block' }}>{part}</span>
                ))}
              </span>
            </button>
          )
        })}
      </div>

      {/* --- CUSTOM TEXT INPUT FOR 'OTHER' --- */}
      {value === 'other' && (
        <div className="animate-fadeIn" style={{ marginTop: '24px' }}>
          <label className="form-label">
            {lang === 'te' ? 'దయచేసి మీ సమస్యను వివరించండి' : 'Please describe the issue'}
          </label>
          <input
            type="text"
            className="form-input"
            value={customValue || ''}
            onChange={(e) => onCustomChange && onCustomChange(e.target.value)}
            placeholder={
              lang === 'te' 
                ? 'ఉదా: వీధి కుక్కల బెడద, కాలిపోయిన ట్రాన్స్‌ఫార్మర్...' 
                : 'e.g. Stray animal menace, broken transformer...'
            }
            autoFocus
          />
        </div>
      )}
    </div>
  )
}