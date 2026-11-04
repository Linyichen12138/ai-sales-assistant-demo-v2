import { create } from 'zustand'

export type V2Role = 'sales' | 'lead' | 'director'
export type CardKind = '事实' | '推断' | '待核实'
export type ProcessStatus = '待处理' | '已处理' | '已顺延' | '已过期' | '依据已变'
export type DecisionStatus = '未决策' | '确认' | '部分确认' | '编辑后确认' | '驳回'
export type WriteStatus = '未写入' | '写入中' | '写入成功' | '写入失败可重试'

export const company = { id: 'HC-001', name: '禾川食品（示例公司）', short: '禾川食品' }
export const opportunity = { id: 'OPP-2027-001', name: '禾川食品 · 2027 调味料供货商机（示例）', stage: '拜访 · 初访' }
export const contacts = [
  { id: 'C-01', name: '周敏（示例）', title: '采购经理', phone: '138****1024' },
  { id: 'C-02', name: '刘峰（示例）', title: '研发总监', phone: '139****4431' },
  { id: 'C-03', name: '马丽（示例）', title: '财务负责人', phone: '136****8842' },
]
export const roles = [
  { key: 'sales' as V2Role, name: '张帆（示例）', title: '一线销售' },
  { key: 'lead' as V2Role, name: '王磊（示例）', title: '销售组长' },
  { key: 'director' as V2Role, name: '陈静（示例）', title: '销售总监' },
]

export interface ActionCardData {
  id: string
  object: string
  title: string
  conclusion: string
  kind: CardKind
  evidence: string
  source: string
  next: string
  owner: string
  due: string
  process: ProcessStatus
  decision: DecisionStatus
  write: WriteStatus
  urgency: '高' | '中' | '低'
  staleReason?: string
}

export const initialCards: ActionCardData[] = [
  { id: 'AC-101', object: company.name, title: '建议开启商机推进', conclusion: '客户已明确 2027 年调味料供货窗口，建议从线索进入商机。', kind: '事实', evidence: '客户会议纪要 · 2026-11-01 16:20', source: '销售纪要 / 版本 v3', next: '确认商机字段并补充联系人', owner: '张帆（示例）', due: '今天 18:00', process: '待处理', decision: '未决策', write: '未写入', urgency: '高' },
  { id: 'AC-102', object: company.name, title: '初访方案建议', conclusion: '重点验证样品评估标准、交付周期和合同审批节点。', kind: '推断', evidence: '历史相似客户 · 华粮餐饮（示例公司）', source: '知识库 / 更新于 10:20', next: '开始拜访并逐项确认', owner: '张帆（示例）', due: '今天 14:30', process: '待处理', decision: '未决策', write: '未写入', urgency: '高' },
  { id: 'AC-103', object: '华粮餐饮（示例公司）', title: '补充竞品交付证据', conclusion: '现有竞品对比资料超过 30 天，需补充当前版本。', kind: '待核实', evidence: '竞品资料 · 更新于 09:10', source: '资料库 / 版本 v2', next: '向产品同事发起核实', owner: '李悦（示例）', due: '明天 12:00', process: '依据已变', decision: '未决策', write: '未写入', urgency: '中', staleReason: '资料更新时间超过 30 天' },
  { id: 'AC-104', object: company.name, title: '会后跟进：提供质检报告', conclusion: '客户需要质检报告作为研发评估依据。', kind: '待核实', evidence: '会后摘要 · 2026-11-02 15:08', source: '拜访记录 / 待确认', next: '确认后生成跟进任务', owner: '张帆（示例）', due: '11 月 04 日', process: '待处理', decision: '未决策', write: '未写入', urgency: '高' },
]

interface V2State {
  role: V2Role
  step: number
  selectedCompany: string
  cards: ActionCardData[]
  drawerCard: string | null
  drawerOpen: boolean
  guidanceOpen: boolean
  visitStarted: boolean
  reviewConfirmed: boolean
  stagePendingApproval: boolean
  toast: string | null
  setRole: (role: V2Role) => void
  setStep: (step: number) => void
  updateCard: (id: string, patch: Partial<ActionCardData>) => void
  openEvidence: (id: string) => void
  closeEvidence: () => void
  openGuidance: () => void
  closeGuidance: () => void
  set: (patch: Partial<V2State>) => void
  notify: (text: string) => void
}

let timer: ReturnType<typeof setTimeout> | undefined
export const useV2 = create<V2State>((set) => ({
  role: 'sales', step: 1, selectedCompany: company.name, cards: initialCards, drawerCard: null, drawerOpen: false,
  visitStarted: false, reviewConfirmed: false, stagePendingApproval: false, guidanceOpen: false, toast: null,
  setRole: (role) => set({ role }), setStep: (step) => set({ step }),
  updateCard: (id, patch) => set((s) => ({ cards: s.cards.map((c) => c.id === id ? { ...c, ...patch } : c) })),
  openEvidence: (id) => set({ drawerCard: id, drawerOpen: true }), closeEvidence: () => set({ drawerOpen: false }),
  openGuidance: () => set({ guidanceOpen: true }), closeGuidance: () => set({ guidanceOpen: false }),
  set: (patch) => set(patch),
  notify: (text) => { clearTimeout(timer); set({ toast: text }); timer = setTimeout(() => set({ toast: null }), 2200) },
}))

