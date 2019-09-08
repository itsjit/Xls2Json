import React from 'react';

const DownloadButton = props => {
  return (
    <div className="field has-addons">
      <div className="control">
        <span className={'file-cta input is-large file-name' + (props.fileName ? '' : ' is-hidden')}>
          {props.fileName}
        </span>
      </div>
      <div className="control">
        <a
          className="button is-large"
          href={props.href}
          download={props.fileName}
          disabled={!props.isDisabled}
        >
          <span className="icon is-medium">
            <i className="fas fa-cloud-download-alt"></i>
          </span>
          <span>Download</span>
        </a>
      </div>
    </div>
  );
};

export default DownloadButton;
