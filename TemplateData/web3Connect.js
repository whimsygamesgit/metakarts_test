let callback;

async function initCallback(callback) {
    this.callback = callback;
    return true;
}

async function requestMetamaskAuth(phrase) {
    if (checkMetamaskInstalled()) {
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const network = await provider.getNetwork();
            const currentChainId = network.chainId;

            const account = await requetsAccount();
            const signer = getSigner(account);
            const signedMessage = await signer.signMessage(phrase);

            CompleteCallback('MetamaskService', 'ConnectToMetamaskHandler',
                JSON.stringify({
                    address: account,
                    message: phrase,
                    signature: signedMessage
                }));
        }
        catch (e) {
            CompleteCallback('MetamaskService', 'MetamaskErrorHandler', e.message);
        }
    }
}

async function getBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const account = await requetsAccount();
    const balance = await provider.getBalance(account);
    const balanceInEth = ethers.utils.formatEther(balance);

    console.log("Balance get");

    CompleteCallback('MetamaskService', 'CompleteGetBalance',
        JSON.stringify({
            balance: balanceInEth
        }));
}

function checkMetamaskInstalled() {
    if (window.ethereum != undefined && window.ethereum.isMetaMask) {
        return true;
    } else {
        CompleteCallback('MetamaskService', 'MetamaskErrorHandler', JSON.stringify({
            type: 'ConnectToMetamask',
            message: 'Metamask is not installed'
        }));
        return false;
    }
}

async function requetsAccount() {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    return account = accounts[0];
}

function getSigner(account) {
    return getMetamaskProvider().getSigner(account);
}

function getMetamaskProvider() {
    return new ethers.providers.Web3Provider(window.ethereum);
}
