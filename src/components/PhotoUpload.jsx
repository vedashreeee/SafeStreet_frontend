/* PhotoUpload.jsx — Navy/Gold design system */
import imageCompression from 'browser-image-compression';
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

export default function PhotoUpload({ lang, value, onChange }) {
  const cameraRef = useRef(null)
  const galleryRef = useRef(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const tx = (en, te) => lang === 'te' ? te : en

  async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error(tx('Please select an image file', 'దయచేసి చిత్రం ఎంచుకోండి'))
      return
    }

    setIsCompressing(true)

    try {
      // 🛡️ The Armor: Compress the image before it touches the backend
      const options = {
        maxSizeMB: 1,           // Shrink to max 1MB
        maxWidthOrHeight: 1280, // Resize 4K images to standard HD
        useWebWorker: true      // Don't freeze the UI while compressing
      }

      const compressedFile = await imageCompression(file, options)
      const preview = URL.createObjectURL(compressedFile)
      
      onChange({ file: compressedFile, preview })

    } catch (error) {
      console.error("Compression error:", error)
      // Fallback: If compression fails for some reason, try the original file
      const preview = URL.createObjectURL(file)
      onChange({ file, preview })
    } finally {
      setIsCompressing(false)
    }
  }

  function handleInputChange(e) {
    handleFile(e.target.files?.[0])
    e.target.value = '' // Reset input so the same file can be selected again if needed
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  function handleRemove() {
    if (value?.preview) URL.revokeObjectURL(value.preview)
    onChange(null)
  }

  /* ── Photo already chosen ────────────────────────────── */
  if (value?.preview) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="photo-preview-wrap">
          <img src={value.preview} alt="Evidence photo" />
          <button
            type="button"
            className="photo-remove-btn"
            onClick={handleRemove}
            aria-label={tx('Remove photo', 'ఫోటో తీసివేయండి')}
          >
            ✕
          </button>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--forest)', textAlign: 'center' }}>
          ✓ {tx('Photo added', 'ఫోటో జోడించబడింది')}
        </p>
      </div>
    )
  }

  /* ── Loading State (During Compression) ──────────────── */
  if (isCompressing) {
    return (
      <div className="photo-upload-zone" style={{ cursor: 'wait' }}>
        <span className="spinner" style={{ marginBottom: '10px', width: '30px', height: '30px' }} />
        <p className="photo-upload-title">
          {tx('Optimizing Photo...', 'ఫోటోను సిద్ధం చేస్తున్నాం...')}
        </p>
      </div>
    )
  }

  /* ── Upload zone ─────────────────────────────────────── */
  return (
    <>
      {/* Input 1: Forces the Camera to open on mobile */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {/* Input 2: Opens the regular file gallery */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      <div 
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Camera Button */}
        <div
          className="photo-upload-zone"
          role="button"
          tabIndex={0}
          onClick={() => cameraRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && cameraRef.current?.click()}
          style={{ padding: '24px 12px', height: '100%' }}
        >
          <div className="photo-upload-icon">📸</div>
          <p className="photo-upload-title" style={{ fontSize: '1rem' }}>
            {tx('Camera', 'కెమెరా')}
          </p>
          <p className="photo-upload-sub" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
            {tx('Take a photo', 'ఫోటో తీయండి')}
          </p>
        </div>

        {/* Gallery Button */}
        <div
          className="photo-upload-zone"
          role="button"
          tabIndex={0}
          onClick={() => galleryRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && galleryRef.current?.click()}
          style={{ padding: '24px 12px', height: '100%' }}
        >
          <div className="photo-upload-icon">📁</div>
          <p className="photo-upload-title" style={{ fontSize: '1rem' }}>
            {tx('Gallery', 'గ్యాలరీ')}
          </p>
          <p className="photo-upload-sub" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
            {tx('Upload file', 'ఫైల్ అప్‌లోడ్ చేయండి')}
          </p>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--ink-subtle)', marginTop: 8 }}>
        <span className="photo-upload-badge" style={{ marginRight: '8px' }}>
          {tx('Optional', 'ఐచ్ఛికం')}
        </span>
        {tx('You can submit without a photo', 'ఫోటో లేకుండా సమర్పించవచ్చు')}
      </p>
    </>
  )
}