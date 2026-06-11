/* StepIndicator.jsx — Fixed step bar with proper done/active states */
export default function StepIndicator({ current, total, labels }) {
  return (
    <div className="step-indicator">
      <div className="step-track">
        {Array.from({ length: total }, (_, i) => {
          const num      = i + 1
          const isDone   = num < current
          const isActive = num === current

          return (
            <div key={num} style={{ display: 'contents' }}>
              {/* Node */}
              <div className="step-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  className={
                    'step-circle' +
                    (isDone   ? ' is-done'   : '') +
                    (isActive ? ' is-active' : '')
                  }
                  aria-label={labels[i]}
                >
                  {isDone ? (
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                      <path
                        d="M3 8l3.5 3.5 6.5-7"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    num
                  )}
                </div>
                <span
                  className={
                    'step-label' +
                    (isDone   ? ' is-done'   : '') +
                    (isActive ? ' is-active' : '')
                  }
                >
                  {labels[i]}
                </span>
              </div>

              {/* Connector line */}
              {num < total && (
                <div
                  className={'step-line' + (isDone ? ' is-done' : '')}
                  style={{ marginBottom: 16 /* align with circle center */ }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}