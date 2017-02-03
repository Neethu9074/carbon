import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getAgentConfig, saveAgentConfig} from 'in-stores/agentConfig';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import CenterAlignment from 'in-components/layout/CenterAlignment';
import Button from 'in-components/Button';
import Editor from 'in-components/Editor';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import yaml from 'js-yaml';

import './ConfigurationYamlDialog.less';


const block = 'in-agent-cofig-yaml-dialog';

export default connectTo(props => {
  return {
    agentConfig: getAgentConfig(props.snapshot)
  };
},
React.createClass({
  displayName: 'ConfigurationYamlDialog',

  propTypes: {
    agentConfig: React.PropTypes.string,
    snapshot: irpt.map.isRequired,
  },

  getInitialState() {
    return {
      value: undefined
    };
  },

  render() {
    let parseError;
    try {
      yaml.safeLoad(this.getValue());
    } catch (e) {
      const hint = e.message;
      parseError = `Failed to parse YAML: ${hint}`;
    }

    const header = (
      <CenterAlignment>
        <span>Agent Config</span>

        <Button disabled={!!parseError}
                onClick={() => onSaveAndClose(this.props.snapshot, this.getValue())}
                kind='success'
                size='sm'>
          Apply
        </Button>
      </CenterAlignment>
    );

    return (
      <Dialog header={header}
              onClose={onClose}>

        <div className={`${block}__margin-remover`}>
          {parseError ?
            <p className={`${block}__parse-error`}>
              {parseError}
            </p>
          : null}

          <Editor value={this.getValue()}
                  onChange={newValue => this.setState({value: newValue})}
                  options={{
                    mode: 'text/x-yaml',
                    styleActiveLine: true,
                    lineNumbers: true,
                    lint: true,
                    gutters: ['CodeMirror-lint-markers']
                  }}
                  className={`${block}__editor`} />
        </div>
      </Dialog>
    );
  },

  getValue() {
    if (this.state.value === undefined) {
      return this.props.agentConfig;
    }
    return this.state.value;
  }
}));

function onClose() {
  setActiveDialog(null);
}

function onSaveAndClose(snapshot, txt) {
  saveAgentConfig(snapshot, txt);
  setActiveDialog(null);
}
