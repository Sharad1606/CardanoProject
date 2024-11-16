// services/blockfrost.service.ts
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export const blockfrost = new BlockFrostAPI({
  projectId: process.env.BLOCKFROST_API_KEY as string,
  network: 'preprod', // Indicates usage of the preprod network
});
