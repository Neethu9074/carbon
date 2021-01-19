/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { compose, mapProps } from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';

import 'codemirror/addon/selection/mark-selection';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

export default compose(
  mapProps(props => ({
    ...props,
    emptyOnLoad: !props.value,
    value: formatJson(props.value)
  }))
)(StaticKeyValuePairsEditor);

const staticDemoJsonPayload = '{"key": "val"}';

function StaticKeyValuePairsEditor({ value, emptyOnLoad, onChange, onParseError }) {
  return (
    <CodeMirror
      value={value}
      editorDidMount={editor => {
        editor.focus();
        if (emptyOnLoad) {
          editor.doc.setSelection({ line: 1, ch: 2 }, { line: 1, ch: 14 });
        } else {
          editor.setCursor({ line: editor.doc.lastLine() - 1 });
        }
      }}
      options={{
        mode: 'application/json',
        lineNumbers: true,
        smartIndent: true,
        tabSize: 2,
        indentUnit: 2
      }}
      onBeforeChange={(editor, data, value, next) => {
        // make first and last line read only
        const lastLine = editor.doc.lastLine();
        if (data.from.line === 0 && value.indexOf('{') === 0) {
          data.cancel();
        } else if (value && data.to.line === lastLine && value.lastIndexOf('}') === value.length - 1) {
          data.cancel();
        } else {
          next();
        }
      }}
      onChange={(editor, data, value) => {
        const error = validateJson(value);
        onParseError(error);
        onChange(error ? null : value);
      }}
    />
  );
}

function validateJson(value) {
  let errorMsg;
  try {
    JSON.parse(value);
  } catch (e) {
    errorMsg = e.message;
  }
  return errorMsg;
}

function formatJson(value) {
  return JSON.stringify(JSON.parse(value || staticDemoJsonPayload), null, 2);
}

StaticKeyValuePairsEditor.proTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onParseError: PropTypes.func.isRequired
};
