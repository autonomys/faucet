import type { WalletType } from '@/constants/wallet'
import type { WalletAccount } from '@talismn/connect-wallets'

export interface WalletAccountWithType extends WalletAccount {
  type: WalletType
}
