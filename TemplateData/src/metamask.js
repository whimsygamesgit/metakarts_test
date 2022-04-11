async function metamaskSign(jsString){
    console.log(jsString);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const defaultAccount = accounts[0];
    console.info(defaultAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    var signedMessage = await signer.signMessage(jsString);
    console.log(signedMessage);
    return JSON.stringify({"account": defaultAccount, "sign": signedMessage});
}
