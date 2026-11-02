import type { ReactNode } from 'react'

type Seg = { label: string; value: number; color: string }

export function Donut({ data, size = 160, thick = 22, center, onPick }: { data: Seg[]; size?: number; thick?: number; center?: ReactNode; onPick?: (label: string) => void }) {
  const r = (size - thick) / 2
  const c = 2 * Math.PI * r
  const total = data.reduce((a, b) => a + b.value, 0)
  let acc = 0
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(120,140,255,.12)" strokeWidth={thick} />
        {data.map((d) => {
          const len = (d.value / total) * c
          const el = (
            <circle key={d.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color} strokeWidth={thick}
              strokeDasharray={`${Math.max(len - 2, 0)} ${c - Math.max(len - 2, 0)}`} strokeDashoffset={-acc}
              style={onPick ? { cursor: 'pointer', pointerEvents: 'stroke' } : undefined} onClick={onPick ? () => onPick(d.label) : undefined} data-testid={onPick ? `seg-${d.label}` : undefined} />
          )
          acc += len
          return el
        })}
      </svg>
      {center && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{center}</div>}
    </div>
  )
}

export function Ring({ value, size = 120, thick = 10, color = 'url(#ringGrad)', track = 'rgba(120,140,255,.16)', children }: { value: number; size?: number; thick?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - thick) / 2
  const c = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2FD4C0" />
            <stop offset="1" stopColor="#3B6BFF" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thick} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  )
}

export function LineChart({ labels, series, w = 400, h = 160, max, area = true, dark = true }: { labels: string[]; series: { data: number[]; color: string; name?: string }[]; w?: number; h?: number; max?: number; area?: boolean; dark?: boolean }) {
  const fs = dark ? 14 : 10
  const pad = dark ? { l: 40, r: 26, t: 12, b: 30 } : { l: 30, r: 10, t: 12, b: 24 }
  const mx = max ?? Math.ceil(Math.max(...series.flatMap((s) => s.data)) * 1.2)
  const iw = w - pad.l - pad.r
  const ih = h - pad.t - pad.b
  const x = (i: number) => pad.l + (iw * i) / Math.max(labels.length - 1, 1)
  const y = (v: number) => pad.t + ih - (v / mx) * ih
  const grid = dark ? 'rgba(120,140,255,.14)' : '#E8ECF5'
  const txt = dark ? '#6F7AA8' : '#9AA1B2'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: '100%', height: 'auto', display: 'block', flexShrink: 0 }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={w - pad.r} y1={pad.t + ih * t} y2={pad.t + ih * t} stroke={grid} strokeDasharray="3 4" />
          <text x={pad.l - 6} y={pad.t + ih * t + 4} fontSize={fs} fill={txt} textAnchor="end">{Math.round(mx * (1 - t))}</text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={l + i} x={x(i)} y={h - 6} fontSize={fs} fill={txt} textAnchor="middle">{l}</text>
      ))}
      {series.map((s, si) => {
        const pts = s.data.map((v, i) => `${x(i)},${y(v)}`).join(' ')
        const gid = `lg${si}${s.color.replace('#', '')}`
        return (
          <g key={si}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={s.color} stopOpacity=".35" />
                <stop offset="1" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {area && <polygon points={`${x(0)},${pad.t + ih} ${pts} ${x(s.data.length - 1)},${pad.t + ih}`} fill={`url(#${gid})`} />}
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.2" />
            {s.data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === s.data.length - 1 ? 4 : 2.5} fill={s.color} stroke={dark ? '#13215C' : '#fff'} strokeWidth="1.5" />)}
          </g>
        )
      })}
    </svg>
  )
}

export function BarChart({ labels, data, w = 400, h = 150, color = '#3B6BFF', color2 = '#2FD4C0', data2 }: { labels: string[]; data: number[]; data2?: number[]; w?: number; h?: number; color?: string; color2?: string }) {
  const pad = { l: 26, r: 8, t: 10, b: 30 }
  const mx = Math.ceil(Math.max(...data, ...(data2 ?? [])) * 1.2)
  const iw = w - pad.l - pad.r
  const ih = h - pad.t - pad.b
  const bw = iw / labels.length
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: '100%', height: 'auto', display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} /><stop offset="1" stopColor={color} stopOpacity=".35" /></linearGradient>
        <linearGradient id="barG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color2} /><stop offset="1" stopColor={color2} stopOpacity=".35" /></linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => <line key={t} x1={pad.l} x2={w - pad.r} y1={pad.t + ih * t} y2={pad.t + ih * t} stroke="rgba(120,140,255,.14)" strokeDasharray="3 4" />)}
      {labels.map((l, i) => {
        const v = data[i]
        const bh = (v / mx) * ih
        const one = data2 ? bw * 0.26 : bw * 0.45
        const x0 = pad.l + bw * i + (bw - (data2 ? one * 2 + 3 : one)) / 2
        return (
          <g key={l + i}>
            <rect x={x0} y={pad.t + ih - bh} width={one} height={bh} rx="3" fill="url(#barG)" />
            {data2 && <rect x={x0 + one + 3} y={pad.t + ih - (data2[i] / mx) * ih} width={one} height={(data2[i] / mx) * ih} rx="3" fill="url(#barG2)" />}
            <text x={pad.l + bw * i + bw / 2} y={h - 6} fontSize="14" fill="#6F7AA8" textAnchor="middle">{l}</text>
          </g>
        )
      })}
    </svg>
  )
}

export function Spark({ data, w = 120, h = 40, color = '#2FD4C0' }: { data: number[]; w?: number; h?: number; color?: string }) {
  const mn = Math.min(...data) - 2
  const mx = Math.max(...data) + 2
  const pts = data.map((v, i) => `${(w * i) / (data.length - 1)},${h - ((v - mn) / (mx - mn)) * h}`).join(' ')
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" />
      {data.map((v, i) => <circle key={i} cx={(w * i) / (data.length - 1)} cy={h - ((v - mn) / (mx - mn)) * h} r="3" fill={color} />)}
    </svg>
  )
}
