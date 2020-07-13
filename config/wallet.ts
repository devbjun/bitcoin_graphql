import { bip32, networks } from 'bitcoinjs-lib'

const seed = 'f99a56a0f7d93c81e0b05c740a1ba906'

export default {
  root: bip32.fromSeed(Buffer.from(seed, 'hex')),
  network: networks.testnet,
  api_key: 'A___E5hRwkGgxAFYLd9HlVOdKmnv20Xw',
}
