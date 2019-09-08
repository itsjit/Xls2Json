import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DownloadButton from './download-button';
import ConvertButton from './convert-button';
import FileButton from './file-button';
import JsonArea from './json-area';
import Footer from './footer';

const hasResult = result => (result ? true : false);
const hasFile = selectedFile => (selectedFile ? true : false);
const getFileName = selectedFile => (selectedFile ? selectedFile.name : '');
const getResultFileName = (selectedFile, result) =>
  hasResult(result) && hasFile(selectedFile) ? `${selectedFile.name}.json` : '';
const getResultJson = result => (result ? JSON.stringify() : '');
const getResultJsonToDisplay = result => (result ? JSON.stringify(result, null, 2) : '');
const getResultHref = result =>
  result ? 'data:text/plain;charset=utf-8,' + encodeURIComponent(getResultJson(result)) : '';
const copyToClipboard = result => navigator.clipboard.writeText(getResultJsonToDisplay(result));

const checkFileCount = event => {
  let files = event.target.files;
  if (files.length > 1) {
    const msg = 'Only 1 file can be uploaded at a time';
    event.target.value = null;
    toast.warn(msg);
    return false;
  }
  return true;
};
const checkFileSize = event => {
  let files = event.target.files;
  let size = 2000000;
  let err = [];
  for (var x = 0; x < files.length; x++) {
    if (files[x].size > size) {
      err[x] = files[x].name + ' is too large, please pick a smaller file\n';
    }
  }
  for (var z = 0; z < err.length; z++) {
    toast.error(err[z]);
    event.target.value = null;
  }
  return true;
};

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onFileSelected = event => {
    var file = event.target.files[0];
    if (checkFileCount(event) && checkFileSize(event)) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const convert = selectedFile => {
    const data = new FormData();
    data.append('file', selectedFile);
    axios
      .post('/api/convert/toJson', data, {
        onUploadProgress: ProgressEvent => {
          setIsLoading(true);
          setResult(null);
        }
      })
      .then(res => {
        // then print response status
        setResult(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setResult(null);
        setIsLoading(false);
        // then print response status
        toast.error('Conversion has failed');
      });
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">XLS to JSON converter</h1>
            <ToastContainer />
            <FileButton onClick={onFileSelected} isLoading={isLoading} />
            <ConvertButton
              fileName={getFileName(selectedFile)}
              isLoading={isLoading}
              onClick={() => convert(selectedFile)}
            />
            <JsonArea
              isLoading={isLoading}
              content={getResultJsonToDisplay(result)}
              onCopyToClipboardClick={() => copyToClipboard(result)}
            />
            <DownloadButton
              fileName={getResultFileName(selectedFile, result)}
              isDisabled={hasResult(result)}
              href={getResultHref(result)}
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default App;
