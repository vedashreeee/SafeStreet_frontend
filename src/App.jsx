import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import ReportPage  from './pages/ReportPage.jsx'
import SuccessPage from './pages/SuccessPage.jsx'
import './index.css'
import './App.css'
import logoImg from './safestreet_logo.jpg'
/* ── Header ─────────────────────────────────────────────── */
function Header({ lang, onLangToggle }) {
  return (
    <header className="site-header">
      <div className="header-brand">
        
        {/* Seamless Logo Wrapper */}
        <div 
          className="header-logo-wrap" 
          style={{ 
            background: 'transparent',
            padding: '0',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '12px'
          }}
        >
          <img 
            src={logoImg} 
            alt="SafeStreet Logo" 
            style={{ 
              width: '46px', 
              height: '46px', 
              objectFit: 'contain',
              mixBlendMode: 'lighten' /* Hides any slight color mismatch */
            }} 
          />
        </div>

        <div>
          <div className="header-title">
            {lang === 'te' ? 'సేఫ్ స్ట్రీట్ · SafeStreet' : 'సేఫ్ స్ట్రీట్ · SafeStreet'}
          </div>
          <div className="header-subtitle">
            {lang === 'te' ? 'మున్సిపాలిటీ ఆఫీస్, తాడిగడప' : 'Municipality Office, Tadigadapa'}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="lang-btn"
        onClick={onLangToggle}
        aria-label="Toggle language"
      >
        {lang === 'te' ? 'తె / EN' : 'తె / EN'}
      </button>
    </header>
  )
}
/* ── App root ────────────────────────────────────────────── */
export default function App() {
  const [page,       setPage]       = useState('report')
  const [reportData, setReportData] = useState(null)
  const [lang,       setLang]       = useState('te')

  function handleSuccess(data) {
    setReportData(data)
    setPage('success')
  }

  function handleNewReport() {
    setReportData(null)
    setPage('report')
  }

  return (
    <div className="app-container">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-body)',
            background: 'var(--navy)',
            color: '#fff',
            borderRadius: '99px',
            fontSize: '0.9rem',
            padding: '12px 24px',
            boxShadow: 'var(--shadow-navy)',
            border: '1px solid rgba(201,168,76,0.3)',
          },
        }}
      />

      <Header lang={lang} onLangToggle={() => setLang(l => l === 'te' ? 'en' : 'te')} />

      <main className="main-content">
        {page === 'report' ? (
          <ReportPage lang={lang} onSuccess={handleSuccess} />
        ) : (
          <SuccessPage lang={lang} data={reportData} onNewReport={handleNewReport} />
        )}
      </main>
    </div>
  )
}