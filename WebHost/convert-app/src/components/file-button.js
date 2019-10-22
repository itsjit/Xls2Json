import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const FileButton = props => {
  const { t } = useTranslation();
  const fileInputRef = React.createRef();

  return (
    <div>
      <Button basic size="huge" onClick={() => fileInputRef.current.click()} disabled={props.isLoading}>
        <Icon name="upload" />
        {t('Open File...')}
      </Button>
      <input ref={fileInputRef} type="file" hidden onChange={props.onClick} />
    </div>
  );
};

export default FileButton;
