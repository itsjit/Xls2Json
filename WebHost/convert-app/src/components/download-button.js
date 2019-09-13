import React from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';

const DownloadButton = props => {
  return (
    <Segment basic>
      <Button as="div" labelPosition="right">
        <Button as="a" basic size="huge" download={props.fileName} href={props.href} disabled={props.isDisabled}>
          <Icon name="cloud download" />
          Download
        </Button>
        <label className={'ui label basic' + (props.fileName ? '' : ' hidden')}>{props.fileName}</label>
      </Button>
    </Segment>
  );
};

export default DownloadButton;
