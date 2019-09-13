import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logic from '../logic';
import 'semantic-ui-css/semantic.min.css';
import { Container, Header, List, Segment, Label } from 'semantic-ui-react';

import DownloadButton from './download-button';
import ConvertButton from './convert-button';
import FileButton from './file-button';
import JsonArea from './json-area';
import Footer from './footer';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [downloadClicked, setDownloadClicked] = useState(false);

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
        <ToastContainer />

        <Segment basic>
          <Header as="h1">XLS to JSON converter</Header>
        </Segment>

        <Segment basic>
          <List horizontal>
            <List.Item>
              <FileButton
                onClick={e => {
                  setDownloadClicked(false);
                  onFileSelected(e);
                }}
                isLoading={isLoading}
              />
            </List.Item>
            <List.Item>
              <div hidden={selectedFile || isLoading}>
                <Label basic color="blue" pointing="left" size="huge">
                  Click here to select a XLS or CSV file
                </Label>
              </div>
            </List.Item>
          </List>
        </Segment>

        <Segment basic>
          <List horizontal>
            <List.Item>
              <ConvertButton
                fileName={logic.getFileName(selectedFile)}
                isLoading={isLoading}
                onClick={() => {
                  setDownloadClicked(false);
                  convert(selectedFile);
                }}
              />
            </List.Item>
            <List.Item>
              <div hidden={result || !selectedFile || isLoading}>
                <Label basic color="blue" pointing="left" size="huge">
                  Click here to convert the selected file to JSON
                </Label>
              </div>
            </List.Item>
          </List>
        </Segment>

        <Segment basic>
          <JsonArea
            isLoading={isLoading}
            content={logic.getResultJsonToDisplay(result)}
            onCopyToClipboardClick={() => logic.copyToClipboard(result)}
          />
        </Segment>

        <Segment basic>
          <List horizontal>
            <List.Item>
              <DownloadButton
                fileName={logic.getResultFileName(selectedFile, result)}
                isDisabled={!logic.hasResult(result)}
                href={logic.getResultHref(result)}
                onClick={() => setDownloadClicked(true)}
              />
            </List.Item>
            <List.Item>
              <div hidden={!result || isLoading || downloadClicked}>
                <Label basic color="blue" pointing="left" size="huge">
                  Click here to to download the converted JSON file
                </Label>
              </div>
            </List.Item>
          </List>
        </Segment>
      </Container>
      <Footer />
    </Container>
  );
};

export default App;
