document.addEventListener('DOMContentLoaded', function() {
    let web3;
    let contract;
    const contractAddress = '0x7067605230d5d131BDD073982eFC698a4766FFA5';
    const contractABI = [
        // ABI content
    ];

    async function connect() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                contract = new web3.eth.Contract(contractABI, contractAddress);
                const accounts = await web3.eth.getAccounts();
                document.getElementById('account').innerText = `Connected account: ${accounts[0]}`;
            } catch (error) {
                console.error('User denied account access or there was an error:', error);
            }
        } else if (typeof window.web3 !== 'undefined') {
            web3 = new Web3(window.web3.currentProvider);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await web3.eth.getAccounts();
            document.getElementById('account').innerText = `Connected account: ${accounts[0]}`;
        } else {
            alert('MetaMask is not installed! Please install it to use this application.');
        }
    }

    async function depositFunds() {
        const accounts = await web3.eth.getAccounts();
        const amount = web3.utils.toWei(document.getElementById('depositAmount').value, 'ether');
        await contract.methods.depositFunds().send({ from: accounts[0], value: amount });
    }

    async function withdrawFunds() {
        const accounts = await web3.eth.getAccounts();
        const amount = web3.utils.toWei(document.getElementById('withdrawAmount').value, 'ether');
        await contract.methods.withdrawFunds(amount).send({ from: accounts[0] });
    }

    async function withdrawApprovedFunds() {
        const accounts = await web3.eth.getAccounts();
        const owner = document.getElementById('withdrawApprovedOwner').value;
        const amount = web3.utils.toWei(document.getElementById('withdrawApprovedAmount').value, 'ether');
        await contract.methods.withdrawApprovedFunds(owner, amount).send({ from: accounts[0] });
    }

    async function approvePayment() {
        const accounts = await web3.eth.getAccounts();
        const amount = web3.utils.toWei(document.getElementById('approveAmount').value, 'ether');
        await contract.methods.approvePayment(amount).send({ from: accounts[0] });
    }

    async function approveWithdrawal() {
        const accounts = await web3.eth.getAccounts();
        const spender = document.getElementById('approveSpender').value;
        const amount = web3.utils.toWei(document.getElementById('approveWithdrawalAmount').value, 'ether');
        await contract.methods.approveWithdrawal(spender, amount).send({ from: accounts[0] });
    }

    async function getAccountBalance() {
        const accountAddress = document.getElementById('accountAddress').value;
        try {
            const balance = await contract.methods.getAccountBalance(accountAddress).call();
            document.getElementById('accountBalance').innerText = `Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`;
        } catch (error) {
            console.error(error);
        }
    }

    document.getElementById('connectButton').addEventListener('click', connect);
    document.getElementById('depositButton').addEventListener('click', depositFunds);
    document.getElementById('withdrawButton').addEventListener('click', withdrawFunds);
    document.getElementById('withdrawApprovedFundsButton').addEventListener('click', withdrawApprovedFunds);
    document.getElementById('approvePaymentButton').addEventListener('click', approvePayment);
    document.getElementById('approveWithdrawalButton').addEventListener('click', approveWithdrawal);
    document.getElementById('getBalanceButton').addEventListener('click', getAccountBalance);
});


