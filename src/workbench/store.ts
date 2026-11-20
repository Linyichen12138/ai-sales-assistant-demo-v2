import { create } from 'zustand'
import { DEFAULT_COMMITTED, SEED_TASKS, type DemoTask } from './fixtures'

export type Decision = '待确认' | '已写入' | '已驳回' | '编辑中'
export type ScheduleFocus = 'hechuan' | 'xianyuan' | 'hualiang'
export type VisitTarget = 'hechuan' | 'xianyuan'
export type QuoteSheet = 'hualiang' | 'hechuan'
export type LinePick = 'A' | 'B'
export type TaskFilter = '全部' | '进行中' | '待确认' | '已完成' | '已归档'

const PERSIST_KEY = 'ai-sales-demo-r3'

interface WbState {
  decisions: Record<string, Decision>
  open: Record<string, boolean>
  toast: string | null
  committed: Record<string, string>
  drafts: Record<string, string>
  reasons: Record<string, string>
  scheduleFocus: ScheduleFocus
  visitTarget: VisitTarget
  quoteSheet: QuoteSheet
  hechuanAdopted: boolean
  adoptedLine: LinePick | null
  contractSubmitted: boolean
  leadConverted: boolean
  selectedLead: string
  quoteUsesLocal: boolean
  quoteStep: number
  signStep: number
  taskFilter: TaskFilter
  noteSaved: boolean
  noteText: string
  sensitiveHeld: boolean
  colleagueAsked: boolean
  tasks: DemoTask[]
  hualiangApproval: boolean
  linePick: LinePick
  setDecision: (id: string, d: Decision) => void
  toggle: (key: string, def: boolean) => void
  resetOpen: () => void
  notify: (t: string) => void
  setDraft: (key: string, value: string) => void
  confirmFields: (keys: string[]) => void
  setReason: (id: string, value: string) => void
  setScheduleFocus: (f: ScheduleFocus) => void
  setVisitTarget: (t: VisitTarget) => void
  setQuoteSheet: (q: QuoteSheet) => void
  adoptHechuan: () => void
  submitContract: () => void
  reopenContract: () => void
  convertLead: () => void
  selectLead: (id: string) => void
  setQuoteUsesLocal: (v: boolean) => void
  setQuoteStep: (n: number) => void
  advanceQuote: () => void
  advanceSign: () => void
  setNoteText: (v: string) => void
  saveNote: () => void
  holdSensitive: () => void
  askColleague: () => void
  addTask: (task: DemoTask) => void
  completeTask: (id: string) => void
  archiveTask: (id: string) => void
  setTaskFilter: (f: TaskFilter) => void
  setHualiangApproval: (v: boolean) => void
  setLinePick: (v: LinePick) => void
  resetDemo: () => void
}

function fresh() {
  return {
    decisions: {} as Record<string, Decision>,
    open: {} as Record<string, boolean>,
    toast: null as string | null,
    committed: { ...DEFAULT_COMMITTED },
    drafts: {} as Record<string, string>,
    reasons: {} as Record<string, string>,
    scheduleFocus: 'hechuan' as ScheduleFocus,
    visitTarget: 'hechuan' as VisitTarget,
    quoteSheet: 'hualiang' as QuoteSheet,
    hechuanAdopted: false,
    adoptedLine: null as LinePick | null,
    contractSubmitted: false,
    leadConverted: false,
    selectedLead: 'hechuan',
    quoteUsesLocal: false,
    quoteStep: 1,
    signStep: 0,
    taskFilter: '全部' as TaskFilter,
    noteSaved: false,
    noteText: '',
    sensitiveHeld: false,
    colleagueAsked: false,
    tasks: SEED_TASKS.map((t) => ({ ...t })),
    hualiangApproval: false,
    linePick: 'A' as LinePick,
  }
}

function loadSaved(): ReturnType<typeof fresh> | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<ReturnType<typeof fresh>>
    if (!data || typeof data !== 'object') return null
    const base = fresh()
    const linePick = data.linePick === 'B' ? 'B' : 'A'
    const quoteStep = data.quoteStep === 2 || data.quoteStep === 3 ? data.quoteStep : 1
    const signStep = data.signStep === 1 || data.signStep === 2 ? data.signStep : 0
    const filters: TaskFilter[] = ['全部', '进行中', '待确认', '已完成', '已归档']
    const taskFilter = filters.includes(data.taskFilter as TaskFilter) ? data.taskFilter as TaskFilter : '全部'
    return {
      ...base,
      decisions: data.decisions ?? base.decisions,
      committed: { ...base.committed, ...(data.committed ?? {}) },
      drafts: data.drafts ?? {},
      reasons: data.reasons ?? {},
      hechuanAdopted: !!data.hechuanAdopted,
      adoptedLine: data.adoptedLine === 'A' || data.adoptedLine === 'B' ? data.adoptedLine : null,
      contractSubmitted: !!data.contractSubmitted,
      leadConverted: !!data.leadConverted,
      selectedLead: data.selectedLead || 'hechuan',
      quoteUsesLocal: !!data.quoteUsesLocal,
      quoteStep,
      signStep,
      taskFilter,
      noteSaved: !!data.noteSaved,
      noteText: data.noteText ?? '',
      sensitiveHeld: !!data.sensitiveHeld,
      colleagueAsked: !!data.colleagueAsked,
      tasks: Array.isArray(data.tasks) ? data.tasks : base.tasks,
      hualiangApproval: !!data.hualiangApproval,
      linePick: linePick as LinePick,
      scheduleFocus: (data.scheduleFocus === 'xianyuan' || data.scheduleFocus === 'hualiang' ? data.scheduleFocus : base.scheduleFocus),
      visitTarget: data.visitTarget === 'xianyuan' ? 'xianyuan' : base.visitTarget,
      quoteSheet: data.quoteSheet === 'hechuan' ? 'hechuan' : base.quoteSheet,
    }
  } catch {
    return null
  }
}

