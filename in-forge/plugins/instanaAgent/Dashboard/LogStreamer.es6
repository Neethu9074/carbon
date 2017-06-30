import irpt from 'react-immutable-proptypes';
import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import { sanitize, ansiToHtml, replaceHtmlChars } from 'in-services/formatters/html';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import DialogNotification from 'in-components/DialogNotification';
import Toggle from 'in-components/form/Toggle';

import './LogStreamer.less';

const block = 'in-agent-log-streamer';

const maxDisplayedChars = 100000;

export default class extends React.PureComponent {
  static displayName = 'LogStreamer';

  static propTypes = {
    snapshot: irpt.map.isRequired
  };

  state = {
    error: null,
    log: '',
    scrollToBottomOnChange: true
  };

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();

    if (this.state.scrollToBottomOnChange && this.code) {
      // Number.MAX_VALUE doesn't work in Chrome…
      this.code.scrollTop = 1000000;
    }
  }

  subscribe = () => {
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
      .scan(
        (agg, response) => {
          agg.error = response.error;
          if (response.data) {
            agg.log += response.data;
          }
          if (agg.log.length > maxDisplayedChars) {
            agg.log = agg.log.substring(agg.log.length - maxDisplayedChars, agg.log.length);
          }
          return agg;
        },
        { log: '', error: null }
      )
      .nextFrame()
      .throttle(2000)
      .map(aggregated => {
        return {
          log: replaceHtmlChars(aggregated.log),
          error: aggregated.error
        };
      })
      .flatMap(aggregated => {
        return ansiToHtml(aggregated.log).map(html => {
          return {
            log: html,
            error: aggregated.error
          };
        });
      })
      .flatMap(aggregated => {
        return sanitize(aggregated.log).map(cleanHtml => {
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
  };

  componentWillUnmount() {
    this.disposeSubscription();
  }

  disposeSubscription = () => {
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
  };

  render() {
    return (
      <div className={block}>
        {this.state.error != null
          ? <DialogNotification type="danger">
              Error: {this.state.error}
            </DialogNotification>
          : null}

        <CopyToClipboardButton getText={() => this.code.textContent} />

        <label htmlFor="set-auto-scroll" className={`${block}__auto-scroll`}>
          Automatically scroll to bottom on log change:
          <Toggle onChange={e => this.setState({scrollToBottomOnChange: e.target.checked})}
                  checked={this.state.scrollToBottomOnChange}
                  id="set-auto-scroll"
                   className={`${block}__auto-scroll-toggle`} />
        </label>

        <pre>
          <code className={`${block}__log`} dangerouslySetInnerHTML={{ __html: this.state.log }} ref={ele => this.code = ele} />
        </pre>
      </div>
    );
  }
}
