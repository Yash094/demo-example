"use client";

import React from "react";
import { polygon } from "thirdweb/chains";
import { ConnectButton, TransactionWidget } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "./client";

export default function Home() {

  // Create contract instance
  const nftContract = getContract({
    address: "0xf12B7F9d8De17295eA10BCEA00d5B7dFb9EA527b",
    client,
    chain: polygon,
  });

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <ConnectButton
        client={client}
        chain={polygon}
      />
        <div className="flex flex-col items-center gap-4">
          <TransactionWidget
            client={client}
            transaction={prepareContractCall({
              contract: nftContract,
              method: "function purchaseNFT(uint256 _listingId, uint256 _amount) payable",
              params: [BigInt("5"), 1n], // Fixed quantity of 1
              value: 86956521739130432n,
            })}
            amount="0.086956521739130432"
          />
        </div>
  
    </div>
  );
}
