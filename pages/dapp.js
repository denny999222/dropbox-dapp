import React from "react";

// CONTAINER
import Web3Container from "@containers/Web3Container";

// SUBCOMPONENT
import Dapp from "@components/pages/dapp";

const DappPage = ({}) => {
  return (
    <Web3Container
      renderLoading={() => <div>Loading Dapp Page...</div>}
      render={({ web3, accounts, contract }) => (
        <Dapp {...{ web3, accounts, contract }} />
      )}
    />
  );
};

export default DappPage;
