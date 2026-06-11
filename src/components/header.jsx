import { t } from '../utils/i18n.js'

export default function Header({ lang, onLangToggle }) {
  return (
    <header style={{
      background: 'var(--white)', borderBottom: '1.5px solid var(--cream-border)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 8px rgba(28,22,17,0.07)'
    }}>
      <div style={{
        maxWidth: 640, margin: '0 auto', padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg viewBox="0 0 36 36" fill="none" width="36" height="36">
            <rect width="36" height="36" rx="10" fill="#C1440E"/>
            <path d="M18 8 L28 26 L8 26 Z" fill="none" stroke="white" strokeWidth="1.5"/>
            <circle cx="18" cy="20" r="2.5" fill="white"/>
            <line x1="18" y1="14" x2="18" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.25rem',
              fontWeight: 800, color: 'var(--terra)', lineHeight: 1.2
            }}>
              <span style={{ fontFamily: 'var(--font-telugu)' }}>సేఫ్ స్ట్రీట్</span>
              {lang === 'en' && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink-mid)' }}> · SafeStreet</span>}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-light)', fontWeight: 500 }}>
              {lang === 'te' ? 'గ్రామ పంచాయతీ | ఆంధ్రప్రదేశ్' : 'Gram Panchayat · Andhra Pradesh'}
            </div>
          </div>
        </div>
        <button onClick={onLangToggle} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'var(--cream)', border: '1.5px solid var(--cream-border)',
          borderRadius: 99, padding: '6px 14px', fontFamily: 'var(--font-body)',
          fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: 'var(--ink-mid)'
        }}>
          <span style={{ color: lang === 'te' ? 'var(--terra)' : undefined, fontWeight: lang === 'te' ? 700 : undefined }}>తె</span>
          <span style={{ color: 'var(--cream-border)', margin: '0 2px' }}>·</span>
          <span style={{ color: lang === 'en' ? 'var(--terra)' : undefined, fontWeight: lang === 'en' ? 700 : undefined }}>EN</span>
        </button>
      </div>
    </header>
  )
}