import irpt from 'react-immutable-proptypes';
import React from 'react';

import {get as getConfig, set as setConfig} from 'in-forge/plugins/instanaAgent/config';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import CenterAlignment from 'in-components/layout/CenterAlignment';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Button from 'in-components/Button';
import Editor from 'in-components/Editor';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import yaml from 'js-yaml';

import './ConfigurationYamlDialog.less';


const block = 'in-agent-cofig-yaml-dialog';
const rpt = React.PropTypes;

export default connectTo(props => {
  return {
    agentConfig: getConfig(props.snapshot)
  };
},
React.createClass({
  displayName: 'ConfigurationYamlDialog',

  propTypes: {
    agentConfig: rpt.oneOfType([
      rpt.object,
      rpt.string
    ]),
    snapshot: irpt.map.isRequired,
  },

  getInitialState() {
    return {
      value: undefined
    };
  },

  render() {
    const agentConfig = this.getValue();
    if (!agentConfig) {
      return (
        <Dialog header={'Loading Agent Config'}
                onClose={onClose}>
          <LoadingIndicator type='dark' />
        </Dialog>
      );
    }
    if (agentConfig.error) {
      return (
        <Dialog header={'Error'}
                onClose={onClose}>
          Failed to load the agent config
        </Dialog>
      );
    }

    let parseError;
    try {
      yaml.safeLoad(agentConfig);
    } catch (e) {
      parseError = `Failed to parse YAML: ${e.message}`;
    }

    const header = (
      <CenterAlignment>
        <span>Agent Config</span>

        <Button disabled={!!parseError}
                onClick={() => onSaveAndClose(this.props.snapshot, agentConfig)}
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

          <Editor value={agentConfig}
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

function onSaveAndClose(snapshot, config) {
  setConfig(snapshot, config);
  setActiveDialog(null);
}
