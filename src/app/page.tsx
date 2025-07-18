"use client";

import React, { useState } from "react";
import { polygon } from "thirdweb/chains";
import { ConnectButton, useActiveAccount, TransactionWidget } from "thirdweb/react";
import { prepareContractCall, getContract, toWei } from "thirdweb";
import { client } from "./client";

export default function Home() {
  const account = useActiveAccount();
  const [quantity, setQuantity] = useState(1);
  const [listingId, setListingId] = useState(1);
  const [price, setPrice] = useState("0.001");

  // Mock NFT data - replace with your actual NFT data
  const nft = {
    listingId: listingId,
    metadata: {
      name: "Sample NFT",
      description: "This is a sample NFT for demonstration",
      image: "https://example.com/nft-image.png"
    }
  };

  // Create contract instance
  const nftContract = getContract({
    address: "0xf12B7F9d8De17295eA10BCEA00d5B7dFb9EA527b",
    client,
    chain: polygon,
  });

  // Create claimTo function
  const claimTo = ({ contract, quantity, tokenId, to, price }: {
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
      method: "function purchaseNFT(uint256 _listingId, uint256 _amount) payable",
      params: [tokenId, quantity],
      value: priceInWei,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <ConnectButton
        client={client}
        
      />
      
              {account && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Listing ID:</label>
                <input
                  type="number"
                  min="1"
                  value={listingId}
                  onChange={(e) => setListingId(parseInt(e.target.value) || 1)}
                  className="border rounded px-2 py-1 flex-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Price (ETH):</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="border rounded px-2 py-1 flex-1"
                />
              </div>
            </div>
            
            <TransactionWidget
              client={client}
              transaction={claimTo({
                contract: nftContract,
                quantity: BigInt(quantity),
                tokenId: BigInt(nft.listingId),
                to: account?.address || "",
                price: price,
              }) as any}
              title={nft?.metadata?.name}
              description={nft?.metadata?.description}
              image={nft?.metadata?.image}
            />
          </div>
        )}
    </div>
  );
}