function snapshot(s: WbState) {
  return {
    decisions: s.decisions,
    committed: s.committed,
    drafts: s.drafts,
    reasons: s.reasons,
    scheduleFocus: s.scheduleFocus,
    visitTarget: s.visitTarget,
    quoteSheet: s.quoteSheet,
    hechuanAdopted: s.hechuanAdopted,
    adoptedLine: s.adoptedLine,
    contractSubmitted: s.contractSubmitted,
    leadConverted: s.leadConverted,
    selectedLead: s.selectedLead,
    quoteUsesLocal: s.quoteUsesLocal,
    quoteStep: s.quoteStep,
    signStep: s.signStep,
    taskFilter: s.taskFilter,
    noteSaved: s.noteSaved,
    noteText: s.noteText,
    sensitiveHeld: s.sensitiveHeld,
    colleagueAsked: s.colleagueAsked,
    tasks: s.tasks,
    hualiangApproval: s.hualiangApproval,
    linePick: s.linePick,
  }
}

let timer: ReturnType<typeof setTimeout> | undefined
const saved = loadSaved()
export const useWb = create<WbState>((set, get) => ({
  ...(saved ?? fresh()),
  open: {},
  toast: null,
  setDecision: (id, d) => set((s) => ({ decisions: { ...s.decisions, [id]: d } })),
  toggle: (key, def) => set((s) => ({ open: { ...s.open, [key]: !(s.open[key] ?? def) } })),
  resetOpen: () => set({ open: {} }),
  notify: (t) => { clearTimeout(timer); set({ toast: t }); timer = setTimeout(() => set({ toast: null }), 2200) },
  setDraft: (key, value) => set((s) => ({ drafts: { ...s.drafts, [key]: value } })),
  confirmFields: (keys) => set((s) => {
    const committed = { ...s.committed }
    for (const k of keys) if (s.drafts[k] !== undefined) committed[k] = s.drafts[k]
    return { committed }
  }),
  setReason: (id, value) => set((s) => ({ reasons: { ...s.reasons, [id]: value } })),
  setScheduleFocus: (scheduleFocus) => set({ scheduleFocus }),
  setVisitTarget: (visitTarget) => set({ visitTarget }),
  setQuoteSheet: (quoteSheet) => set({ quoteSheet, hualiangApproval: false }),
  adoptHechuan: () => {
    const s = get()
    const again = s.hechuanAdopted && s.adoptedLine === s.linePick
    set({ hechuanAdopted: true, adoptedLine: s.linePick })
    get().notify(again ? `产线 ${s.linePick} 已采纳，未重复写入（示例）` : `已采纳产线 ${s.linePick}（示例）`)
  },
  submitContract: () => {
    const again = get().contractSubmitted
    set({ contractSubmitted: true })
    get().notify(again ? '审批已提交，未重复提交（示例）' : '已提交签约审批（示例）')
  },
  reopenContract: () => set({ contractSubmitted: false, signStep: 0 }),
  convertLead: () => {
    const again = get().leadConverted
    set({ leadConverted: true })
    get().notify(again ? '商机已存在，未重复创建（示例）' : '已将禾川线索转为商机（示例）')
  },
  selectLead: (selectedLead) => set({ selectedLead }),
  setQuoteUsesLocal: (quoteUsesLocal) => set({ quoteUsesLocal, quoteStep: quoteUsesLocal ? 1 : get().quoteStep }),
  setQuoteStep: (quoteStep) => set({ quoteStep }),
  advanceQuote: () => set((s) => ({ quoteStep: Math.min(3, s.quoteStep + 1) })),
  advanceSign: () => set((s) => ({ signStep: Math.min(2, s.signStep + 1) })),
  setNoteText: (noteText) => set({ noteText, noteSaved: false }),
  saveNote: () => set({ noteSaved: true }),
  holdSensitive: () => set({ sensitiveHeld: true }),
  askColleague: () => set({ colleagueAsked: true }),
  addTask: (task) => {
    if (get().tasks.some((t) => t.id === task.id)) {
      get().notify(`「${task.title}」已在任务中，未重复创建（示例）`)
      return
    }
    set((s) => ({ tasks: [...s.tasks, task] }))
    get().notify(`已加入任务：${task.title}（示例）`)
  },
  completeTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, group: 'done' as const } : t) })),
  archiveTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, group: 'archived' as const } : t) })),
  setTaskFilter: (taskFilter) => set({ taskFilter }),
  setHualiangApproval: (hualiangApproval) => set({ hualiangApproval }),
  setLinePick: (linePick) => set({ linePick }),
  resetDemo: () => {
    try { localStorage.removeItem(PERSIST_KEY) } catch { /* 演示环境可能禁写 */ }
    set({ ...fresh(), open: {}, toast: null })
  },
}))

useWb.subscribe((s) => {
  try { localStorage.setItem(PERSIST_KEY, JSON.stringify(snapshot(s))) } catch { /* 忽略配额或隐私模式 */ }
})
