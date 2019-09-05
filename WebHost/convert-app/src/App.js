import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Textarea from 'react-textarea-autosize';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      fileName: 'No file.',
      jsonFileName: 'No name.',
      loaded: 0,
      loading: false,
      result: null
    };
  }

  maxSelectFile = event => {
    let files = event.target.files;
    if (files.length > 1) {
      const msg = 'Only 1 file can be uploaded at a time';
      event.target.value = null;
      toast.warn(msg);
      return false;
    }
    return true;
  };
  checkFileSize = event => {
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
  onChangeHandler = event => {
    var file = event.target.files[0];
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      this.setState({
        selectedFile: file,
        fileName: file.name,
        jsonFileName: file.name + '.json',
        loaded: 0,
        result: null
      });
    }
  };
  onClickHandler = () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile);
    axios
      .post('/api/convert/toJson', data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
            loading: true,
            result: null
          });
        }
      })
      .then(res => {
        // then print response status
        this.setState({
          result: res.data,
          loading: false
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          result: null,
          loading: false
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
        <section className='hero'>
          <div className='hero-body'>
            <div className='container'>
              <h1 className='title'>XLS to JSON converter</h1>
              <ToastContainer />
              <div className='field'>
                <div className='file is-large is-boxed has-name'>
                  <label className='file-label'>
                    <input
                      className='file-input'
                      type='file'
                      name='resume'
                      onChange={this.onChangeHandler}
                    ></input>
                    <span className='file-cta'>
                      <span className='file-icon'>
                        <i className='fas fa-file-import'></i>
                      </span>
                      <span className='file-label'>Open file…</span>
                    </span>
                  </label>
                </div>
              </div>
              <div className='field has-addons'>
                <div className='control'>
                  <span
                    className={
                      'file-cta input is-large file-name' +
                      (this.state.selectedFile ? '' : ' is-hidden')
                    }
                  >
                    {this.state.fileName}
                  </span>
                </div>
                <div className='control'>
                  <button
                    className={
                      'button is-large' +
                      (this.state.loading ? ' is-loading' : '')
                    }
                    onClick={this.onClickHandler}
                    disabled={!this.state.selectedFile}
                  >
                    <span className='icon is-medium'>
                      <i className='fas fa-sync-alt'></i>
                    </span>
                    <span>Convert</span>
                  </button>
                </div>
              </div>
              <div className='field code'>
                <div
                  className={
                    'control' + (this.state.loading ? ' is-loading' : '')
                  }
                >
                  <Textarea
                    className='textarea'
                    minRows={3}
                    maxRows={20}
                    ref={textarea => (this.textArea = textarea)}
                    value={
                      this.state.result
                        ? JSON.stringify(this.state.result, null, 2)
                        : ''
                    }
                    readOnly
                  ></Textarea>
                </div>
                <button
                  className={
                    'button button-copy' +
                    (this.state.result ? '' : ' is-hidden')
                  }
                  disabled={!this.state.result}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(this.state.result, null, 2)
                    );
                  }}
                >
                  <span className='icon is-medium'>
                    <i className='fas fa-paste'></i>
                  </span>
                </button>
              </div>
              <div className='field has-addons'>
                <div className='control'>
                  <span
                    className={
                      'file-cta input is-large file-name' +
                      (this.state.result ? '' : ' is-hidden')
                    }
                  >
                    {this.state.jsonFileName}
                  </span>
                </div>
                <div className='control'>
                  <a
                    className='button is-large'
                    href={
                      this.state.result
                        ? 'data:text/plain;charset=utf-8,' +
                          encodeURIComponent(
                            JSON.stringify(this.state.result, null, 2)
                          )
                        : ''
                    }
                    download={this.state.result ? this.state.jsonFileName : ''}
                    disabled={!this.state.result}
                  >
                    <span className='icon is-medium'>
                      <i className='fas fa-cloud-download-alt'></i>
                    </span>
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className='footer'>
          <div className='content has-text-centered'>
            &copy; {new Date().getFullYear()} - Itsjit
          </div>
          <nav className='level'>
            <div className='level-item has-text-centered'>
              <div>
                <a href='mailto:itsthejit@gmail.com'>
                  <span className='icon is-large'>
                    <i className='fas fa-envelope fa-3x'></i>
                  </span>
                </a>
              </div>
            </div>
            <div className='level-item has-text-centered'>
              <div>
                <form
                  action='https://www.paypal.com/cgi-bin/webscr'
                  method='post'
                  target='_top'
                >
                  <input type='hidden' name='cmd' value='_donations' />
                  <input type='hidden' name='business' value='XRU8BVY737BTS' />
                  <input type='hidden' name='currency_code' value='CZK' />
                  <input
                    type='image'
                    src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif'
                    border='0'
                    name='submit'
                    title='PayPal - The safer, easier way to pay online!'
                    alt='Donate with PayPal button'
                  />
                </form>
              </div>
            </div>
            <div className='level-item has-text-centered'>
              <div>
                <a href='https://github.com/itsjit/Xls2Json'>
                  <span className='icon is-large'>
                    <i className='fab fa-github fa-3x'></i>
                  </span>
                </a>
              </div>
            </div>
          </nav>
        </footer>
      </div>
    );
  }
}

export default App;
