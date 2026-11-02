/**
 * Mock 数据 —— 按 PRD_v2.1 §6 数据对象组织。
 * 主角客户：林女士 CUST-001；销售顾问：张顾问 SALES-001；销售经理：陈经理 MGR-001（以 UI出图规划_v2 §C 为准）。
 * 说明：Mock 内容（项目名、户型、插图）允许保留行业内容；页面框架文案不使用行业专属叫法。
 */
import { IMG } from './images'

export const PRODUCT_NAME = 'AI 智能营销 · 销售助理'
export const PROJECT_NAME = '云麓府'
export const TODAY = '2026-10-27'
export const TODAY_LABEL = '2026-10-27 周二'

/** 6.11 salesPerson */
export const salesPersons = {
  zhang: { id: 'SALES-001', name: '张顾问', role: '销售顾问', avatar: IMG.avZhang },
  chen: { id: 'MGR-001', name: '陈经理', role: '销售经理', avatar: IMG.avChen },
}

/** 6.1 客户 */
export const customer = {
  customerId: 'CUST-001',
  name: '林女士',
  phoneMasked: '138****8821',
  visitCount: 1,
  ownerId: 'SALES-001',
  ownerName: '张顾问',
  createdAt: '2026-10-27 10:20',
  appointmentTime: '10:30',
  avatar: IMG.avLin,
  portrait: IMG.linPortrait,
  occupation: '事业单位相关',
}

/** 6.2 客户画像 */
export const customerProfile = {
  customerType: '高净值终局改善型',
  ageRange: '31–35 岁',
  familyStatus: '已婚，1 个 0–3 岁孩子',
  familyShort: '已婚、1孩',
  areaPreference: '300–350㎡',
  budget: '1600–1700 万',
  interests: ['儿童房', '教育', '健康管理', '出行'],
  focusPoints: ['儿童房', '交付'],
  resistancePoints: ['交付条件', '总价'],
  recognizedPoints: ['儿童房尺度', '社区环境'],
  cognition: '已了解项目基础信息',
  sourceTags: ['互联网画像', '接待', '跟进', '盘客'],
  lastVisitFocus: '交付条件、儿童房',
  currentVisitChange: '家人同行 3 人',
}

/** 6.3 客户预测 */
export const prediction = {
  predictionId: 'PRED-001',
  type: '高净值终局改善型',
  confidence: 82,
  reasons: [
    { key: '预算', value: '1600–1700 万', icon: '¥' },
    { key: '家庭', value: '已婚，1个0–3岁孩子', icon: '⌂' },
    { key: '兴趣', value: '儿童房、教育、健康管理、出行', icon: '♡' },
    { key: '行为', value: '首访到访', icon: '◎' },
  ],
  aiReading: '预算 1600–1700 万，关注儿童房与教育，属改善型家庭。',
  recommendedProduct: '300㎡改善户型',
  recommendedProductNote: '匹配意向 300–350㎡',
  recommendedSales: '张顾问',
  recommendedSalesNote: '改善家庭成交经验丰富',
  recommendedStrategy: '先回应交付顾虑',
  recommendedStrategyNote: '再讲家庭动线与儿童房',
  focus: ['儿童房', '改善户型'],
}

/** 接待策略 / 复访准备（C-03） */
export const receptionPrep = {
  first: {
    known: ['改善家庭', '0–3 岁孩子', '预算 1600–1700 万', '首访 2 人'],
    toAsk: [
      { id: 'q1', text: '谁居住', checked: true },
      { id: 'q2', text: '当前住房哪里不便', checked: true },
      { id: 'q3', text: '出行要求', checked: false },
    ],
    materials: [
      { id: 'm1', text: '300㎡户型资料', checked: true },
      { id: 'm2', text: '交付资料', checked: true },
    ],
    opening: '您最希望新房解决什么问题？',
    strategy: '先回应交付，再讲家庭动线。',
  },
  revisit: {
    planDate: '2026-10-31',
    last: '交付条件、儿童房',
    change: '家人同行，复访 3 人',
    verify: '预算是否调整',
    strategy: '先回应交付，再讲家庭动线',
    toAsk: [
      { id: 'r1', text: '预算是否调整', checked: true },
      { id: 'r2', text: '家人最关心什么', checked: false },
    ],
    materials: [
      { id: 'rm1', text: '交付条件说明', checked: true },
      { id: 'rm2', text: '300㎡户型资料', checked: true },
    ],
  },
}

