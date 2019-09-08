import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DownloadButton from './download-button';
import ConvertButton from './convert-button';
import FileButton from './file-button';
import JsonArea from './json-area';
import Footer from './footer';

const isLoading = state => (state.isLoading ? true : false);
const hasResult = state => (state.result ? true : false);
const hasFile = state => (state.selectedFile ? true : false);
const getFileName = state => (state.selectedFile ? state.selectedFile.name : '');
const getResultFileName = state => (hasResult(state) && hasFile(state) ? `${state.selectedFile.name}.json` : '');
const getResultJson = state => (state.result ? JSON.stringify() : '');
const getResultJsonToDisplay = state => (state.result ? JSON.stringify(state.result, null, 2) : '');
const getResultHref = state =>
  state.result ? 'data:text/plain;charset=utf-8,' + encodeURIComponent(getResultJson(state)) : '';
const copyToClipboard = state => navigator.clipboard.writeText(getResultJsonToDisplay(state));

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0,
      isLoading: false,
      result: null
    };
  }

  onFileSelected = event => {
    var file = event.target.files[0];
    if (checkFileCount(event) && checkFileSize(event)) {
      this.setState({
        selectedFile: file,
        loaded: 0,
        result: null
      });
    }
  };
  
  convert = () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile);
    axios
      .post('/api/convert/toJson', data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
            isLoading: true,
            result: null
          });
        }
      })
      .then(res => {
        // then print response status
        this.setState({
          result: res.data,
          isLoading: false
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          result: null,
          isLoading: false
        });
        // then print response status
        toast.error('Conversion has failed');
      });
  };

  render() {
    return (
      <div>
        {/* <a href='https://github.com/itsjit/Xls2Json' className='github-ribbon'>
          <img
            width='149'
            height='149'
            src='https://github.blog/wp-content/uploads/2008/12/forkme_right_white_ffffff.png?resize=149%2C149'
            className='attachment-full size-full'
            alt='Fork me on GitHub'
            data-recalc-dims='1'
          ></img>
        </a> */}
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">XLS to JSON converter</h1>
              <ToastContainer />
              <FileButton onClick={this.onFileSelected} />
              <ConvertButton
                fileName={getFileName(this.state)}
                isLoading={isLoading(this.state)}
                onClick={this.convert}
              />
              <JsonArea
                isLoading={isLoading(this.state)}
                content={getResultJsonToDisplay(this.state)}
                onCopyToClipboardClick={() => copyToClipboard(this.state)}
              />
              <DownloadButton
                fileName={getResultFileName(this.state)}
                isDisabled={hasResult(this.state)}
                href={getResultHref(this.state)}
              />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

export default App;
