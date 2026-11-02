import { PhoneFrame, NavBar, BottomNav } from '../../components/PhoneFrame'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { IMG } from '../../mock/images'
import { PROJECT_NAME } from '../../mock/data'

/** 我的（演示补充页，避免底部导航空链） */
export default function Me() {
  const s = useDemo()
  const items = [['star', '我的金句', `${s.favorites.length} 条收藏`], ['book', '学习记录', '方法论 3 篇'], ['chart', '我的接待分析', '服务评分 88'], ['users', '我的 AI 分身', '今日咨询 2 次']]
  return (
    <PhoneFrame>
      <NavBar title="我的" />
      <div className="ph-body">
        <div className="grad card-hero">
          <img className="av" src={IMG.avZhang} width={60} height={60} style={{ border: '2px solid #fff' }} />
          <div><b style={{ fontSize: 20 }}>张顾问</b><p style={{ opacity: .85, marginTop: 4 }}>{PROJECT_NAME} · 销售顾问 · SALES-001</p></div>
        </div>
        <div className="card">
          {items.map(([ic, t, d]) => (
            <button key={t} className="list-row" style={{ width: '100%' }} onClick={() => s.showToast(`「${t}」为演示占位`, 'info')}>
              <Icon name={ic} size={18} color="#3B3BF5" /><b style={{ flex: 1, textAlign: 'left' }}>{t}</b><span className="light" style={{ fontSize: 12 }}>{d}</span><Icon name="right" size={14} color="#9AA1B2" />
            </button>
          ))}
        </div>
      </div>
      <BottomNav active="我的" />
    </PhoneFrame>
  )
}
