import React from 'react';

import {saveAgentConfig, getAgentConfig} from 'in-stores/agentConfig';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import './ConfigurationYamlDialog.less';


const block = 'in-agent-cofig-yaml-dialog';

export default connectTo(props => {
  return {
    agentConfig: getAgentConfig(props.snapshot)
  };
},
React.createClass({

  displayName: 'ConfigurationYamlDialog',

  props: {
    agentConfig: React.PropTypes.string
  },

  getInitialState() {
    return {
      config: this.props.agentConfig,
      editMode: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.agentConfig !== nextProps.agentConfig) {
      this.setState({config: nextProps.agentConfig});
    }
  },

  render() {
    const editMode = this.state.editMode;
    const config = this.state.config;

    return (
      <Dialog header='Agent Config'
              onClose={() => setActiveDialog(null)}>
        <div className={block}>
          <Code code={config}
                lang='yaml'
                showLineNumbers
                wrapperClassName={`${block}__code`} />
          <div>
            <span className={`${block}__control`}
                  onClick={() => this.setState({editMode: !this.state.editMode})}>
              {editMode ? 'Cancel' : 'Edit'}
            </span>
            {editMode ?
              <span className={`${block}__control`}
                    onClick={() => {
                      this.setState({editMode: false});
                      saveAgentConfig(this.props.snapshot, config);
                    }}>
                Save
              </span>
            : null}
          </div>
        </div>
      </Dialog>
    );
  }
}));
