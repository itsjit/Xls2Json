import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logic from '../logic';
import 'semantic-ui-css/semantic.min.css';
import { Container, Header, Segment } from 'semantic-ui-react';

import DownloadButton from './download-button';
import ConvertButton from './convert-button';
import FileButton from './file-button';
import JsonArea from './json-area';
import Footer from './footer';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onFileSelected = event => {
    var file = event.target.files[0];
    if (logic.checkFileCount(event) && logic.checkFileSize(event)) {
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
          setResult(null);
          setIsLoading(true);
        }
      })
      .then(result => {
        // then print response status
        setResult(result.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setResult(null);
        setIsLoading(false);
        // then print response status
        toast.error(`Conversion has failed${error.message ? error.message : ''}`);
      });
  };

  return (
    <Container>
      <Container>
        <Segment basic>
          <Header as="h1">XLS to JSON converter</Header>
        </Segment>

        <ToastContainer />
        <FileButton onClick={onFileSelected} isLoading={isLoading} />
        <ConvertButton
          fileName={logic.getFileName(selectedFile)}
          isLoading={isLoading}
          onClick={() => convert(selectedFile)}
        />
        <JsonArea
          isLoading={isLoading}
          content={logic.getResultJsonToDisplay(result)}
          onCopyToClipboardClick={() => logic.copyToClipboard(result)}
        />
        <DownloadButton
          fileName={logic.getResultFileName(selectedFile, result)}
          isDisabled={!logic.hasResult(result)}
          href={logic.getResultHref(result)}
        />
      </Container>
      <Footer />
    </Container>
  );
};

export default App;
