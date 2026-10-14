import React from 'react';
import './SeverityBadge.css'; // We will create this next

export default function SeverityBadge({ score }) {
  // If the score is missing or exactly 0, it means no hazard was detected
  if (score === undefined || score === null || score === 0) {
    return <span className="badge badge-none">Safe (0)</span>;
  }

  let hazardLevel = '';
  let colorClass = '';

  if (score >= 75) {
    hazardLevel = 'Critical';
    colorClass = 'badge-critical';
  } else if (score >= 50) {
    hazardLevel = 'High';
    colorClass = 'badge-high';
  } else if (score >= 25) {
    hazardLevel = 'Moderate';
    colorClass = 'badge-moderate';
  } else {
    hazardLevel = 'Low';
    colorClass = 'badge-low';
  }

  return (
    <span className={`badge ${colorClass}`}>
      {hazardLevel} • {score}
    </span>
  );
}