import { create } from 'zustand'

export type Decision = '待确认' | '已写入' | '已驳回' | '编辑中'

interface WbState {
  decisions: Record<string, Decision>
  open: Record<string, boolean>
  toast: string | null
  setDecision: (id: string, d: Decision) => void
  toggle: (key: string, def: boolean) => void
  resetOpen: () => void
  notify: (t: string) => void
}

let timer: ReturnType<typeof setTimeout> | undefined
export const useWb = create<WbState>((set) => ({
  decisions: {},
  open: {},
  toast: null,
  setDecision: (id, d) => set((s) => ({ decisions: { ...s.decisions, [id]: d } })),
  toggle: (key, def) => set((s) => ({ open: { ...s.open, [key]: !(s.open[key] ?? def) } })),
  resetOpen: () => set({ open: {} }),
  notify: (t) => { clearTimeout(timer); set({ toast: t }); timer = setTimeout(() => set({ toast: null }), 2200) },
}))
