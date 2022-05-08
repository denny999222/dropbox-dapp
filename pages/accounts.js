import React from "react";

// CONTAINER
import Web3Container from "@containers/Web3Container";

// SUBCOMPONENTS
import Accounts from "@components/pages/accounts";

const AccountsPage = ({}) => {
  return (
    <Web3Container
      renderLoading={() => <div>Loading Accounts Page...</div>}
      render={({ web3, accounts, contract }) => (
        <Accounts {...{ web3, accounts, contract }} />
      )}
    />
  );
};

export default AccountsPage;
