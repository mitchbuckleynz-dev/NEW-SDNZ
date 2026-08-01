/**
 * Head Start tool glyphs — direction B, "Technical".
 *
 * Bespoke, not stock. Each carries the dimension arrow that names what its tool
 * measures: the spacing between two heads, the clearance from a beam to a
 * sprinkler, a dimension on a sheet, the flat run under a pitched pipe.
 *
 * Shared by /tools and the home page strip so the two cannot drift. Kept in
 * sync with sdnz-app `src/home/HomeScreen.jsx` — if one changes, change both.
 * Do not substitute lucide here: its nearest matches read as a stock-chart
 * arrow and a layout-columns glyph.
 */
export type ToolId = 'spacing' | 'obstruction' | 'scale' | 'slope';

export function ToolIcon({ id, className = 'w-7 h-7' }: { id: string; className?: string }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', className, 'aria-hidden': true } as const;

  if (id === 'scale')
    return (
      <svg {...common}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6.5 16.5h11" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.1 15.1L6.5 16.5l1.6 1.4M15.9 15.1L17.5 16.5l-1.6 1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 6.5h7v5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );

  if (id === 'slope')
    return (
      <svg {...common}>
        <path d="M3 18L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M3 18h17V7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M17.2 18v-2.8h2.8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.6 18a6.4 6.4 0 001-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );

  if (id === 'spacing')
    return (
      <svg {...common}>
        <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8" cy="12" r="2.2" fill="currentColor" />
        <circle cx="16" cy="12" r="2.2" fill="currentColor" />
        <path d="M8 7.5h8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.6 6.1L8 7.5l1.6 1.4M14.4 6.1L16 7.5l-1.6 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

  // Obstruction — sprinkler and beam in section, clearance dimensioned.
  return (
    <svg {...common}>
      <path d="M2 4h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="3" y="4" width="6" height="7" fill="currentColor" />
      <path d="M17 4v4.5" stroke="currentColor" strokeWidth="2" />
      <path d="M13.6 9.6h6.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9 15.5h8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.6 14.1L9 15.5l1.6 1.4M15.4 14.1L17 15.5l-1.6 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const TOOL_IDS: ToolId[] = ['spacing', 'obstruction', 'scale', 'slope'];
