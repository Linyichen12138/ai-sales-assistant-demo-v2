import { useLocation, useNavigate } from 'react-router-dom'
import { useDemo, type Role } from '../store/demo'

/** 角色切换：保留当前客户林女士，按演示链路跳到对应端的承接页 */
export function useRoleSwitch() {
  const nav = useNavigate()
  const loc = useLocation()
  return (to: Role) => {
    const s = useDemo.getState()
    if (s.role === to) return
    const p = loc.pathname
    let target = '/c01'
    if (to === 'manager') {
      if (p.startsWith('/c04')) target = '/m02'
      else if (p.startsWith('/c03') && s.feedbackWritten) target = '/m04'
      else if (p.startsWith('/s01')) target = '/s01'
      else if (s.feedbackWritten) target = '/m04'
      else if (s.blockerMarked && !s.guidanceSent) target = '/m02'
      else target = '/m01'
    } else {
      if (s.guidanceSent && !s.receptionEnded) target = '/c04'
      else if (p.startsWith('/s01')) target = '/s01'
      else if (p.startsWith('/m04') || p.startsWith('/m05')) target = '/c03'
      else target = '/c01'
    }
    s.set({ role: to })
    nav(target)
    s.showToast(to === 'manager' ? '已切换至管理者视角，数据范围已更新' : '已切换至销售顾问视角，数据范围已更新', 'info')
  }
}
