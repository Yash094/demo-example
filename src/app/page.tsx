"use client";

import React, { useState } from "react";
import { polygon } from "thirdweb/chains";
import {
  ConnectButton,
  useActiveAccount,
  TransactionWidget,
} from "thirdweb/react";
import { prepareContractCall, getContract, toWei } from "thirdweb";
import { client } from "./client";

export default function Home() {
  const account = useActiveAccount();

  // Mock NFT data - replace with your actual NFT data
  const nft = {
    listingId: 5,
    metadata: {
      name: "Sample NFT",
      description: "This is a sample NFT for demonstration",
      image: "https://example.com/nft-image.png",
    },
  };

  // Create contract instance
  const nftContract = getContract({
    address: "0xf12B7F9d8De17295eA10BCEA00d5B7dFb9EA527b",
    client,
    chain: polygon,
  });

  // Create claimTo function
  const claimTo = ({
    contract,
    quantity,
    tokenId,
    to,
    price,
  }: {
    contract: any;
    quantity: bigint;
    tokenId: bigint;
    to: string;
    price: string;
  }) => {
    // Convert price to wei using thirdweb's toWei
    const priceInWei = toWei(price);

    return prepareContractCall({
      contract,
      method:
        "function purchaseNFT(uint256 _listingId, uint256 _amount) payable",
      params: [tokenId, quantity],
      value: priceInWei,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <ConnectButton client={client} chain={polygon}  />

      {account && (
        <div className="flex flex-col items-center gap-4">
          <TransactionWidget
            client={client}
            transaction={
              claimTo({
                contract: nftContract,
                quantity: BigInt(1),
                tokenId: BigInt(nft.listingId),
                to: account?.address || "",
                price: "0.086956521739130432",
              }) as any
            }
            title={nft?.metadata?.name}
            description={nft?.metadata?.description}
            image={nft?.metadata?.image}
          />
        </div>
      )}
    </div>
  );
}
