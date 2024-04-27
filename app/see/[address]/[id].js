'use client';

import { useReadContract } from 'wagmi';
import { erc721Abi } from 'viem';
const auraContract = {};

export async function generateStaticParams() {
  return [];
}

export default function Page({params}) {

  const { aura } = useReadContract({
    ...auraContract,
    functionName: 'auraOf',
    args: [params.address, params.id],
  });

  const { metadataUrl } = useReadContract({
    address: params.address,
    abi: erc721Abi,
    functionName: 'metadataUri',
    args: [params.id],
  });

  const { imageUrl } = fetch(metadataUrl)?.image;

  return (
      <section className="section">
      <div className="container">
      if (aura > 0) {
        // CSS FILTER
        // SOUND EFFECT
      }
      <img href="{{imageUrl}}"/>
      </div>
      </section>
  );
}