/** 6.11 knowledgeCard —— 产品知识库 */
export const knowledgeCards = [
  { id: 'K1', title: '项目价值', items: ['核心优势', '产品亮点', '人群匹配', '价值总结'], img: IMG.build1 },
  { id: 'K2', title: '区域介绍', items: ['区位配套', '交通出行', '生活资源', '发展规划'], img: IMG.peitao },
]
export const faqs = [
  { q: '交付时间能确定吗？', a: '按项目公示的交付计划说明节点，并提供交付条件说明。' },
  { q: '儿童房面积多大？', a: '300㎡改善户型儿童房约 16㎡，带独立收纳与阳光飘窗，可随孩子成长调整布局。' },
  { q: '小区周边有哪些学校？', a: '周边 3 公里内有公立幼儿园 2 所、小学 1 所，详见区域介绍 · 生活资源。' },
]

/** 销冠方法论 */
export const methodology = {
  logic: ['先回应顾虑', '再问需求', '后讲价值'],
  order: ['交付', '家庭动线', '户型'],
  emphasis: '改善家庭先谈孩子成长空间',
  case: '销冠何顾问：改善家庭首访平均先用 5 分钟回应顾虑，再进入需求挖掘，成交转化高于团队 18%。',
}

/** 6.11 goldenSentence —— 场景金句 */
export const goldenSentences = [
  {
    id: 'G1', scene: '价格异议',
    text: '我理解您对价格的关注，我们先看这套房能为孩子成长解决哪些问题。',
    source: '销冠实战',
    rewrite: '林女士，您关注总价很正常，我们先看儿童房和交付安排是否真正适合您家。',
  },
  {
    id: 'G2', scene: '交付疑问',
    text: '交付节点都按公示计划推进，我把交付条件说明发您，每个节点都能查到。',
    source: '销冠实战',
    rewrite: '林女士，交付节点我直接把《交付条件说明》发给您，您和家人可以一起看。',
  },
  {
    id: 'G3', scene: '竞品对比',
    text: '比较是应该的，我们一起看看哪套更适合您家未来十年的生活。',
    source: '团队沉淀',
    rewrite: '林女士，和 A 项目比，我们一起看看哪边的儿童房和交付安排更让您放心。',
  },
]

/** 6.4 接待记录 + 6.11 conversationSegment */
export const reception = {
  receptionId: 'REC-001',
  startAt: '10:30',
  endAt: '12:10',
  duration: '1 小时 40 分',
  timer: '32:18',
  focus: ['交付条件', '儿童房'],
  asked: ['预算'],
  toAsk: ['出行要求'],
  aiTip: '建议先回应交付条件',
  keyQuote: { text: '交付时间能确定吗？', time: '接待 18:24', clock: '10:48' },
  resistance: '总价压力',
  timeline: [
    { time: '10:30', title: '开始接待', desc: '已与客户建立联系，了解基本需求。' },
    { time: '10:48', title: '关键原话', desc: '「交付时间能确定吗？」', highlight: true },
    { time: '11:02', title: '标记卡点', desc: '客户对交付时间存在疑虑，需要进一步解答。' },
  ],
}

/** 推送资料：交付条件说明 */
export const deliveryDoc = {
  title: '交付条件说明',
  file: '交付条件说明.pdf',
  size: '3.2 MB',
  img: IMG.build2,
  items: ['交付计划节点说明', '交付标准与配置', '交付前开放日安排'],
}

