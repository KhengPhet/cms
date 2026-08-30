const PALETTES: [string, string, string][] = [
  ['#4f46e5', '#7c3aed', '#0ea5e9'],
  ['#ef4444', '#f97316', '#f43f5e'],
  ['#059669', '#10b981', '#06b6d4'],
  ['#d97706', '#f59e0b', '#f43f5e'],
  ['#2563eb', '#06b6d4', '#6366f1'],
  ['#7c3aed', '#db2777', '#f59e0b'],
  ['#0f766e', '#14b8a6', '#6366f1'],
  ['#b91c1c', '#ef4444', '#fb923c'],
  ['#4338ca', '#4f46e5', '#06b6d4'],
  ['#0369a1', '#2563eb', '#7c3aed'],
  ['#15803d', '#16a34a', '#0ea5e9'],
  ['#9a3412', '#ea580c', '#eab308']
]

export function gradientImage(index: number, label?: string): string {
  const palette = PALETTES[index % PALETTES.length]
  const id = `g${index}`
  const title = label ?? 'P CMS'
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette[0]}"/>
      <stop offset="55%" stop-color="${palette[1]}"/>
      <stop offset="100%" stop-color="${palette[2]}"/>
    </linearGradient>
    <pattern id="dots${index}" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(14)">
      <circle cx="2" cy="2" r="1.6" fill="rgba(255,255,255,0.14)"/>
    </pattern>
  </defs>
  <rect width="800" height="450" fill="url(#${id})" rx="0"/>
  <rect width="800" height="450" fill="url(#dots${index})"/>
  <circle cx="${90 + (index % 7) * 90}" cy="${120 + (index % 5) * 60}" r="150" fill="rgba(255,255,255,0.08)"/>
  <circle cx="${620 - (index % 6) * 70}" cy="${350 - (index % 4) * 70}" r="110" fill="rgba(0,0,0,0.10)"/>
  <text x="40" y="390" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="rgba(255,255,255,0.95)">${title}</text>
  <text x="40" y="362" font-family="Arial, sans-serif" font-size="18" letter-spacing="4" fill="rgba(255,255,255,0.70)">${('Global Platform').toUpperCase()}</text>
</svg>`.trim()
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function solidImage(color: string, label: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="${color}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="42" font-weight="700" fill="rgba(255,255,255,0.9)">${label}</text>
</svg>`.trim()
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const FLAG_EMOJI: Record<string, string> = {
  us: '🇺🇸',
  eu: '🇪🇺',
  asia: '🌏',
  cn: '🇨🇳',
  jp: '🇯🇵',
  kr: '🇰🇷',
  asean: '🌏',
  kh: '🇰🇭'
}

export function avatarImage(seed: number): string {
  const palette = PALETTES[seed % PALETTES.length]
  const initials = ['SM', 'DR', 'TL', 'NC', 'AB', 'YK', 'MP', 'JS', 'CW', 'RH', 'SO', 'LA'][seed % 12]
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="a${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette[0]}"/>
      <stop offset="100%" stop-color="${palette[2]}"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" fill="url(#a${seed})"/>
  <text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="Arial" font-size="56" font-weight="700" fill="rgba(255,255,255,0.95)">${initials}</text>
</svg>`.trim()
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}