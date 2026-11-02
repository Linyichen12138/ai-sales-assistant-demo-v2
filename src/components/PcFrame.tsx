import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { create } from 'zustand'
import { useDemo } from '../store/demo'
import { useRoleSwitch } from './useRoleSwitch'
import { Logo } from './Logo'
import { Icon } from './Icon'
import { IMG } from '../mock/images'
import { PRODUCT_NAME, PROJECT_NAME } from '../mock/data'

export const useRange = create<{ range: string; setRange: (r: string) => void }>((set) => ({ range: '今日', setRange: (range) => set({ range }) }))

function useFit() {
  const calc = () => Math.min((window.innerWidth - 24) / 1920, (window.innerHeight - 56 - 20) / 1080)
  const [s, setS] = useState(calc)
  useEffect(() => {
    const f = () => setS(calc())
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  })
  return s
}

export function useMockClock() {
  const s = useDemo()
  if (s.feedbackWritten) return '16:30'
  if (s.guidanceSent) return '11:05'
  if (s.blockerMarked) return '11:02'
  if (s.receptionStarted) return '10:50'
  return '10:20'
}

const SIDE = [
  { k: '驾驶舱', icon: 'grid', to: '/m01' },
  { k: '作战室', icon: 'target', to: '/m02' },
  { k: '客户', icon: 'users', to: '/s01' },
  { k: '团队', icon: 'chart', to: '/m05' },
  { k: '四盘一控', icon: 'layers', to: '/m01?panel=fourpan' },
]

export function PcFrame({ title, active, children, subtitle, zoom }: { title: string; active: string; children: ReactNode; subtitle?: ReactNode; zoom?: number }) {
  const scale = useFit()
  const nav = useNavigate()
  const toast = useDemo((s) => s.toast)
  const role = useDemo((s) => s.role)
  const { range, setRange } = useRange()
  const clock = useMockClock()
  const [dd, setDd] = useState(false)
  const sw = useRoleSwitch()
  const showToast = useDemo((s) => s.showToast)
  return (
    <div className="stage stage-pc">
      <div className="pc-wrap" style={{ width: 1920 * scale, height: 1080 * scale }}>
        <div className="pc" style={{ transform: `scale(${scale})` }} id="pc-canvas">
          <header className="pc-top">
            <div className="pt-left">
              <Logo size={34} />
              <b className="pt-name">{PRODUCT_NAME}</b>
              <span className="pt-proj">{PROJECT_NAME} <Icon name="down" size={14} /></span>
              <button className="pt-role" data-testid="pc-role-pill" onClick={() => setDd(!dd)}>
                {role === 'manager' ? '销售经理 / 陈经理' : '销售顾问 / 张顾问'} <Icon name="down" size={14} />
              </button>
              {dd && (
                <div className="pt-dd" data-testid="pc-role-dd">
                  <button className={role === 'manager' ? 'on' : ''} onClick={() => { setDd(false); sw('manager') }}><Icon name="users" size={16} />销售经理{role === 'manager' && <Icon name="check" size={16} color="#2FD4C0" style={{ marginLeft: 'auto' }} />}</button>
                  <button data-testid="pc-dd-consultant" className={role === 'consultant' ? 'on' : ''} onClick={() => { setDd(false); sw('consultant') }}><Icon name="user" size={16} />销售顾问{role === 'consultant' && <Icon name="check" size={16} color="#2FD4C0" style={{ marginLeft: 'auto' }} />}</button>
                  <button onClick={() => { setDd(false); showToast('演示版本暂未开放该视角', 'info') }}><Icon name="chart" size={16} />销售负责人</button>
                  <p>切换后保留当前客户：林女士</p>
                </div>
              )}
            </div>
            <div className="pt-title"><span className="pt-deco" />{title}<span className="pt-deco r" /></div>
            <div className="pt-right">
              <div className="pt-range">
                {['今日', '近7日', '近30日'].map((r) => <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>{r}</button>)}
              </div>
              <span className="pt-clock"><Icon name="clock" size={16} />2026-10-27 {clock}</span>
              <Icon name="bell" size={20} color="#A8B3DE" />
              <img className="pt-av" src={role === 'manager' ? IMG.avChen : IMG.avZhang} alt="" />
            </div>
          </header>
          <aside className="pc-side">
            {SIDE.map((s) => (
              <button key={s.k} className={active === s.k ? 'on' : ''} onClick={() => nav(s.to)} data-testid={`side-${s.k}`}>
                <Icon name={s.icon} size={24} />{s.k}
              </button>
            ))}
            <div className="side-foot">
              <span className="dot-live" />实时状态 · 在线 3 人
            </div>
          </aside>
          <main className="pc-main" style={zoom ? ({ ['--z' as string]: zoom } as CSSProperties) : undefined}>
            {subtitle}
            {children}
          </main>
          {toast && <div className="pc-toast" key={toast.id} data-testid="toast"><Icon name="check" size={18} color="#2FD4C0" stroke={2.6} />{toast.text}</div>}
        </div>
      </div>
    </div>
  )
}

export function Panel({ title, extra, children, className = '', style }: { title?: ReactNode; extra?: ReactNode; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section className={`panel ${className}`} style={style}>
      {title && <div className="panel-hd"><span className="ph-bar" />{title}<span className="panel-extra">{extra}</span></div>}
      {children}
    </section>
  )
}

export function Drawer({ title, onClose, children, footer, testid }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode; testid?: string }) {
  return (
    <div className="pc-mask" onClick={onClose}>
      <div className="pc-drawer" onClick={(e) => e.stopPropagation()} data-testid={testid}>
        <div className="dw-hd"><b>{title}</b><button onClick={onClose}><Icon name="close" size={22} color="#A8B3DE" /></button></div>
        <div className="dw-body">{children}</div>
        {footer && <div className="dw-ft">{footer}</div>}
      </div>
    </div>
  )
}

export function Modal({ title, onClose, children, footer, testid, width = 640 }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode; testid?: string; width?: number }) {
  return (
    <div className="pc-mask center" onClick={onClose}>
      <div className="pc-modal" style={{ width }} onClick={(e) => e.stopPropagation()} data-testid={testid}>
        <div className="dw-hd"><b>{title}</b><button onClick={onClose}><Icon name="close" size={22} color="#A8B3DE" /></button></div>
        <div className="md-body">{children}</div>
        {footer && <div className="dw-ft">{footer}</div>}
      </div>
    </div>
  )
}