/** 6.11 remoteGuidance */
export const guidance = {
  to: '张顾问',
  from: '陈经理',
  content: '补充回应交付节点',
  channels: ['站内提醒', '短信', '电话提醒'],
  attachment: '交付条件说明',
  sentAt: '11:05',
}

/** AI 名片 / AI 分身 */
export const aiCard = {
  materials: [
    { title: '户型', img: IMG.plan },
    { title: '配套', img: IMG.peitao },
    { title: '交付', img: IMG.jiaofu },
  ],
  chat: [
    {
      q: '交付时间能确定吗？',
      a: '根据项目资料，交付按公示计划分节点进行，我把《交付条件说明》发给您参考。',
      attach: true, basis: '个人知识库 / 项目资料',
    },
    {
      q: '如果家里老人也要住，能调整户型吗？',
      a: '这个问题需要顾问进一步确认，已为您通知张顾问。',
      handoff: true,
    },
  ],
}

/** 6.11 visitTrail */
export const visitTrail = {
  authorizedAt: '13:32',
  items: [
    { label: '交付资料', count: 3, time: '13:35' },
    { label: '户型', count: 1, time: '13:38' },
    { label: '价格', count: 1, time: '13:41' },
  ],
  signal: '高频查看交付资料，意向升温',
}

/** 6.5 接待分析 */
export const analysis = {
  analysisId: 'ANA-001',
  serviceScore: 88,
  dims: [
    { key: '破冰', score: 82, team: 80 },
    { key: '挖需', score: 75, team: 80, weak: true },
    { key: '价值', score: 88, team: 84 },
    { key: '互动', score: 79, team: 78 },
    { key: '时长', score: 90, team: 85 },
  ],
  issueCustomer: '问出行',
  issueSales: '继续讲面积',
  offTopic: '未回应客户出行问题',
  improvement: '先问使用需求，再回应',
  trend: [79, 82, 80, 84, 86, 88],
  trendLabels: ['10-22', '10-23', '10-24', '10-25', '10-26', '10-27'],
}

/** 6.6 盘客纪要 + 6.9 团队判断 */
export const review = {
  reviewId: 'REVIEW-001',
  opinions: [
    { who: '张顾问', text: '家人意见是关键', avatar: IMG.avZhang },
    { who: '陈经理', text: '先补交付资料', avatar: IMG.avChen },
  ],
  voice: { length: '00:42', summary: '下次沟通先验证预算变化' },
  minutes: [
    { k: '讨论总结', v: '家人共同决策，交付是首要顾虑' },
    { k: '购买决策', v: '与家人讨论后决定' },
    { k: '价格比较', v: '对比竞品 A 项目' },
  ],
}

/** 6.7 意向判断 */
export const intent = {
  intentId: 'INT-001',
  level: 'A',
  aiScoreBefore: 82,
  aiScoreAfter: 85,
  sincerityBefore: 76,
  sincerityAfter: 81,
  match: 82,
  aiSuggestion: '高潜',
  changeReason: '家人加入讨论，交付顾虑仍在',
  feedback: '已发送交付资料，客户愿意带家人复访',
  trail: [
    { time: '10:20', label: '首访签到' },
    { time: '14:00', label: '盘客判定 A' },
    { time: '16:00', label: '反馈重算' },
  ],
}

/** 6.8 跟进任务 */
export const tasks = [
  { taskId: 'TASK-001', title: '3 天内电话回访', owner: '张顾问', dueAt: '2026-10-30', goal: '解决交付顾虑', priority: '高', source: '盘客纪要' },
  { taskId: 'TASK-002', title: '7 天发送户型资料', owner: '张顾问', dueAt: '2026-11-03', goal: '确认户型偏好', priority: '中', source: '盘客纪要' },
]

/** 6.9 风险证据 */
export const riskEvidence = {
  riskEvidenceId: 'RISK-001',
  quote: '交付时间能确定吗？',
  timePoint: '接待 18:24',
  relatedCustomer: '林女士',
  owner: '张顾问',
  record: '11:05 陈经理指导 · 已推送交付条件说明',
}

