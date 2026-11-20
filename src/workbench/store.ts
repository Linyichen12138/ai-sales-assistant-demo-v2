import { create } from 'zustand'
import { DEFAULT_COMMITTED, SEED_TASKS, type DemoTask } from './fixtures'

export type Decision = '待确认' | '已写入' | '已驳回' | '编辑中'
export type ScheduleFocus = 'hechuan' | 'xianyuan' | 'hualiang'
export type VisitTarget = 'hechuan' | 'xianyuan'
export type QuoteSheet = 'hualiang' | 'hechuan'

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
  contractSubmitted: boolean
  leadConverted: boolean
  selectedLead: string
  quoteUsesLocal: boolean
  noteSaved: boolean
  noteText: string
  sensitiveHeld: boolean
  colleagueAsked: boolean
  tasks: DemoTask[]
  hualiangApproval: boolean
  linePick: 'A' | 'B'
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
  setNoteText: (v: string) => void
  saveNote: () => void
  holdSensitive: () => void
  askColleague: () => void
  addTask: (task: DemoTask) => void
  completeTask: (id: string) => void
  setHualiangApproval: (v: boolean) => void
  setLinePick: (v: 'A' | 'B') => void
  resetDemo: () => void
}

const initial = {
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
  contractSubmitted: false,
  leadConverted: false,
  selectedLead: 'hechuan',
  quoteUsesLocal: false,
  noteSaved: false,
  noteText: '',
  sensitiveHeld: false,
  colleagueAsked: false,
  tasks: SEED_TASKS.map((t) => ({ ...t })),
  hualiangApproval: false,
  linePick: 'A' as const,
}

let timer: ReturnType<typeof setTimeout> | undefined
export const useWb = create<WbState>((set) => ({
  ...initial,
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
  adoptHechuan: () => set({ hechuanAdopted: true }),
  submitContract: () => set({ contractSubmitted: true }),
  reopenContract: () => set({ contractSubmitted: false }),
  convertLead: () => set({ leadConverted: true }),
  selectLead: (selectedLead) => set({ selectedLead }),
  setQuoteUsesLocal: (quoteUsesLocal) => set({ quoteUsesLocal }),
  setNoteText: (noteText) => set({ noteText, noteSaved: false }),
  saveNote: () => set({ noteSaved: true }),
  holdSensitive: () => set({ sensitiveHeld: true }),
  askColleague: () => set({ colleagueAsked: true }),
  addTask: (task) => set((s) => (s.tasks.some((t) => t.id === task.id) ? {} : { tasks: [...s.tasks, task] })),
  completeTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, group: 'done' as const } : t) })),
  setHualiangApproval: (hualiangApproval) => set({ hualiangApproval }),
  setLinePick: (linePick) => set({ linePick }),
  resetDemo: () => set({
    ...initial,
    committed: { ...DEFAULT_COMMITTED },
    tasks: SEED_TASKS.map((t) => ({ ...t })),
    decisions: {},
    open: {},
    drafts: {},
    reasons: {},
    toast: null,
  }),
}))
