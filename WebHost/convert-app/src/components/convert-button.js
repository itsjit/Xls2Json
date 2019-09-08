import React from 'react';

const ConvertButton = props => {
  return (
    <div className="field has-addons">
      <div className="control">
        <span className={'file-cta input is-large file-name' + (props.fileName ? '' : ' is-hidden')}>
          {props.fileName}
        </span>
      </div>
      <div className="control">
        <button
          className={'button is-large' + (props.isLoading ? ' is-loading' : '')}
          onClick={props.onClick}
          disabled={!props.fileName}
        >
          <span className="icon is-medium">
            <i className="fas fa-sync-alt"></i>
          </span>
          <span>Convert</span>
        </button>
      </div>
    </div>
  );
};

export default ConvertButton;
