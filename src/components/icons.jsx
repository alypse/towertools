/**
 * Inline SVG icons. Kept in the bundle rather than as asset files so they
 * inherit `currentColor` and therefore re-theme for free on every roll.
 */

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const SunIcon = props => (
  <svg {...base} {...props}>
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
  </svg>
);

export const MoonIcon = props => (
  <svg {...base} {...props}>
    <path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' />
  </svg>
);

export const DiceIcon = props => (
  <svg {...base} {...props}>
    <rect x='3' y='3' width='18' height='18' rx='4' />
    <circle cx='8.5' cy='8.5' r='1.2' fill='currentColor' stroke='none' />
    <circle cx='15.5' cy='15.5' r='1.2' fill='currentColor' stroke='none' />
    <circle cx='12' cy='12' r='1.2' fill='currentColor' stroke='none' />
  </svg>
);

export const StarIcon = ({ filled = false, ...props }) => (
  <svg {...base} fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d='m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z' />
  </svg>
);

export const SearchIcon = props => (
  <svg {...base} {...props}>
    <circle cx='11' cy='11' r='7' />
    <path d='m20 20-3.6-3.6' />
  </svg>
);

export const ExternalIcon = props => (
  <svg {...base} width={14} height={14} {...props}>
    <path d='M14 4h6v6M20 4l-8.5 8.5' />
    <path d='M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5' />
  </svg>
);

export const CloseIcon = props => (
  <svg {...base} width={16} height={16} {...props}>
    <path d='M6 6l12 12M18 6L6 18' />
  </svg>
);