/** 工作台其他客户 */
export const workbench = {
  followToday: 3,
  followOverdue: 1,
  risks: [{ name: '王女士', text: '价格异议未回应' }],
  recent: [
    { name: '刘先生', level: '意向A', time: '昨天 15:20', avatar: IMG.avLiuxs },
    { name: '周女士', level: '意向B', time: '10-25', avatar: IMG.avZhou },
  ],
}

/** M-02 实时客户 */
export const liveCustomers = [
  { group: 'A组', name: '周女士', owner: '孙顾问', status: '比较户型', avatar: IMG.avZhou, tone: 'blue' },
  { group: 'B组', name: '林女士', owner: '张顾问', status: '接待中', avatar: IMG.avLin, tone: 'orange', focus: true },
  { group: 'C组', name: '刘先生', owner: '刘顾问', status: '开始沟通', avatar: IMG.avLiuxs, tone: 'teal' },
]

/** 6.11 operationMetric —— 驾驶舱 */
export const metrics = {
  kpis: [
    { label: '今日到访', value: '28', unit: '组', delta: '较昨日 +4' },
    { label: '高潜客户', value: '6', unit: '组', delta: '较昨日 +2' },
    { label: '到访转化率', value: '6.2', unit: '%', delta: '近30日' },
    { label: '跟进任务', value: '14', unit: '条', delta: '完成率 78%' },
  ],
  visitTrend: { labels: ['10-21', '10-22', '10-23', '10-24', '10-25', '10-26', '10-27'], visit: [18, 22, 19, 24, 26, 25, 28], appoint: [12, 15, 14, 18, 17, 20, 21] },
  todayTrend: { labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00'], visit: [3, 8, 14, 18, 23, 28], appoint: [5, 9, 7, 6, 8, 10] },
  intentDist: [
    { label: 'A 类', value: 18, color: '#3B6BFF' },
    { label: 'B 类', value: 37, color: '#2FD4C0' },
    { label: 'C 类', value: 33, color: '#8B5CF6' },
    { label: '无效', value: 12, color: '#4A5590' },
  ],
  funnel: [
    { label: '到访', value: 516, pct: '100%' },
    { label: '留资', value: 342, pct: '66%' },
    { label: '复访', value: 118, pct: '23%' },
    { label: '成交', value: 32, pct: '6.2%' },
  ],
  resistance: [
    { label: '交付条件', value: 32, color: '#3B6BFF' },
    { label: '总价', value: 28, color: '#2FD4C0' },
    { label: '通勤', value: 16, color: '#8B5CF6' },
    { label: '户型', value: 14, color: '#FF9F1A' },
    { label: '其他', value: 10, color: '#4A5590' },
  ],
  source: [
    { label: '自然到访', value: 42, color: '#3B6BFF' },
    { label: '老客户推荐', value: 24, color: '#2FD4C0' },
    { label: '线上渠道', value: 18, color: '#8B5CF6' },
    { label: '活动到访', value: 10, color: '#FF9F1A' },
    { label: '其他', value: 6, color: '#4A5590' },
  ],
  online: 3,
  weekAdvice: '高潜改善型占比上升，交付和总价是主要阻力',
}

/** 6.10 四盘一控 */
export const fourPan = [
  { key: '盘客户', count: 128, delta: '↑12%', up: true, problem: 'A 类客户增加，未成交原因为交付顾虑', judge: '交付顾虑高频出现', action: '补充交付资料，3 天内回访 A 类客户' },
  { key: '盘产品知识', count: 86, delta: '↑8%', up: true, problem: '交付说明被频繁调用', judge: '异议回应内容不足', action: '强化交付异议回应' },
  { key: '盘团队', count: 12, delta: '↑20%', up: true, problem: '张顾问挖需偏弱', judge: '过程能力短板', action: '已创建辅导计划' },
  { key: '盘产品', count: 36, delta: '↓5%', up: false, problem: '300㎡户型关注高', judge: '价格预期偏紧', action: '准备总价拆分与付款方案' },
  { key: '控风险', count: 4, delta: '↓33%', up: false, problem: '2 条异常承诺待核查', judge: '存在过度承诺风险', action: '核查原话并确认回应口径', danger: true },
]
export const customerDynamics = [
  { time: '14:32', type: 'A类客户', text: '到访并深入了解了项目详情' },
  { time: '13:50', type: 'B类客户', text: '对300㎡户型表现出较高关注' },
  { time: '11:28', type: 'C类客户', text: '再次到访，关注交付相关问题' },
]
export const weekAdvices = [
  { k: '客户结构变化', v: '高潜改善型占比上升', icon: '▲' },
  { k: '判断', v: '交付和总价是主要阻力', icon: '◆' },
  { k: '行动', v: '增加交付说明和改善户型内容', icon: '►' },
  { k: '预期影响', v: '提升高潜客户回应率', icon: '★' },
]
export const pdca = [
  { k: '沉淀', v: '交付条件说明已沉淀为产品知识，本周调用 12 次' },
  { k: '学习', v: '团队 12 人完成「先回应顾虑」方法论学习' },
  { k: '使用', v: '交付疑问场景金句本周使用 27 次' },
  { k: '优化', v: '根据客户反馈优化交付说明第 2 节「交付标准与配置」' },
]

/** M-05 四象限 */
export const advisors = [
  { id: 'zhang', name: '张顾问', deals: 2, process: 81, service: 88, quad: '重点辅导', avatar: IMG.avZhang, dims: [82, 75, 88, 79], reason: '挖需偏弱' },
  { id: 'sun', name: '孙顾问', deals: 0, process: 78, service: 72, quad: '重点辅导', avatar: IMG.avSun, dims: [70, 72, 76, 74], reason: '破冰与互动偏弱' },
  { id: 'liu', name: '刘顾问', deals: 3, process: 67, service: 91, quad: '过程改善', avatar: IMG.avLiu, dims: [68, 62, 70, 66], reason: '过程规范不足' },
  { id: 'zhao', name: '赵顾问', deals: 1, process: 88, service: 86, quad: '资源支持', avatar: IMG.avZhao, dims: [88, 86, 90, 87], reason: '过程好但高潜客户少' },
  { id: 'he', name: '何顾问', deals: 4, process: 90, service: 93, quad: '复制推广', avatar: IMG.avHe, dims: [91, 90, 92, 88], reason: '成交与过程双优' },
]
export const quadrants = [
  { key: '复制推广', pos: '右上', desc: '成交好 · 过程好', action: '沉淀方法', color: '#1FBF75' },
  { key: '过程改善', pos: '左上', desc: '成交好 · 过程弱', action: '补过程短板', color: '#FF9F1A' },
  { key: '资源支持', pos: '右下', desc: '成交弱 · 过程好', action: '增加高潜客户分配', color: '#2FD4C0' },
  { key: '重点辅导', pos: '左下', desc: '成交弱 · 过程弱', action: '创建辅导计划', color: '#F5455C' },
]
export const coachingPlan = {
  target: '挖需 75→85',
  period: '2 周',
  owner: '陈经理',
  content: '学习销冠方法论：先问使用需求',
}

/** S-01 接待记录（PC） */
export const receptionRecords = [
  { date: '10-27', type: '首访', time: '10:30–12:10', desc: '张顾问接待，关注儿童房、交付' },
  { date: '10-27', type: '名片授权', time: '13:32', desc: '客户手机号授权，查看交付资料 3 次' },
  { date: '10-27', type: '盘客', time: '14:00–14:30', desc: '团队判定意向 A' },
  { date: '10-27', type: '电话回访', time: '16:00', desc: '已发送交付资料，客户愿意带家人复访' },
]
