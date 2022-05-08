// SETUP
import React, { useState, useRef } from "react";
import Link from "next/link";
import { create } from "ipfs-http-client";

import moment from "moment";

const IPFS = create("https://ipfs.infura.io:5001/api/v0");

const Dapp = ({ web3, accounts, contract }) => {
  const [totalFiles, setTotalFiles] = useState(0);
  const [files, setFiles] = useState([]);
  const [ethBalance, setEthBalance] = useState();

  const [localFile, setLocalFile] = useState();
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");

  const [loading, setLoading] = useState(false);

  const FORM_REF = useRef();

  const getFiles = async () => {
    const fileCount = await contract.methods.fileCount().call();
    let newFiles = [];
    for (let i = fileCount; i >= 1; i--) {
      const file = await contract.methods.files(i).call();
      newFiles.push(file);
    }
    setFiles(newFiles);
    setTotalFiles(fileCount);
  };

  const getEthBalance = async () => {
    const balanceInWei = await web3.eth.getBalance(accounts[0]);
    setEthBalance(balanceInWei / 1e18);
  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setLocalFile(file);
    setFileType(file.type);
    setFileName(file.name);
  };

  const uploadFile = async (description) => {
    console.log("Submitting file to IPFS...");
    // Add file to the IPFS
    const addedFile = await IPFS.add(localFile);
    setLoading(true);
    // Assign value for the file without extension
    if (fileType == "") setFileType("none");

    contract.methods
      .uploadFile(
        addedFile.path,
        addedFile.size,
        fileType,
        fileName,
        description
      )
      .send({ from: accounts[0] })
      .on("transactionHash", (hash) => {
        setFileName("");
        setFileType("");
        setLoading(true);
        window.location.reload();
      })
      .on("error", (e) => {
        window.alert("Error");
        setLoading(false);
      });
  };

  function convertBytes(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  return (
    <div>
      <h1>IPFS File Storage</h1>
      <button onClick={getFiles}>Get Files</button>
      <button onClick={getEthBalance}>Get ether balance</button>
      <div>Total Files: {totalFiles}</div>
      <div>Ether Balance: {ethBalance}</div>
      <div>
        <Link href="/accounts">
          <a>My Accounts</a>
        </Link>
      </div>
      <div>
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>
      <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: "512px" }}>
        <h2 className="text-white text-monospace bg-dark">
          <b>
            <ins>Share File</ins>
          </b>
        </h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const description = FORM_REF.current.value;
            uploadFile(description);
          }}
        >
          <div className="form-group">
            <br></br>
            <input
              id="fileDescription"
              type="text"
              ref={FORM_REF}
              className="form-control text-monospace"
              placeholder="description..."
              required
            />
          </div>
          <input
            type="file"
            onChange={captureFile}
            className="text-white text-monospace"
          />
          <button type="submit" className="btn-primary btn-block">
            <b>Upload!</b>
          </button>
        </form>
      </div>
      <table
        className="table-sm table-bordered text-monospace"
        style={{ width: "1000px", maxHeight: "450px" }}
      >
        <thead style={{ fontSize: "15px" }}>
          <tr className="bg-dark text-white">
            <th scope="col" style={{ width: "10px" }}>
              id
            </th>
            <th scope="col" style={{ width: "200px" }}>
              name
            </th>
            <th scope="col" style={{ width: "230px" }}>
              description
            </th>
            <th scope="col" style={{ width: "120px" }}>
              type
            </th>
            <th scope="col" style={{ width: "90px" }}>
              size
            </th>
            <th scope="col" style={{ width: "90px" }}>
              date
            </th>
            <th scope="col" style={{ width: "120px" }}>
              uploader/view
            </th>
            <th scope="col" style={{ width: "120px" }}>
              hash/view/get
            </th>
          </tr>
        </thead>
        {files.map((_file) => {
          return (
            <thead style={{ fontSize: "12px" }} key={_file.fileHash}>
              <tr>
                <td>{_file.fileId}</td>
                <td>{_file.fileName}</td>
                <td>{_file.fileDescription}</td>
                <td>{_file.fileType}</td>
                <td>{convertBytes(_file.fileSize)}</td>
                <td>
                  {moment.unix(_file.uploadTime).format("h:mm:ss A M/D/Y")}
                </td>
                <td>
                  <a
                    href={"https://etherscan.io/address/" + _file.uploader}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {_file.uploader.substring(0, 10)}...
                  </a>
                </td>
                <td>
                  <a
                    href={"https://ipfs.infura.io/ipfs/" + _file.fileHash}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {_file.fileHash.substring(0, 10)}...
                  </a>
                </td>
              </tr>
            </thead>
          );
        })}
      </table>
    </div>
  );
};

export default Dapp;
