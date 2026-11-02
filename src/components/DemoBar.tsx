import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDemo } from '../store/demo'
import { STEPS, currentStep, flagsForStep, pageOf } from '../store/steps'
import { useRoleSwitch } from './useRoleSwitch'
import { Logo } from './Logo'
import { Icon } from './Icon'
import { IMG } from '../mock/images'

/** 常驻演示控制栏（演示用，非产品界面） */
export function DemoBar() {
  const role = useDemo((s) => s.role)
  const state = useDemo()
  const loc = useLocation()
  const nav = useNavigate()
  const sw = useRoleSwitch()
  const inferred = currentStep(loc.pathname, state)
  // 按钮推进（路由/状态前进）时写入 store；当前步骤以 store 为准
  useEffect(() => { useDemo.getState().advance(inferred) }, [inferred])
  const step = Math.min(16, Math.max(1, state.step || 1))
  const st = STEPS[step - 1]
  // 步序取 store.step；页面名取当前路由所在页面（PRD 页面名），不在清单内时回退到该步定义
  const pg = pageOf(loc.pathname) ?? { code: st.page, name: st.title }
  const go = (n: number) => {
    const f = flagsForStep(n)
    useDemo.getState().applyFlags(f)
    nav(STEPS[n - 1].path)
  }
  return (
    <div className="demobar" data-testid="demobar">
      <div className="db-left">
        <Logo size={26} />
        <b>AI 销售助手 · 交互 Demo</b>
        <span className="db-tag">林女士 CUST-001</span>
      </div>
      <div className="db-roles" role="tablist">
        <span className="db-label">演示角色</span>
        <button data-testid="role-consultant" className={role === 'consultant' ? 'on' : ''} onClick={() => sw('consultant')}>
          <img src={IMG.avZhang} alt="" />张顾问 · 销售顾问
        </button>
        <button data-testid="role-manager" className={role === 'manager' ? 'on' : ''} onClick={() => sw('manager')}>
          <img src={IMG.avChen} alt="" />陈经理 · 销售经理
        </button>
      </div>
      <div className="db-right">
        <span className="db-step" data-testid="db-step" data-step={step} data-page={pg.code}>Step {step}/16 · {pg.code} {pg.name}</span>
        <button className="db-btn" disabled={step <= 1} onClick={() => go(step - 1)} title="上一步">‹</button>
        <button className="db-btn" disabled={step >= 16} onClick={() => go(step + 1)} title="下一步">›</button>
        <button className="db-guide" data-testid="guide-open" onClick={() => state.setGuideOpen(true)}><Icon name="map" size={16} />演示导览</button>
      </div>
    </div>
  )
}

export function GuidePanel() {
  const open = useDemo((s) => s.guideOpen)
  const state = useDemo()
  const nav = useNavigate()
  if (!open) return null
  const cur = state.step
  const go = (n: number) => {
    useDemo.getState().applyFlags(flagsForStep(n))
    state.setGuideOpen(false)
    nav(STEPS[n - 1].path)
  }
  const reset = () => {
    useDemo.getState().applyFlags(flagsForStep(1))
    state.setGuideOpen(false)
    nav('/c01')
    useDemo.getState().showToast('演示已重置', 'info')
  }
  return (
    <div className="guide-mask" onClick={() => state.setGuideOpen(false)}>
      <div className="guide" onClick={(e) => e.stopPropagation()} data-testid="guide">
        <div className="guide-hd">
          <div>
            <h3>演示导览 · 16 步主链路</h3>
            <p>点击任一步一键跳转，共享状态（卡点 / 指导 / 意向评分 / 风险状态）自动设置为该步应有的状态</p>
          </div>
          <button className="guide-x" onClick={() => state.setGuideOpen(false)}><Icon name="close" /></button>
        </div>
        <div className="guide-list">
          {STEPS.map((s) => (
            <button key={s.n} className={`guide-item ${s.n === cur ? 'cur' : ''} ${s.role === '销售经理' ? 'mgr' : ''}`} onClick={() => go(s.n)} data-testid={`guide-step-${s.n}`}>
              <span className="gi-n">{s.n}</span>
              <span className="gi-body">
                <b>{s.title}</b>
                <small>{s.page} · {s.ui} · {s.trigger}</small>
              </span>
              <span className={`gi-role ${s.role === '销售经理' ? 'm' : 'c'}`}>{s.role === '销售经理' ? '陈经理' : '张顾问'}</span>
            </button>
          ))}
        </div>
        <div className="guide-ft">
          <span>角色切换点：Step 6→7 · Step 8→9 · Step 13→14</span>
          <button className="guide-reset" data-testid="guide-reset" onClick={reset}><Icon name="refresh" size={16} />重置演示</button>
        </div>
      </div>
    </div>
  )
}
