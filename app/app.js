// Initialize the web3 object
const web3 = new Web3(window.ethereum);

// Set up the contract with address and ABI
const contractAddress = '0x0F411fa8E47092Bc14779bb78eeEAfe8c7E46239';
const contractAbi = [{
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "patient",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "dob",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "diagnosis",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "gender",
            "type": "string"
        }
    ],
    "name": "RecordCreated",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "patient",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "dob",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "diagnosis",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "gender",
            "type": "string"
        }
    ],
    "name": "RecordUpdated",
    "type": "event"
},
{
    "inputs": [],
    "name": "admin",
    "outputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "name": "patientRecords",
    "outputs": [
        {
            "internalType": "string",
            "name": "name",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "dob",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "diagnosis",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "gender",
            "type": "string"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [
        {
            "internalType": "string",
            "name": "_name",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "_dob",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "_diagnosis",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "_gender",
            "type": "string"
        }
    ],
    "name": "createRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "address",
            "name": "_patient",
            "type": "address"
        },
        {
            "internalType": "string",
            "name": "_name",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "_dob",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "_diagnosis",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "_gender",
            "type": "string"
        }
    ],
    "name": "updateRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "address",
            "name": "_patient",
            "type": "address"
        }
    ],
    "name": "viewRecord",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
}];
const rekamMedisContract = new web3.eth.Contract(contractAbi, contractAddress);

// Function to check if the record already exists
async function checkRecord(patientAddress) {
    try {
        const result = await rekamMedisContract.methods.patientRecords(patientAddress).call();
        return result.dob.toString() !== "0";
    } catch (error) {
        console.error("Error checking record:", error);
        return false;
    }
}

// Function to view a record based on the patient's address
async function viewRecordButton() {
    try {
        const patientAddress = document.getElementById("patientAddress").value;
        await viewRecord(patientAddress);
    } catch (error) {
        console.error("Error in viewRecordButton:", error);
    }
}

// Function to view a record based on the patient's address
async function viewRecord(patientAddress) {
    try {
        const result = await rekamMedisContract.methods.patientRecords(patientAddress).call();
        document.getElementById("checkRecordResult").innerText =
            `Name: ${result.name}\nDate of Birth: ${result.dob}\nDiagnosis: ${result.diagnosis}\nGender: ${result.gender}`;
    } catch (error) {
        console.error("Error viewing record:", error);
        document.getElementById("checkRecordResult").innerText = "Record does not exist.";
    }
}

// Function to add a new record
async function addRecordButton() {
    try {
        // Ensure the user has given permission
        await window.ethereum.enable();

        // Get the user's address
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Get values from the form
        const newName = document.getElementById("addNewName").value;
        const newDob = new Date(document.getElementById("addNewDob").value).getTime() / 1000;
        const newDiagnosis = document.getElementById("addNewDiagnosis").value;
        const newGender = document.getElementById("addNewGender").value; // Added gender

        // Check if the record already exists
        const recordExists = await checkRecord(userAddress);

        if (recordExists) {
            // Display message in messageDiv
            document.getElementById("messageDiv").innerText = "Record already exists for the patient address.";
        } else {
            // Send the transaction with the user's address as the sender
            await rekamMedisContract.methods
                .createRecord(newName, newDob, newDiagnosis, newGender)
                .send({ from: userAddress, gas: 2000000 }); // Adjust the gas value as needed

            // Display success message in messageDiv
            document.getElementById("messageDiv").innerText = "Record created successfully";
        }
    } catch (error) {
        console.error("Error creating record:", error);

        // Display error message in messageDiv
        document.getElementById("messageDiv").innerText = "Error creating record. Please check the console for details.";
    }
}
