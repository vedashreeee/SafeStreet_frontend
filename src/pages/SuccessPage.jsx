import { useEffect, useState } from 'react'
import { HAZARD_TYPES }         from '../utils/hazards.jsx'

export default function SuccessPage({ lang, data, onNewReport }) {
  const [countVisible, setCountVisible] = useState(false)
  const [reportCount,  setReportCount]  = useState(0)

  const needed = 5

  /* ── Animate progress bar in + fetch real count ─────── */
  useEffect(() => {
    const t = setTimeout(() => setCountVisible(true), 450)

    async function fetchLocationCount() {
      try {
        if (!data?.location) return
        const res = await fetch(
          `http://localhost:5000/api/location-count` +
          `?lat=${data.location.lat}&lng=${data.location.lng}&hazard=${data.hazard}`
        )
        const result = await res.json()
        if (result.success) setReportCount(result.count || 0)
      } catch (err) {
        console.error('COUNT ERROR:', err)
        // Fallback — show 1 (this report)
        setReportCount(1)
      }
    }

    fetchLocationCount()
    return () => clearTimeout(t)
  }, [data])

  const selectedHazard = data?.hazard
    ? HAZARD_TYPES.find(h => h.id === data.hazard)
    : null

  const progressPercent  = Math.min((reportCount / needed) * 100, 100)
  const remaining        = Math.max(needed - reportCount, 0)
  const dangerTriggered  = reportCount >= needed

  /* ── i18n ────────────────────────────────────────────── */
  const tx = (en, te) => lang === 'te' ? te : en

  /* ── "What happens next" rows ────────────────────────── */
  const nextSteps = [
    {
      icon: '👥',
      title:  tx('When 5 people report',        '5 మంది నివేదిస్తే'),
      detail: tx('System automatically verifies the danger zone',
                 'స్వయంచాలకంగా ప్రమాద జోన్ నిర్ధారిస్తుంది'),
    },
    {
      icon: '📄',
      title:  tx('Complaint letter',             'ఫిర్యాదు పత్రం'),
      detail: tx('A formal PDF with all photos is auto-generated',
                 'ఫోటోలతో అధికారిక ఫిర్యాదు PDF స్వయంచాలకంగా తయారవుతుంది'),
    },
    {
      icon: '🔔',
      title:  tx('Officer is alerted',         'సెక్రటరీ అలర్ట్'),
      detail: tx('A device buzzes on their desk',
                 'పరికరం వారి డెస్క్‌పై బజ్ చేస్తుంది'),
    },
    {
      icon: '🔧',
      title:  tx('When repaired',                'రిపేర్ పూర్తయితే'),
      detail: tx('You receive a Telugu SMS notification',
                 'మీకు Telugu SMS వస్తుంది'),
    },
  ]

  /* ── Share handler ───────────────────────────────────── */
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'SafeStreet',
        text: tx(
          'Report a road hazard in our village',
          'మన గ్రామంలో రోడ్డు ప్రమాదాన్ని నివేదించండి'
        ),
        url: window.location.href,
      }).catch(() => {})
    }
  }

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="success-page animate-fadeIn">

      {/* ══ HERO ════════════════════════════════════════ */}
      <div className="success-hero">
        <div className="success-check-ring" role="img" aria-label="Success">
          <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
            <path
              d="M10 25l9 9 18-18"
              stroke="var(--forest)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="gold-divider" />

        <h1 className={`success-title${lang === 'te' ? ' telugu' : ''}`}>
          {tx('Report Submitted!', 'నివేదన సమర్పించబడింది!')}
        </h1>

        <p className="success-subtitle">
          {tx(
            'Your report has been added to the Municipality hazard heatmap',
            'మీ నివేదన పంచాయతీ హీట్‌మ్యాప్‌లో చేర్చబడింది'
          )}
        </p>

        <div className="report-id-chip">
          <span className="report-id-label">
            {tx('Report ID', 'నివేదన ID')}
          </span>
          <span className="report-id-value">
            {data?.reportId || 'SS-000000'}
          </span>
        </div>
      </div>

      {/* ══ PROGRESS ════════════════════════════════════ */}
      <div className="progress-section">
        <div className="progress-header-bar">
          <span className={`progress-heading${lang === 'te' ? ' telugu' : ''}`}>
            {tx('Complaint Progress', 'ఫిర్యాదు ప్రగతి')}
          </span>
          <span className="progress-count">
            {reportCount} / {needed}
          </span>
        </div>

        <div className="progress-body">
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill${countVisible ? ' progress-bar-fill--animated' : ''}`}
              style={{ '--pct': `${progressPercent}%` }}
            />
          </div>

          {!dangerTriggered ? (
            <p className="progress-desc">
              {tx(
                `${remaining} more people need to report this location for an automatic complaint to be sent to the Municipality Office`,
                `${remaining} మంది మరింత ఇదే స్థానాన్ని నివేదిస్తే, పంచాయతీ సెక్రటరీకి స్వయంచాలకంగా ఫిర్యాదు పంపబడుతుంది`
              )}
            </p>
          ) : (
            <div className="danger-zone-alert">
              🚨 {tx(
                'Danger zone threshold reached. Automatic Panchayat complaint triggered.',
                'ప్రమాద జోన్ పరిమితి చేరుకుంది. స్వయంచాలక పంచాయతీ ఫిర్యాదు ప్రారంభమైంది.'
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══ WHAT HAPPENS NEXT ═══════════════════════════ */}
      <div className="next-steps">
        <h2 className="next-steps-title">
          {tx('What happens next?', 'తర్వాత ఏమి జరుగుతుంది?')}
        </h2>

        {nextSteps.map((item, i) => (
          <div
            key={i}
            className="next-step-row"
            style={{ animationDelay: `${0.15 + i * 0.1}s` }}
          >
            <div className="next-step-icon">{item.icon}</div>
            <div className="next-step-text">
              <strong className={lang === 'te' ? 'telugu' : ''}>
                {item.title}
              </strong>
              <span>{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ══ SHARE BOX ═══════════════════════════════════ */}
      <div className="share-box">
        <p className={`share-msg${lang === 'te' ? ' telugu' : ''}`}>
          📢{' '}
          {tx(
            'Tell your neighbours to report the same spot — 5 reports = Panchayat action!',
            'మీ పొరుగువారిని కూడా నివేదించమని చెప్పండి — 5 నివేదనలు = పంచాయతీ చర్య!'
          )}
        </p>
        <button type="button" className="share-btn" onClick={handleShare}>
          {tx('Share', 'షేర్ చేయండి')}
        </button>
      </div>

      {/* ══ ACTIONS ══════════════════════════════════════ */}
      <div className="success-actions">
        <button
          type="button"
          className="btn btn-primary btn-full"
          onClick={onNewReport}
        >
          {tx('Report Another Hazard', 'మరో నివేదన')}
        </button>
      </div>
    </div>
  )
}