import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemo } from '../store/demo'
import { useRoleSwitch } from './useRoleSwitch'
import { Logo } from './Logo'
import { Icon } from './Icon'
import { IMG } from '../mock/images'
import { PROJECT_NAME } from '../mock/data'

function useFit(w: number, h: number, offset = 0) {
  const calc = () => Math.min(1, (window.innerHeight - 56 - 32 - offset) / h, (window.innerWidth - 40) / w)
  const [s, setS] = useState(calc)
  useEffect(() => {
    const f = () => setS(calc())
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  })
  return s
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const scale = useFit(375 + 24, 812 + 24)
  const toast = useDemo((s) => s.toast)
  const [sheet, setSheet] = useState(false)
  return (
    <div className="stage stage-phone">
      <div className="phone-wrap" style={{ transform: `scale(${scale})` }}>
        <div className="phone">
          <div className="ph-screen" id="ph-screen">
            <div className="ph-status">
              <b>9:41</b>
              <span className="ph-icons">
                <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1" fill="#1A1D2E" /><rect x="5" y="5" width="3" height="6" rx="1" fill="#1A1D2E" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" fill="#1A1D2E" /><rect x="15" y="0" width="3" height="11" rx="1" fill="#1A1D2E" /></svg>
                <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .4 10.3 10.3 0 0 0 .8 3.3L2 4.6a8.6 8.6 0 0 1 6-2.4zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 3.8 7 7 0 0 0 3.2 5.7l1.2 1.3c1-.9 2.2-1.4 3.6-1.4zM8 9l1.9-2a2.8 2.8 0 0 0-3.8 0z" fill="#1A1D2E" /></svg>
                <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="#1A1D2E" opacity=".4" /><rect x="2" y="2" width="19" height="8" rx="2" fill="#1A1D2E" /><rect x="23.5" y="4" width="1.8" height="4" rx=".9" fill="#1A1D2E" opacity=".4" /></svg>
              </span>
            </div>
            <div className="ph-rolebar">
              <Logo size={22} />
              <span className="ph-proj">{PROJECT_NAME} <Icon name="down" size={12} /></span>
              <button className="ph-rolepill" data-testid="phone-role-pill" onClick={() => setSheet(true)}>
                销售顾问 / 张顾问 <Icon name="down" size={12} />
              </button>
              <img className="ph-av" src={IMG.avZhang} alt="张顾问" />
            </div>
            {children}
            {toast && <div className="ph-toast" key={toast.id} data-testid="toast"><Icon name="check" size={14} color="#2FD4C0" stroke={2.6} />{toast.text}</div>}
            {sheet && <RoleSheet onClose={() => setSheet(false)} />}
          </div>
          <div className="ph-notch" />
        </div>
      </div>
    </div>
  )
}

function RoleSheet({ onClose }: { onClose: () => void }) {
  const sw = useRoleSwitch()
  const toast = useDemo((s) => s.showToast)
  const opts = [
    { k: '销售顾问', d: '接待、跟进、盘客', on: true, icon: 'user' },
    { k: '销售经理', d: '作战室、团队、接待分析', icon: 'users' },
    { k: '销售负责人', d: '经营报告与策略（演示未开放）', icon: 'chart' },
  ]
  return (
    <div className="ph-mask" onClick={onClose}>
      <div className="ph-sheet" onClick={(e) => e.stopPropagation()} data-testid="role-sheet">
        <div className="sheet-grip" />
        <div className="sheet-hd"><b>切换角色</b><button onClick={onClose}><Icon name="close" size={18} color="#9AA1B2" /></button></div>
        {opts.map((o) => (
          <button key={o.k} className={`role-opt ${o.on ? 'on' : ''}`} data-testid={`sheet-${o.k}`} onClick={() => {
            if (o.k === '销售经理') { onClose(); sw('manager') }
            else if (o.k === '销售负责人') { toast('演示版本暂未开放该视角', 'info') }
            else onClose()
          }}>
            <span className="ro-ic"><Icon name={o.icon} size={18} /></span>
            <span className="ro-tx"><b>{o.k}</b><small>{o.d}</small></span>
            {o.on ? <span className="ro-cur"><Icon name="check" size={14} stroke={2.6} />当前</span> : <Icon name="right" size={16} color="#9AA1B2" />}
          </button>
        ))}
        <p className="sheet-foot">切换后保留当前客户：林女士</p>
      </div>
    </div>
  )
}

/* ---------- 手机端通用组件 ---------- */

export function NavBar({ title, back, right, sub }: { title: ReactNode; back?: string | (() => void); right?: ReactNode; sub?: ReactNode }) {
  const nav = useNavigate()
  return (
    <div className="ph-nav">
      {back ? (
        <button className="nav-back" data-testid="nav-back" onClick={() => (typeof back === 'string' ? nav(back) : back())}><Icon name="back" size={22} /></button>
      ) : <span style={{ width: 28 }} />}
      <div className="nav-title">{title}{sub}</div>
      <div className="nav-right">{right}</div>
    </div>
  )
}

export function BottomNav({ active }: { active: string }) {
  const nav = useNavigate()
  const s = useDemo()
  const items = [
    { k: '工作台', icon: 'home', to: '/c01' },
    { k: '客户', icon: 'users', to: '/s01' },
    { k: '接待', icon: 'calendar', to: s.receptionStarted && !s.receptionEnded ? '/c04' : s.predictionReady ? '/c03' : '/c02' },
    { k: '盘客', icon: 'pie', to: '/c05' },
    { k: '我的', icon: 'user', to: '/me' },
  ]
  return (
    <div className="ph-tabbar">
      {items.map((i) => (
        <button key={i.k} className={active === i.k ? 'on' : ''} onClick={() => nav(i.to)} data-testid={`tab-${i.k}`}>
          <Icon name={i.icon} size={23} stroke={active === i.k ? 2.1 : 1.7} />
          <span>{i.k}</span>
        </button>
      ))}
    </div>
  )
}

export function Sheet({ title, onClose, children, footer, tag }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode; tag?: ReactNode }) {
  return (
    <div className="ph-mask" onClick={onClose}>
      <div className="ph-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        <div className="sheet-hd"><b>{title}</b>{tag}<button onClick={onClose} style={{ marginLeft: 'auto' }}><Icon name="close" size={18} color="#9AA1B2" /></button></div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-ft">{footer}</div>}
      </div>
    </div>
  )
}

export function Skeleton({ lines = 3, h = 12 }: { lines?: number; h?: number }) {
  return (
    <div className="skel">
      {Array.from({ length: lines }).map((_, i) => <div key={i} className="skel-line" style={{ height: h, width: `${i === lines - 1 ? 60 : 100 - i * 8}%` }} />)}
    </div>
  )
}

export function Check({ on, onClick, children, testid }: { on: boolean; onClick?: () => void; children: ReactNode; testid?: string }) {
  return (
    <button className={`chk ${on ? 'on' : ''}`} onClick={onClick} data-testid={testid}>
      <span className="chk-box">{on && <Icon name="check" size={12} color="#fff" stroke={3} />}</span>
      <span>{children}</span>
    </button>
  )
}
