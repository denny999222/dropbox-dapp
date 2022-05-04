// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DStorage {
    string public name = "DStorage";
    uint public fileCount = 0; // we'll just use this as fileId for now and increment it...
    mapping(uint => File) public files;

    // Struct for our own "File" Object
    struct File {
        uint fileId;
        string fileHash;
        uint fileSize;
        string fileType;
        string fileName;
        string fileDescription;
        uint uploadTime;
        address payable uploader;
    }

    event FileUploaded (
        uint fileId,
        string fileHash,
        uint fileSize,
        string fileType,
        string fileName,
        string fileDescription,
        uint uploadTime,
        address payable uploader
    );

    constructor() public {}

    // Upload File Function
    function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
        require(bytes(_fileHash).length > 0); // make sure fileHash exist
        require(bytes(_fileType).length > 0); // make sure fileType exist
        require(bytes(_fileDescription).length > 0); // make sure fileDescription exist
        require(bytes(_fileName).length > 0); // make sure fileName exist
        require(msg.sender != address(0)); // make sure uploader address exist
        require(_fileSize > 0); // make sure _fileSize is more than 0

        fileCount ++;
        // "now" just current time
        files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, block.timestamp, payable(msg.sender));

        // keep track of this event
        emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, block.timestamp, payable(msg.sender));
    }

}