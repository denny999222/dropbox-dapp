// In order to connect a dapp you need 2 main components:
// 1) A Web3 Instance (Web3 is the class, and we can created instances of this class with different providers) [new Web3(provider)]
// 2) A Provider (metamask, ganache, [ie: RPC Server Node Url]). This allows us to access blockchain data
import Web3 from "web3"; // this library allows you to create a web3 instance

const resolveWeb3 = async (resolve) => {
  let { ethereum, web3 } = window;
  const localProvider = `http://localhost:7545`;
  const alreadyInjected = typeof ethereum !== "undefined"; // i.e. Mist/Metamask

  if (alreadyInjected) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    // no web3 instance injected, using local provider (ganache in our case)
    console.log(`No web3 instance injected, using Local web3.`);
    const provider = new Web3.providers.HttpProvider(localProvider);
    web3 = new Web3(provider);
  }
  resolve(web3);
};

export default () =>
  new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolveWeb3(resolve);
    });
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      resolveWeb3(resolve);
    }
  });
