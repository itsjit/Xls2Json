import React from 'react';
import Textarea from 'react-textarea-autosize';

const JsonArea = props => {
  return (
    <div className="field code">
      <div className={'control' + (props.isLoading ? ' is-loading' : '')}>
        <Textarea
          className="textarea"
          minRows={3}
          maxRows={20}
          value={props.content}
          readOnly
        ></Textarea>
      </div>
      <button
        className={'button button-copy' + (props.content ? '' : ' is-hidden')}
        disabled={!props.content}
        onClick={props.onCopyToClipboardClick}
      >
        <span className="icon is-medium">
          <i className="fas fa-paste"></i>
        </span>
      </button>
    </div>
  );
};

export default JsonArea;
