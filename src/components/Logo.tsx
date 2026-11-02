import { IMG } from '../mock/images'
export function Logo({ size = 28 }: { size?: number }) {
  return <img src={IMG.logo} width={size} height={size} alt="logo" style={{ display: 'block' }} />
}
