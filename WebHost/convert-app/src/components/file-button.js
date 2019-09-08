import React from 'react';

const FileButton = props => {
  return (
    <div className="field">
      <div className="file is-large is-boxed has-name">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            name="resume"
            onChange={props.onClick}
            disabled={props.isLoading}
          ></input>
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-file-import"></i>
            </span>
            <span className="file-label">Open file…</span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default FileButton;
