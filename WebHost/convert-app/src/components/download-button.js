import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const DownloadButton = props => {
  return (
    <div>
      <Button as="div" labelPosition="right">
        <Button
          as="a"
          basic
          size="huge"
          download={props.fileName}
          href={props.href}
          disabled={props.isDisabled}
          onClick={props.onClick}
        >
          <Icon name="cloud download" />
          Download
        </Button>
        <label className={'ui label basic' + (props.fileName ? '' : ' hidden')}>{props.fileName}</label>
      </Button>
    </div>
  );
};

export default DownloadButton;
