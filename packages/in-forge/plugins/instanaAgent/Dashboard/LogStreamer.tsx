/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-danger */
import React from 'react';
import DOMPurify from 'dompurify';

import { replaceHtmlChars } from '@instana/utils';
import { Typography } from '@instana/components';
import { Toggle, Layer } from '@instana/carbon';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { ansiToHtml } from 'in-forge/plugins/instanaAgent/Dashboard/ansiLoader';
import CopyToClipboardIconButton from 'in-components/CopyToClipboardIconButton';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

import locals from './LogStreamer.mless';

const maxDisplayedChars = 100000;

const emptyAggregate: Readonly<AggregateOptions> = {
  error: null,
  additionalData: null,
  log: ''
};

const emptyState: StateOptions = { ...emptyAggregate, scrollToBottomOnChange: true };

interface LogStreamerProps {
  snapshot: SnapshotData;
  action: string;
  stopAction?: string;
  logStreamTargetId: string;
  throttle?: boolean;
  onAggregate: (data: any, agg: AggregateOptions) => void;
  onRender?: (state: StateOptions, snapshot: SnapshotData) => void;
}

export interface AggregateOptions {
  log: string;
  additionalData: string | null;
  error: string | null;
}

export interface StateOptions extends AggregateOptions {
  scrollToBottomOnChange: boolean;
}

class LogStreamer extends React.PureComponent<LogStreamerProps> {
  static displayName = 'LogStreamer';

  state = emptyState;
  code: HTMLElement | null | undefined;
  subscription: any;
  snapshot: SnapshotData | undefined;

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
    const { action, snapshot, onAggregate, throttle } = this.props;

    if (this.snapshot?.get('id') === snapshot.get('id')) {
      return;
    }

    this.disposeSubscription();
    this.snapshot = snapshot;
    this.setState(emptyState);

    const observable = createAgentResponseObservable({
      action: action,
      target: snapshot.get('volatileId'),
      args: {}
    })
      .scan<AggregateOptions>(
        (agg, response) => {
          agg.error = response.error;
          onAggregate(response.data, agg);
          if (agg.log.length > maxDisplayedChars) {
            agg.log = agg.log.substring(agg.log.length - maxDisplayedChars, agg.log.length);
          }
          return agg;
        },
        { ...emptyAggregate }
      )
      .nextFrame();

    this.subscription = (throttle ? observable.throttle(2000) : observable)
      .map(aggregated => mapLog(aggregated, log => replaceHtmlChars(log)))
      .flatMap(aggregated => ansiToHtml(aggregated.log).map(html => replaceLog(aggregated, html)))
      .map(aggregated => mapLog(aggregated, log => DOMPurify.sanitize(log)))
      .subscribe(aggregated => {
        this.setState({ ...aggregated });
      });
  };

  componentWillUnmount() {
    this.disposeSubscription();
  }

  disposeSubscription = () => {
    const { stopAction } = this.props;
    if (this.snapshot && stopAction) {
      createAgentResponseObservable({
        action: stopAction,
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
    const { logStreamTargetId, snapshot, onRender } = this.props;
    const { error, log, scrollToBottomOnChange } = this.state;

    return (
      <div>
        {error && (
          <DashboardNotification type="danger">
            {t('in-forge:plugins.instanaAgent.dashboard.error', { error })}
          </DashboardNotification>
        )}

        <Layer level={0}>
          <Toggle
            hideLabel
            onToggle={e => {
              this.setState({ scrollToBottomOnChange: e });
            }}
            size="sm"
            labelText={t('in-forge:plugins.instanaAgent.dashboard.automaticallyScrollToBottomOnLogChange')}
            toggled={scrollToBottomOnChange}
            id="set-auto-scroll"
            className={locals.toggle}
          />
          <div className={locals.copyButton}>
            <CopyToClipboardIconButton targetId={logStreamTargetId} />
          </div>
        </Layer>

        <div>
          <Typography variant="code-01" component="pre" >
              <code
                className={locals.log}
                id={logStreamTargetId}
                dangerouslySetInnerHTML={{ __html: log }}
                ref={ele => (this.code = ele)}
              />
          </Typography>
        </div>

        {onRender?.(this.state, snapshot)}
      </div>
    );
  }
}

export default LogStreamer;

function mapLog(aggregate: AggregateOptions, logMapper: (s: string) => string) {
  return { ...aggregate, log: logMapper(aggregate.log) };
}

function replaceLog(aggregate: AggregateOptions, newLogValue: string) {
  return { ...aggregate, log: newLogValue };
}
