import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const ConvertButton = props => {
  const { t } = useTranslation();

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
          {t('Convert')}
        </Button>
        <label className={'ui label basic' + (props.fileName ? '' : ' hidden')}>{props.fileName}</label>
      </Button>
    </div>
  );
};

export default ConvertButton;
