import rpt from 'prop-types';
import React from 'react';

import CenterAlignment from 'in-components/layout/CenterAlignment';
import Button from 'in-components/Button';
import Editor from 'in-components/Editor';
import Dialog from 'in-components/Dialog';

import './EditAsJsonDialog.less';

const block = 'in-config-generic-ex-json-dia';

export default React.createClass({
  displayName: 'EditAsJsonDialog',

  propTypes: {
    initialValue: rpt.string.isRequired,
    onSaveAndClose: rpt.func.isRequired,
    onClose: rpt.func.isRequired
  },

  getInitialState() {
    return {
      value: undefined
    };
  },

  render() {
    let parseError;
    try {
      JSON.parse(this.getValue());
    } catch (e) {
      const hint = e.stack.split('\n')[0].replace(/ at position.*/, '');
      parseError = `Failed to parse JSON: ${hint}`;
    }

    const header = (
      <CenterAlignment>
        <span>HTTP Rules</span>

        <Button
          disabled={!!parseError}
          onClick={() => this.props.onSaveAndClose(JSON.parse(this.getValue()))}
          kind="success"
          size="sm"
        >
          Apply to form
        </Button>
      </CenterAlignment>
    );

    return (
      <Dialog header={header} onClose={this.props.onClose}>

        <div className={`${block}__margin-remover`}>
          {parseError
            ? <p className={`${block}__parse-error`}>
                {parseError}
              </p>
            : null}

          <Editor
            value={this.getValue()}
            onChange={newValue => this.setState({ value: newValue })}
            options={{
              mode: 'application/json',
              styleActiveLine: true,
              lineNumbers: true,
              lint: true,
              gutters: ['CodeMirror-lint-markers']
            }}
            className={`${block}__editor`}
          />
        </div>
      </Dialog>
    );
  },

  getValue() {
    if (this.state.value === undefined) {
      return this.props.initialValue;
    }
    return this.state.value;
  }
});
