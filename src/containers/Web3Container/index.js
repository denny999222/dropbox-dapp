import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import getContract from "./getContract";
import contractDefinition from "../../build/contracts/SimpleStorage.json";

const Web3Container = ({ render, renderLoading }) => {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();

  useEffect(() => {
    loadWeb3();
  }, []);

  const loadWeb3 = async () => {
    try {
      const _web3 = await getWeb3();
      const _accounts = await web3.eth.getAccounts();
      const _contract = await getContract(web3, contractDefinition);
      setWeb3(_web3);
      setAccounts(_accounts);
      setContract(_contract);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  return web3 && accounts
    ? render({ web3, accounts, contract })
    : renderLoading();
};
