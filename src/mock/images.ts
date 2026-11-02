// 插图/头像资源：从定稿 UI 图中裁切，构建时内联为 base64（file:// 可用）
import logo from '../assets/img/logo.svg'
import avLin from '../assets/img/av-lin.jpg'
import avZhang from '../assets/img/av-zhang.jpg'
import avChen from '../assets/img/av-chen.jpg'
import avSun from '../assets/img/av-sun.jpg'
import avLiu from '../assets/img/av-liu.jpg'
import avZhao from '../assets/img/av-zhao.jpg'
import avHe from '../assets/img/av-he.jpg'
import avZhou from '../assets/img/av-zhou.jpg'
import avLiuxs from '../assets/img/av-liuxs.jpg'
import linPortrait from '../assets/img/lin-portrait.jpg'
import zhangCard from '../assets/img/zhang-card.jpg'
import floorplanDark from '../assets/img/floorplan-dark.jpg'
import plan from '../assets/img/plan.jpg'
import peitao from '../assets/img/peitao.jpg'
import jiaofu from '../assets/img/jiaofu.jpg'
import robot from '../assets/img/robot.jpg'
import robotS from '../assets/img/robot-s.jpg'
import build1 from '../assets/img/build1.jpg'
import build2 from '../assets/img/build2.jpg'
import aerial from '../assets/img/aerial.jpg'
// 第 3 轮：3D 图标裁切（scripts/crops.py）
import cropSparkleLg from '../assets/crops/sparkle-lg.webp'
import cropMLogic from '../assets/crops/m-logic.webp'
import cropMLayers from '../assets/crops/m-layers.webp'
import cropMTarget from '../assets/crops/m-target.webp'
import cropStar from '../assets/crops/star.webp'
import cropSparkleSm from '../assets/crops/sparkle-sm.webp'
import cropBell from '../assets/crops/bell.webp'
import cropDoc from '../assets/crops/doc.webp'
import cropMin1 from '../assets/crops/min-1.webp'
import cropMin2 from '../assets/crops/min-2.webp'
import cropMin3 from '../assets/crops/min-3.webp'
import cropNote from '../assets/crops/note.webp'

export const IMG = {
  logo, avLin, avZhang, avChen, avSun, avLiu, avZhao, avHe, avZhou, avLiuxs,
  linPortrait, zhangCard, floorplanDark, plan, peitao, jiaofu, robot, robotS, build1, build2, aerial,
  cropSparkleLg, cropMLogic, cropMLayers, cropMTarget, cropStar, cropSparkleSm, cropBell, cropDoc, cropMin1, cropMin2, cropMin3, cropNote,
}

/** 第 3 轮：全部裁切图标按文件名索引，如 CROP['c01-visit'] */
const cropFiles = import.meta.glob('../assets/crops/*.webp', { eager: true, import: 'default' }) as Record<string, string>
export const CROP: Record<string, string> = Object.fromEntries(Object.entries(cropFiles).map(([k, v]) => [k.split('/').pop()!.replace('.webp', ''), v]))
