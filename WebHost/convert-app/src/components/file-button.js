import React from 'react';
import { Button, Segment } from 'semantic-ui-react';

const FileButton = props => {
  const fileInputRef = React.createRef();
  return (
    <Segment basic>
      <Button
        basic
        size="huge"
        content="Open File..."
        labelPosition="left"
        icon="upload"
        onClick={() => fileInputRef.current.click()}
        disabled={props.isLoading}
      />
      <input ref={fileInputRef} type="file" hidden onChange={props.onClick} />
    </Segment>
  );
};

export default FileButton;
