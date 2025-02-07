// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RekamMedis {
    address public admin;
    mapping(address => PatientRecord) public patientRecords;

    struct PatientRecord {
        string name;
        uint256 dob;
        string diagnosis;
        string gender; // Added the gender field
    }

    event RecordCreated(
        address indexed patient,
        string name,
        uint256 dob,
        string diagnosis,
        string gender // Updated the event to include gender
    );
    event RecordUpdated(
        address indexed patient,
        string name,
        uint256 dob,
        string diagnosis,
        string gender // Updated the event to include gender
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can execute this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createRecord(
        string memory _name,
        uint256 _dob,
        string memory _diagnosis,
        string memory _gender // Added the gender parameter
    ) external {
        require(patientRecords[msg.sender].dob == 0, "Record already exists");

        PatientRecord storage newRecord = patientRecords[msg.sender];
        newRecord.name = _name;
        newRecord.dob = _dob;
        newRecord.diagnosis = _diagnosis;
        newRecord.gender = _gender; // Set the gender

    }

    function updateRecord(
        address _patient,
        string memory _name,
        uint256 _dob,
        string memory _diagnosis,
        string memory _gender // Added the gender parameter
    ) external onlyAdmin {
        PatientRecord storage record = patientRecords[_patient];
        require(
            record.dob != 0,
            "Record does not exist, create the record first"
        );

        record.name = _name;
        record.dob = _dob;
        record.diagnosis = _diagnosis;
        record.gender = _gender; // Update the gender

        emit RecordUpdated(_patient, _name, _dob, _diagnosis, _gender); // Updated the event to include gender
    }

    function viewRecord(
        address _patient
    )
        external
        view
        returns (
            string memory,
            uint256,
            string memory,
            string memory // Updated the return type to include gender
        )
    {
        PatientRecord storage record = patientRecords[_patient];
        require(record.dob != 0, "Record does not exist");

        return (record.name, record.dob, record.diagnosis, record.gender); // Include the gender
    }
}
