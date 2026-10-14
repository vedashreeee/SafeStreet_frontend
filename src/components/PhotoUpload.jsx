/* PhotoUpload.jsx — Camera-only + GPS geotagged evidence */

import imageCompression from 'browser-image-compression'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

export default function PhotoUpload({ lang, value, onChange }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [cameraOpen, setCameraOpen] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gps, setGps] = useState(null)

  const tx = (en, te) => lang === 'te' ? te : en

  /* ─────────────────────────────────────────────
     Stop camera completely
  ───────────────────────────────────────────── */
  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    setCameraOpen(false)
  }

  /* ─────────────────────────────────────────────
     Get GPS position
     GPS is REQUIRED for evidence capture
  ───────────────────────────────────────────── */
  function getCurrentGPS() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        error => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    })
  }

  /* ─────────────────────────────────────────────
     Open LIVE camera
  ───────────────────────────────────────────── */
  async function openCamera() {
    try {
      setGpsLoading(true)

      /*
       * Get GPS before allowing evidence capture.
       * maximumAge: 0 means don't intentionally use an old cached position.
       */
      const currentGPS = await getCurrentGPS()

      setGps(currentGPS)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      streamRef.current = stream
setCameraOpen(true)

    } catch (error) {
      console.error('Camera/GPS error:', error)

      if (error?.code === 1) {
        toast.error(
          tx(
            'Location permission is required to capture evidence.',
            'సాక్ష్యం కోసం లొకేషన్ అనుమతి తప్పనిసరి.'
          )
        )
      } else if (error?.name === 'NotAllowedError') {
        toast.error(
          tx(
            'Camera permission is required.',
            'కెమెరా అనుమతి తప్పనిసరి.'
          )
        )
      } else {
        toast.error(
          tx(
            'Unable to access camera or GPS. Please enable both permissions.',
            'కెమెరా మరియు GPS అనుమతులను ప్రారంభించండి.'
          )
        )
      }
    } finally {
      setGpsLoading(false)
    }
  }

  /* ─────────────────────────────────────────────
     Capture LIVE camera frame
  ───────────────────────────────────────────── */
  async function capturePhoto() {
  const video = videoRef.current

  if (!video || !streamRef.current) {
    toast.error(
      tx(
        'Camera is not ready.',
        'కెమెరా సిద్ధంగా లేదు.'
      )
    )
    return
  }

  if (!gps) {
    toast.error(
      tx(
        'GPS location is required before capturing.',
        'ఫోటో తీయడానికి GPS లొకేషన్ అవసరం.'
      )
    )
    return
  }

  try {
    setIsCompressing(true)

    // Make sure the live camera has actually produced video frames
    if (video.readyState < 2) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Camera video did not become ready'))
        }, 5000)

        video.onloadeddata = () => {
          clearTimeout(timeout)
          resolve()
        }
      })
    }

    // Make sure the camera has real dimensions
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error('Camera frame has no dimensions')
    }

    // Get a fresh GPS reading at capture time
    const captureGPS = await getCurrentGPS()

    const canvas = document.createElement('canvas')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas is not supported')
    }

    // Capture the CURRENT LIVE CAMERA FRAME
    ctx.drawImage(
      video,
      0,
      0,
      video.videoWidth,
      video.videoHeight
    )

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        result => {
          if (result) {
            resolve(result)
          } else {
            reject(new Error('Could not create image'))
          }
        },
        'image/jpeg',
        0.92
      )
    })

    const originalFile = new File(
      [blob],
      `safestreet-${Date.now()}.jpg`,
      {
        type: 'image/jpeg',
        lastModified: Date.now()
      }
    )

    const compressedFile = await imageCompression(
      originalFile,
      {
        maxSizeMB: 1,
        maxWidthOrHeight: 1280,
        useWebWorker: true
      }
    )

    const preview = URL.createObjectURL(compressedFile)

    const capturedAt = new Date().toISOString()

    onChange({
      file: compressedFile,
      preview,

      captureLocation: {
        lat: captureGPS.lat,
        lng: captureGPS.lng,
        accuracy: captureGPS.accuracy
      },

      capturedAt,

      captureMethod: 'live_camera',

      geolocationCaptured: true
    })

    stopCamera()

    toast.success(
      tx(
        'Evidence captured with GPS location.',
        'GPS లొకేషన్‌తో సాక్ష్య ఫోటో తీసుకోబడింది.'
      )
    )

  } catch (error) {
    console.error('Capture error:', error)

    toast.error(
      tx(
        'Camera is not ready yet. Please wait a moment and try again.',
        'కెమెరా ఇంకా సిద్ధంగా లేదు. కొద్దిసేపు వేచి మళ్లీ ప్రయత్నించండి.'
      )
    )
  } finally {
    setIsCompressing(false)
  }
}

  /* ─────────────────────────────────────────────
     Remove captured photo
  ───────────────────────────────────────────── */
  function handleRemove() {
    if (value?.preview) {
      URL.revokeObjectURL(value.preview)
    }

    setGps(null)
    onChange(null)
  }
