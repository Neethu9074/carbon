import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import DialogNotification from 'in-components/DialogNotification';

import './LogStreamer.less';

const block = 'in-agent-log-streamer';

export default React.createClass({
  displayName: 'LogStreamer',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  getInitialState() {
    return {
      error: null
    };
  },

  componentDidMount() {
    this.subscribe();
  },

  componentDidUpdate() {
    this.subscribe();
  },

  subscribe() {
    // nothing to do, snapshot did not change
    if (this.snapshot.get('id') === this.props.snapshot.get('id')) {
      return;
    }

    this.disposeSubscription();
    this.snapshot = this.props.snapshot;
    this.log = '';
    if (this.state.error != null) {
      this.setState({error: null});
    }
    this.updateLogContent();

    this.subscription = createAgentResponseObservable({
      action: 'agent.startLogging',
      target: this.props.snapshot.get('volatileId'),
      args: {}
    }).subscribe(response => {
      if (response.error) {
        this.setState({error: response.error});
      } else {
        this.log += response.data;
        this.updateLogContent();
      }
    });
  },

  updateLogContent() {
    ReactDOM.findDOMNode(this.refs.log).textContent = this.log;
  },

  componentWillUnmount() {
    this.disposeSubscription();
  },

  disposeSubscription() {
    if (this.snapshot) {
      createAgentResponseObservable({
        action: 'agent.stopLogging',
        target: this.snapshot.get('volatileId'),
        args: {}
      }).once(() => {});
    }

    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  },

  render() {
    return (
      <div className={block}>
        {this.state.error != null ?
          <DialogNotification type='danger'>
            Error: {this.state.error}
          </DialogNotification>
        : null}

        <pre>
          <code className={`${block}__log`}
                ref='log' />
        </pre>
      </div>
    );
  }
});
