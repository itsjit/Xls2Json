import React from 'react';
import Textarea from 'react-textarea-autosize';
import { Form, Segment } from 'semantic-ui-react';

const JsonArea = props => {
  return (
    <Segment basic loading={props.isLoading} disabled={!props.content}>
      <Form className="code">
        <Textarea
          className="textarea"
          minRows={3}
          maxRows={20}
          style={{ minHeight: 100 }}
          value={props.content}
          readOnly
        ></Textarea>
        <button
          className={'ui icon button button-copy'}
          onClick={props.onCopyToClipboardClick}
          disabled={!props.content}
        >
          <i className="copy icon"></i>
        </button>
      </Form>
    </Segment>
  );
};

export default JsonArea;