/* ─────────────────────────────────────────────
   Attach camera stream after video element renders
   ───────────────────────────────────────────── */
useEffect(() => {
  if (!cameraOpen || !streamRef.current || !videoRef.current) {
    return
  }

  const video = videoRef.current
  const stream = streamRef.current

  video.srcObject = stream

  const startVideo = async () => {
    try {
      await video.play()
    } catch (error) {
      console.error('Camera playback error:', error)
    }
  }

  if (video.readyState >= 1) {
    startVideo()
  } else {
    video.onloadedmetadata = startVideo
  }

  return () => {
    video.onloadedmetadata = null
  }
}, [cameraOpen])


  /* ─────────────────────────────────────────────
     Cleanup camera when component closes
  ───────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      if (value?.preview) {
        URL.revokeObjectURL(value.preview)
      }
    }
  }, [])

  /* ─────────────────────────────────────────────
     PHOTO ALREADY CAPTURED
  ───────────────────────────────────────────── */
  if (value?.preview) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>

        <div className="photo-preview-wrap">
          <img
            src={value.preview}
            alt="Evidence photo"
          />

          <button
            type="button"
            className="photo-remove-btn"
            onClick={handleRemove}
            aria-label={tx(
              'Retake photo',
              'ఫోటో మళ్లీ తీయండి'
            )}
          >
            ✕
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '12px',
          borderRadius: '10px',
          background: '#eef7f0',
          border: '1px solid #c8dfcc'
        }}>

          <div style={{
            fontWeight: 700,
            color: 'var(--forest)',
            marginBottom: '6px'
          }}>
            ✓ {tx(
              'Live camera photo captured',
              'లైవ్ కెమెరా ఫోటో తీసుకోబడింది'
            )}
          </div>

          {value.captureLocation && (
            <div style={{
              fontSize: '0.78rem',
              color: 'var(--ink-subtle)',
              lineHeight: 1.6
            }}>
              <div>
                📍 {value.captureLocation.lat.toFixed(6)},
                {' '}
                {value.captureLocation.lng.toFixed(6)}
              </div>

              <div>
                🎯 GPS accuracy:
                {' '}
                {Math.round(value.captureLocation.accuracy)} m
              </div>

              <div>
                🕐 {new Date(value.capturedAt).toLocaleString()}
              </div>

              <div style={{
                marginTop: '4px',
                fontWeight: 600
              }}>
                ✓ {tx(
                  'GPS captured at photo time',
                  'ఫోటో తీసిన సమయంలో GPS నమోదు చేయబడింది'
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────
     COMPRESSION / PROCESSING
  ───────────────────────────────────────────── */
  if (isCompressing) {
    return (
      <div
        className="photo-upload-zone"
        style={{ cursor: 'wait' }}
      >
        <span
          className="spinner"
          style={{
            marginBottom: '10px',
            width: '30px',
            height: '30px'
          }}
        />

        <p className="photo-upload-title">
          {tx(
            'Securing Evidence...',
            'సాక్ష్యాన్ని భద్రపరుస్తున్నాం...'
          )}
        </p>

        <p className="photo-upload-sub">
          {tx(
            'Capturing GPS and preparing photo',
            'GPS మరియు ఫోటో వివరాలను నమోదు చేస్తున్నాం'
          )}
        </p>
      </div>
    )
  }

  /* ─────────────────────────────────────────────
     LIVE CAMERA VIEW
  ───────────────────────────────────────────── */
  if (cameraOpen) {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>

        <div style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '14px',
          background: '#000'
        }}>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              display: 'block',
              aspectRatio: '16 / 9',
              objectFit: 'cover'
            }}
          />

          {/* LIVE indicator */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 9px',
            borderRadius: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444'
            }} />

            LIVE
          </div>

          {/* GPS indicator */}
          {gps && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.72)',
              color: '#fff',
              fontSize: '0.72rem'
            }}>
              📍 GPS locked for capture
              <br />
              {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}
              {' · '}
              ±{Math.round(gps.accuracy)}m
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '10px'
        }}>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={stopCamera}
            style={{ flex: 1 }}
          >
            {tx('Cancel', 'రద్దు')}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={capturePhoto}
            disabled={isCompressing || !gps}
            style={{ flex: 2 }}
          >
            📸 {tx(
              'Capture Evidence',
              'సాక్ష్య ఫోటో తీయండి'
            )}
          </button>

        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--ink-subtle)',
          margin: 0
        }}>
          🔒 {tx(
            'Photo must be captured live. Gallery upload is disabled.',
            'ఫోటో తప్పనిసరిగా లైవ్ కెమెరాతో తీయాలి. గ్యాలరీ అప్‌లోడ్ నిలిపివేయబడింది.'
          )}
        </p>
      </div>
    )
  }

  /* ─────────────────────────────────────────────
     CAMERA START SCREEN
  ───────────────────────────────────────────── */
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>

      <div
        className="photo-upload-zone"
        role="button"
        tabIndex={0}
        onClick={openCamera}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            openCamera()
          }
        }}
        style={{
          padding: '34px 16px',
          cursor: 'pointer'
        }}
      >

        <div
          className="photo-upload-icon"
          style={{ fontSize: '2.5rem' }}
        >
          📸
        </div>

        <p
          className="photo-upload-title"
          style={{ fontSize: '1.1rem' }}
        >
          {tx(
            'Open Camera',
            'కెమెరా తెరవండి'
          )}
        </p>

        <p
          className="photo-upload-sub"
          style={{
            fontSize: '0.78rem',
            marginTop: '5px'
          }}
        >
          {tx(
            'Live camera capture required',
            'లైవ్ కెమెరాతో ఫోటో తీయడం తప్పనిసరి'
          )}
        </p>

      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        fontSize: '0.75rem',
        color: 'var(--ink-subtle)'
      }}>
        <span>📷 {tx('Live camera', 'లైవ్ కెమెరా')}</span>
        <span>•</span>
        <span>📍 {tx('GPS required', 'GPS తప్పనిసరి')}</span>
        <span>•</span>
        <span>🕐 {tx('Timestamped', 'సమయం నమోదు')}</span>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '10px',
        borderRadius: '8px',
        background: '#fff8e5',
        border: '1px solid #ead49a',
        color: '#735b1a',
        fontSize: '0.75rem'
      }}>
        🔒 {tx(
          'For authenticity, photos must be captured live with camera and GPS enabled.',
          'ప్రామాణికత కోసం కెమెరా మరియు GPS ప్రారంభించి లైవ్ ఫోటో తప్పనిసరిగా తీయాలి.'
        )}
      </div>

      {gpsLoading && (
        <p style={{
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--ink-subtle)'
        }}>
          📍 {tx(
            'Checking GPS permission...',
            'GPS అనుమతిని తనిఖీ చేస్తున్నాం...'
          )}
        </p>
      )}

    </div>
  )
}