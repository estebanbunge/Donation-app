document.addEventListener('DOMContentLoaded', function() {
    let web3;
    let contract;
    const contractAddress = '0x7067605230d5d131BDD073982eFC698a4766FFA5';
    const contractABI = [
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ApprovalForWithdrawal","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ApprovalForWithdrawal","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},
        {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"accountAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"approvePayment","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"approveWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"approvedAmounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"approvedWithdrawals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"depositFunds","outputs":[],"stateMutability":"payable","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getAccountAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"getAccountCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getApprovedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawApprovedFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}
    ];

    async function connect() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                contract = new web3.eth.Contract(contractABI, contractAddress);
                const accounts = await web3.eth.getAccounts();
                document.getElementById('account').innerText = `Connected account: ${accounts[0]}`;
            } catch (error) {
                console.error('User denied account access or there was an error:', error);
            }
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await web3.eth.getAccounts();
            document.getElementById('account').innerText = `Connected account: ${accounts[0]}`;
        } else {
            alert('MetaMask is not installed! Please install it to use this application.');
        }
    }

    async function depositFunds() {
        try {
            const accounts = await web3.eth.getAccounts();
            const amount = web3.utils.toWei(document.getElementById('depositAmount').value, 'ether');
            await contract.methods.depositFunds().send({ from: accounts[0], value: amount });
            console.log('Deposit successful');
        } catch (error) {
            console.error('Error depositing funds:', error);
        }
    }

    async function withdrawFunds() {
        try {
            const accounts = await web3.eth.getAccounts();
            const amount = web3.utils.toWei(document.getElementById('withdrawAmount').value, 'ether');
            await contract.methods.withdrawFunds(amount).send({ from: accounts[0] });
            console.log('Withdrawal successful');
        } catch (error) {
            console.error('Error withdrawing funds:', error);
        }
    }

    async function withdrawApprovedFunds() {
        try {
            const accounts = await web3.eth.getAccounts();
            const owner = document.getElementById('withdrawApprovedOwner').value;
            const amount = web3.utils.toWei(document.getElementById('withdrawApprovedAmount').value, 'ether');
            await contract.methods.withdrawApprovedFunds(owner, amount).send({ from: accounts[0] });
            console.log('Approved withdrawal successful');
        } catch (error) {
            console.error('Error withdrawing approved funds:', error);
        }
    }

    async function approvePayment() {
        try {
            const accounts = await web3.eth.getAccounts();
            const amount = web3.utils.toWei(document.getElementById('approveAmount').value, 'ether');
            await contract.methods.approvePayment(amount).send({ from: accounts[0] });
            console.log('Payment approved');
        } catch (error) {
            console.error('Error approving payment:', error);
        }
    }

    async function approveWithdrawal() {
        try {
            const accounts = await web3.eth.getAccounts();
            const spender = document.getElementById('approveSpender').value;
            const amount = web3.utils.toWei(document.getElementById('approveWithdrawalAmount').value, 'ether');
            await contract.methods.approveWithdrawal(spender, amount).send({ from: accounts[0] });
            console.log('Withdrawal approved');
        } catch (error) {
            console.error('Error approving withdrawal:', error);
        }
    }

    async function getAccountBalance() {
        try {
            const accountAddress = document.getElementById('accountAddress').value;
            console.log('Getting balance for:', accountAddress);
            const balance = await contract.methods.getAccountBalance(accountAddress).call();
            document.getElementById('accountBalance').innerText = `Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`;
            console.log('Get account balance successful:', balance);
        } catch (error) {
            console.error('Error getting account balance:', error);
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
