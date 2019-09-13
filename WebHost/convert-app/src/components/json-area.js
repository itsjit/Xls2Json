import React, { useState } from 'react';
import Textarea from 'react-textarea-autosize';
import { Form, Popup } from 'semantic-ui-react';

const JsonArea = props => {
  var [isOpen, setIsOpen] = useState(props.content ? true : false);
  React.useEffect(() => {
    setIsOpen(props.content ? true : false);
  }, [props.content]);
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Form className="code">
        <Textarea
          className="textarea"
          minRows={3}
          maxRows={20}
          style={{ minHeight: 100 }}
          value={props.content}
          readOnly
        ></Textarea>
        <Popup
          className="button-copy"
          content="Copy the JSON to clipboard"
          position="top right"
          on="click"
          open={isOpen}
          onClose={handleClose}
          trigger={
            <button
              className={'ui icon button button-copy'}
              onClick={props.onCopyToClipboardClick}
              disabled={!props.content}
            >
              <i className="copy icon"></i>
            </button>
          }
        />
      </Form>
    </div>
  );
};

export default JsonArea;
