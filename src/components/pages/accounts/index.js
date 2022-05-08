import React from "react";
import Link from "next/link";

const Accounts = ({ web3, accounts, contract }) => {
  return (
    <div>
      <h1>My Accounts</h1>
      <pre>{JSON.stringify(accounts, null, 4)}</pre>
      <div>
        <Link href="/dapp">
          <a>My Dapp</a>
        </Link>
      </div>
      <div>
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>
    </div>
  );
};

export default Accounts;
