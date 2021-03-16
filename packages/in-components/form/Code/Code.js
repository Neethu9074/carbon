/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CodeMirror from 'in-components/CodeMirror';

import locals from './Code.mless';

export default class CodeInput extends React.Component {
  componentDidMount() {
    const editor = CodeMirror(this.input, {
      mode: this.props.mode,
      value: this.props.value || '',
      tabSize: 2,
      readOnly: this.props.readOnly || false
    });

    editor.on('change', editor => this.props.onChange(editor.getValue()));
  }

  render() {
    return <div className={locals.wrapper} ref={input => (this.input = input)} />;
  }
}
