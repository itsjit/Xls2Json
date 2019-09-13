import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const FileButton = props => {
  const fileInputRef = React.createRef();
  return (
    <div>
      <Button
        basic
        size="huge"
        onClick={() => fileInputRef.current.click()}
        disabled={props.isLoading}
      >
         <Icon name="upload" />
          Open File...
        </Button>
      <input ref={fileInputRef} type="file" hidden onChange={props.onClick} />
    </div>
  );
};

export default FileButton;
