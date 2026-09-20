import React from "react";

interface LopiLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function LopiLogo({ className, ...props }: LopiLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="gradRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" /> {/* indigo-600 */}
          <stop offset="100%" stopColor="#0ea5e9" /> {/* sky-500 */}
        </linearGradient>
        <linearGradient id="gradGrid1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="gradGrid2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14b8a6" /> {/* teal-500 */}
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>

      {/* Outer Scanner Gantry (Tomography Ring) */}
      <circle 
        cx="60" cy="60" r="48" 
        stroke="url(#gradRing)" 
        strokeWidth="6" 
        strokeDasharray="70 15 15 15" 
        strokeLinecap="round" 
        fill="none" 
        opacity="0.9" 
        className="drop-shadow-sm"
      />
      
      {/* Inner Data Track */}
      <circle 
        cx="60" cy="60" r="38" 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
        strokeDasharray="4 6" 
        fill="none" 
        opacity="0.6" 
      />

      {/* Reconstructed Image Matrix (Pixels/Voxels) */}
      <g transform="translate(41, 41)">
        {/* Top Row */}
        <rect x="0" y="0" width="10" height="10" rx="2" fill="url(#gradGrid1)" opacity="0.3" />
        <rect x="14" y="0" width="10" height="10" rx="2" fill="url(#gradGrid1)" opacity="0.6" />
        <rect x="28" y="0" width="10" height="10" rx="2" fill="url(#gradGrid1)" opacity="0.9" />
        {/* Middle Row */}
        <rect x="0" y="14" width="10" height="10" rx="2" fill="url(#gradGrid1)" opacity="0.5" />
        <rect x="14" y="14" width="10" height="10" rx="2" fill="url(#gradGrid2)" opacity="1.0" />
        <rect x="28" y="14" width="10" height="10" rx="2" fill="url(#gradGrid2)" opacity="0.8" />
        {/* Bottom Row */}
        <rect x="0" y="28" width="10" height="10" rx="2" fill="url(#gradGrid1)" opacity="0.8" />
        <rect x="14" y="28" width="10" height="10" rx="2" fill="url(#gradGrid2)" opacity="0.9" />
        <rect x="28" y="28" width="10" height="10" rx="2" fill="url(#gradGrid2)" opacity="0.4" />
      </g>

      {/* Scanner Beams (Projections) */}
      <path d="M 12 60 L 34 60" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M 108 60 L 86 60" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M 60 12 L 60 34" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M 60 108 L 60 86" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      
      {/* Diagonal Projections */}
      <path d="M 26 26 L 40 40" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M 94 94 L 80 80" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M 26 94 L 40 80" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M 94 26 L 80 40" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}
