import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import {sanitize, ansiToHtml, replaceHtmlChars} from 'in-services/formatters/html';
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
      error: null,
      log: ''
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
    if (this.snapshot != null && this.snapshot.get('id') === this.props.snapshot.get('id')) {
      return;
    }

    this.disposeSubscription();
    this.snapshot = this.props.snapshot;
    this.setState({
      error: null,
      log: ''
    });

    this.subscription = createAgentResponseObservable({
      action: 'agent.log.start',
      target: this.props.snapshot.get('volatileId'),
      args: {}
    })
    .scan((agg, response) => {
      agg.error = response.error;
      if (response.data) {
        agg.log += response.data;
      }
      return agg;
    }, {log: '', error: null})
    .map(aggregated => {
      return {
        log: replaceHtmlChars(aggregated.log),
        error: aggregated.error
      };
    })
    .flatMap(aggregated => {
      return ansiToHtml(aggregated.log)
        .map(html => {
          return {
            log: html,
            error: aggregated.error
          };
        });
    })
    .flatMap(aggregated => {
      return sanitize(aggregated.log)
        .map(cleanHtml => {
          return {
            log: cleanHtml,
            error: aggregated.error
          };
        });
    })
    .subscribe(aggregated => {
      this.setState({
        error: aggregated.error,
        log: aggregated.log
      });
    });
  },

  componentWillUnmount() {
    this.disposeSubscription();
  },

  disposeSubscription() {
    if (this.snapshot) {
      createAgentResponseObservable({
        action: 'agent.log.stop',
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
                dangerouslySetInnerHTML={{__html: this.state.log}} />
        </pre>
      </div>
    );
  }
});
