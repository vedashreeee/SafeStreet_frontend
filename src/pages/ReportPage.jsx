import { useState, useEffect } from 'react'
import toast            from 'react-hot-toast'
import StepIndicator    from '../components/StepIndicator.jsx'
import LocationMap      from '../components/LocationMap.jsx'
import HazardPicker     from '../components/HazardPicker.jsx'
import PhotoUpload      from '../components/PhotoUpload.jsx'
import { t }            from '../utils/i18n.js'
import { HAZARD_TYPES } from '../utils/hazards.jsx'

const TOTAL_STEPS = 4

export default function ReportPage({ lang, onSuccess }) {
  const [step,        setStep]        = useState(1)
  const [location,    setLocation]    = useState(null)   // { lat, lng }
  const [hazard,      setHazard]      = useState('')      // hazard id
  const [customIssue, setCustomIssue] = useState('')
  const [photo,       setPhoto]       = useState(null)   // { file, preview }
  const [phone,       setPhone]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  /* ── i18n helper ─────────────────────────────────────── */
  const tx = (key) => t(lang, key)

  const stepLabels = lang === 'te'
    ? ['స్థానం', 'ప్రమాద రకం', 'ఫోటో', 'సమర్పణ']
    : ['Location', 'Hazard', 'Photo', 'Submit']
    /* ── Navigation ──────────────────────────────────────── */
  function handleNext() {
    if (step === 1 && !location) {
      toast.error(lang === 'te'
        ? 'దయచేసి స్థానం ఎంచుకోండి'
        : 'Please select a location on the map')
      return
    }
    if (step === 2 && !hazard) {
      toast.error(lang === 'te'
        ? 'దయచేసి ప్రమాద రకం ఎంచుకోండి'
        : 'Please select a hazard type')
      return
    }
    setStep(s => Math.min(s + 1, TOTAL_STEPS))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    setStep(s => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Submit ──────────────────────────────────────────── */
  async function handleSubmit() {
    if (!location || !hazard) {
      toast.error(lang === 'te'
        ? 'అన్ని అవసరమైన వివరాలు నమోదు చేయండి'
        : 'Please complete required fields')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('lat',   location.lat)
      formData.append('lng',   location.lng)
formData.append('address', location.address || 'Location Selected')
      formData.append('hazard', hazard)
      if (hazard === 'other') {
        formData.append('hazard_description', customIssue) // Adjusted to commonly expected backend key
      }
      formData.append('phone',  phone.trim())
      if (photo?.file) formData.append('photo', photo.file)

      let reportId

      try {
        const res = await fetch('/api/reports', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('Server error')
        const result = await res.json()
        reportId = result.reportId || result.id ||
          ('SS-' + Math.floor(100000 + Math.random() * 900000))
      } catch {
        reportId = 'SS-' + Math.floor(100000 + Math.random() * 900000)
      }

      onSuccess({ reportId, location, hazard, phone })

    } catch (err) {
      console.error(err)
      toast.error(lang === 'te'
        ? 'నివేదన సమర్పణ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.'
        : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Hazard label helper ─────────────────────────────── */
  /* ── Hazard label helper ─────────────────────────────── */
  function hazardLabel(hazardId) {
    if (!hazardId) return '—';
    
    if (hazardId === 'other') {
      return customIssue || (lang === 'te' ? 'ఇతర సమస్య' : 'Other Issue');
    }

    const hzObj = HAZARD_TYPES.find(h => h.id === hazardId);
    if (hzObj && hzObj.labels) {
       return hzObj.labels[lang] ?? hzObj.labels.en;
    }

    // <-- REPLACE THE FALLBACK RETURN WITH THIS -->
    return hazardId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="report-page">

      {/* ── Step progress bar ── */}
      <StepIndicator current={step} total={TOTAL_STEPS} labels={stepLabels} />

      {/* ── Step content ── */}
      <div className="report-content animate-fadeUp" key={step}>

        {/* ══ STEP 1: LOCATION ════════════════════════════ */}
        {step === 1 && (
          <section className="step-section">
            <LocationMap
              lang={lang}
              value={location}
              onChange={setLocation}
            />
          </section>
        )}

        {/* ══ STEP 2: HAZARD TYPE ═════════════════════════ */}
        {step === 2 && (
          <section className="step-section">
            <div className="step-header">
             <div className="step-emoji-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Shield Outline */}
                  <path 
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
                    stroke="#F4B400" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  {/* Exclamation Mark Line */}
                  <path 
                    d="M12 8v5" 
                    stroke="#F4B400" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                  />
                  {/* Exclamation Mark Dot */}
                  <circle cx="12" cy="16.5" r="1.5" fill="#F4B400"/>
                </svg>
              </div>
              <div>
                <h2 className={`step-title${lang === 'te' ? ' telugu' : ''}`}>
                  {lang === 'te' ? 'ప్రమాద రకం ఏమిటి?' : 'What type of hazard?'}
                </h2>
                <p className="step-subtitle">
                  {lang === 'te' ? 'ఒక రకం ఎంచుకోండి' : 'Select one type from below'}
                </p>
              </div>
            </div>
            <HazardPicker
              lang={lang}
              value={hazard}
              onChange={setHazard}
              customValue={customIssue}
              onCustomChange={setCustomIssue}
            />
          </section>
        )}

        {/* ══ STEP 3: PHOTO ═══════════════════════════════ */}
        {step === 3 && (
          <section className="step-section">
            <div className="step-header">
              <div className="step-emoji-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#F4B400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div>
                <h2 className={`step-title${lang === 'te' ? ' telugu' : ''}`}>
                  {lang === 'te' ? 'ఫోటో తీయండి' : 'Add Evidence Photo'}
                </h2>
                <p className="step-subtitle">
                  {lang === 'te'
                    ? 'ఫోటో పంపితే ఫిర్యాదు బలంగా ఉంటుంది (తప్పనిసరి కాదు)'
                    : 'A photo strengthens your complaint (optional but recommended)'}
                </p>
              </div>
            </div>
            <PhotoUpload lang={lang} value={photo} onChange={setPhoto} />
          </section>
        )}

        {/* ══ STEP 4: REVIEW & SUBMIT ═════════════════════ */}
        {step === 4 && (
          <section className="step-section">
            <div className="step-header">
              <div className="step-emoji-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#F4B400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 className={`step-title${lang === 'te' ? ' telugu' : ''}`}>
                  {lang === 'te' ? 'నివేదన సమీక్ష' : 'Review & Submit'}
                </h2>
                <p className="step-subtitle">
                  {lang === 'te'
                    ? 'SMS నోటిఫికేషన్ కోసం మీ ఫోన్ నంబర్ ఇవ్వండి'
                    : 'Add your phone to get an SMS when the road is fixed'}
                </p>
              </div>
            </div>

            {/* Summary card */}
            <div className="summary-card">
              <div className="summary-card-header">
                <h3 className="summary-card-title">
                  {lang === 'te' ? 'నివేదన సారాంశం' : 'Report Summary'}
                </h3>
                <span className="summary-draft-badge">
                  {lang === 'te' ? 'ముసాయిదా' : 'Draft'}
                </span>
              </div>

              <div className="summary-body">
                
                {/* 1. Location */}
                <div className="summary-row">
  <span className="summary-label">
    {lang === 'te' ? '📍 స్థానం' : '📍 Location'}
  </span>
  <div style={{ textAlign: 'right', maxWidth: '60%' }}>
    {location?.address && (
      <div style={{
        fontSize: '0.88rem',
        fontWeight: 600,
        color: 'var(--navy)',
        marginBottom: 3,
        lineHeight: 1.4,
      }}>
        📍 {location.address}
      </div>
    )}
    <div style={{
      fontSize: '0.75rem',
      color: 'var(--ink-light)',
      fontFamily: 'monospace',
    }}>
      {location
        ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
        : '—'}
    </div>
  </div>
</div>

                {/* 2. Hazard type */}
                <div className="summary-row">
                  <span className="summary-label">
                    ⚠️ {lang === 'te' ? 'ప్రమాద రకం' : 'Hazard type'}
                  </span>
                  {hazard ? (
                    <span className="summary-hazard-chip">
                      {hazardLabel(hazard)}
                    </span>
                  ) : (
                    <span className="summary-value summary-muted">—</span>
                  )}
                </div>

                {/* 3. Photo */}
                <div className="summary-row">
                  <span className="summary-label">
                    📷 {lang === 'te' ? 'ఫోటో' : 'Photo'}
                  </span>
                  {photo ? (
                    <img
                      src={photo.preview}
                      alt="evidence"
                      className="summary-photo-thumb"
                    />
                  ) : (
                    <span className="summary-value summary-muted">
                      {lang === 'te' ? 'లేదు' : 'None'}
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Phone input */}
            <div className="phone-field">
              <label className="form-label" htmlFor="phone-input">
                {lang === 'te'
                  ? 'మీ ఫోన్ నంబర్ (SMS కోసం — ఐచ్ఛికం)'
                  : 'Your Phone Number (for SMS — optional)'}
              </label>
              <div className="phone-input-wrap">
                <span className="phone-prefix">+91</span>
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  className="phone-input"
                  placeholder="9xxxxxxxxx"
                  value={phone}
                  onChange={e =>
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  maxLength={10}
                />
              </div>
              <p className="phone-help">
                {lang === 'te'
                  ? 'రోడ్డు రిపేర్ అయినప్పుడు మీకు SMS వస్తుంది'
                  : 'You will get an SMS when the road is repaired'}
              </p>
            </div>

            {/* Privacy note */}
            <p className="privacy-note">
              🔒{' '}
              {lang === 'te'
                ? 'మీ వివరాలు పంచాయతీ సెక్రటరీకి మాత్రమే పంపబడతాయి.'
                : 'Your details are shared only with the Municipality Office.'}
            </p>
          </section>
        )}
      </div>

      {/* ══ Bottom navigation bar ════════════════════════ */}
      <div className="report-footer">
        {step > 1 && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
            disabled={submitting}
          >
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none">
              <path
                d="M12 4l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {lang === 'te' ? 'వెనుకకు' : 'Back'}
          </button>
        )}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            className={`btn btn-primary${step === 1 ? ' btn-full' : ''}`}
            style={{ flex: step > 1 ? 1 : undefined }}
            onClick={handleNext}
          >
            {lang === 'te' ? 'తదుపరి' : 'Next'}
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none">
              <path
                d="M8 4l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner" />
                {lang === 'te' ? 'సమర్పిస్తున్నాం...' : 'Submitting…'}
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none">
                  <path
                    d="M3 10l5 5 9-9"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {lang === 'te' ? 'నివేదన సమర్పించండి' : 'Submit Report'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}