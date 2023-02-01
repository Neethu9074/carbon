/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useRef } from 'react';

import { CodeProps, javascript, bbedit, useCodeMirror, EditorView } from 'in-synthetics/packages/CodeMirror';

import locals from './Code.mless';

export default function CodeInput(props: CodeProps) {
  const editor = useRef(null);
  const extensions = [javascript({ jsx: true })];
  const customizedTheme = EditorView.theme({
    '&.cm-editor.cm-focused': {
      outline: 'none'
    }
  });

  const { setContainer } = useCodeMirror({
    container: editor.current,
    value: props.value || '',
    theme: [bbedit, customizedTheme],
    extensions: extensions,
    editable: props.editable,
    readOnly: props.readOnly,
    autoFocus: props.autoFocus,
    placeholder: props.placeholder,
    height: props.height,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
    width: props.width,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,

    onChange: props.onChange
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  });

  return <div className={locals.wrapper} ref={editor} />;
}
