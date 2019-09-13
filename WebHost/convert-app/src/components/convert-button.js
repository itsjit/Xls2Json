import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const ConvertButton = props => {
  return (
    <div>
      <Button as="div" labelPosition="right">
        <Button
          basic
          size="huge"
          onClick={props.onClick}
          loading={props.isLoading}
          disabled={props.fileName ? false : true}
        >
          <Icon name="refresh" />
          Convert
        </Button>
        <label className={'ui label basic' + (props.fileName ? '' : ' hidden')}>{props.fileName}</label>
      </Button>
    </div>
  );
};

export default ConvertButton;
