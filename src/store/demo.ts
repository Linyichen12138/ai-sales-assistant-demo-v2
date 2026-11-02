import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'consultant' | 'manager'

/** 林女士 CUST-001 的共享演示状态（顾问端 / 管理端共用一份） */
export interface DemoFlags {
  role: Role
  step: number // 演示当前步骤（按钮推进 / 导览跳转时写入，不再仅由路由推断）
  signedIn: boolean // C-02 签到授权
  predictionReady: boolean // C-02 预测已生成
  favorites: string[] // C-10 金句收藏
  receptionStarted: boolean // C-04 开始接待
  blockerMarked: boolean // C-04 标记卡点 → M-02 优先核查
  guidanceSent: boolean // M-03 发送指导 → C-04 弹窗
  guidanceSeen: boolean // C-04 指导弹窗已读
  receptionEnded: boolean // C-04 结束接待
  cardShared: boolean // C-06 AI 名片已发送
  phoneAuthorized: boolean // C-06 手机号授权
  intentAdopted: boolean // C-05 采纳 AI 意向
  opinionAdded: boolean // C-05 团队补充判断
  minutesGenerated: boolean // C-05 盘客纪要
  tasksGenerated: boolean // S-01 跟进任务
  feedbackWritten: boolean // S-01 回写反馈 → 意向重算 82→85
  riskStatus: '待核查' | '已回应'
  analysisConfirmed: boolean // M-04 确认结论
  improveTaskCreated: boolean // M-04 生成改进任务
  coachingCreated: boolean // M-05 辅导计划
}

export interface Toast { id: number; text: string; tone?: 'ok' | 'info' | 'warn' }

interface DemoState extends DemoFlags {
  toast: Toast | null
  guideOpen: boolean
  set: (p: Partial<DemoFlags>) => void
  showToast: (text: string, tone?: Toast['tone']) => void
  setGuideOpen: (v: boolean) => void
  applyFlags: (f: DemoFlags) => void
  advance: (n: number) => void
}

export const INITIAL: DemoFlags = {
  role: 'consultant',
  step: 1,
  signedIn: false,
  predictionReady: false,
  favorites: [],
  receptionStarted: false,
  blockerMarked: false,
  guidanceSent: false,
  guidanceSeen: false,
  receptionEnded: false,
  cardShared: false,
  phoneAuthorized: false,
  intentAdopted: false,
  opinionAdded: false,
  minutesGenerated: false,
  tasksGenerated: false,
  feedbackWritten: false,
  riskStatus: '待核查',
  analysisConfirmed: false,
  improveTaskCreated: false,
  coachingCreated: false,
}

// 导览跳转后短时间内忽略路由推断（跳转时 flags 与路由先后更新，中间态会误推进步骤）
let jumpLockUntil = 0
let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useDemo = create<DemoState>()(
  persist(
    (set) => ({
      ...INITIAL,
      toast: null,
      guideOpen: false,
      set: (p) => set(p),
      showToast: (text, tone = 'ok') => {
        clearTimeout(toastTimer)
        set({ toast: { id: Date.now(), text, tone } })
        toastTimer = setTimeout(() => set({ toast: null }), 2200)
      },
      setGuideOpen: (v) => set({ guideOpen: v }),
      applyFlags: (f) => { jumpLockUntil = Date.now() + 600; set({ ...f }) },
      // 主链路推进：只前进不后退（返回/回看不改变进度；导览跳转用 applyFlags 精确设置）
      advance: (n) => { if (Date.now() < jumpLockUntil) return; set((st) => (n > st.step ? { step: n } : {})) },
    }),
    {
      name: 'ai-sales-demo-v1',
      version: 1,
      migrate: (old) => ({ ...INITIAL, ...(old as object) }) as DemoState,
      partialize: (s) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { toast, guideOpen, set, showToast, setGuideOpen, applyFlags, advance, ...rest } = s
        void toast; void guideOpen; void set; void showToast; void setGuideOpen; void applyFlags; void advance
        return rest
      },
    },
  ),
)

/** 派生数据：评分随回写反馈变化 */
export function useScores() {
  const fw = useDemo((s) => s.feedbackWritten)
  return {
    aiScore: fw ? 85 : 82,
    sincerity: fw ? 81 : 76,
    match: 82,
    visitType: fw ? '复访' : '首访',
  }
}
