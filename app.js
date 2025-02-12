document.addEventListener('DOMContentLoaded', function() {
    let web3;
    let contract;
    const contractAddress = '0x7067605230d5d131BDD073982eFC698a4766FFA5';
    const contractABI = [
        {
            "constant": false,
            "inputs": [],
            "name": "depositFunds",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "getAccountBalance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        // Add other ABI entries here
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
    document.getElementById('getBalanceButton').addEventListener('click', getAccountBalance);
});
