/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { compose, withState } from 'recompose';
import React from 'react';

import { Button } from '@instana/components';

import onSubscribeBaselineModel from 'in-alerting/smart-alerts/applications/subscriptions/getApplicationAdaptiveBaselineModel';
import { alwaysNull } from 'in-services/fixedStreams';
import withUrlState from 'in-hoc/withUrlState';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from 'in-internal/thisUnit/AdaptiveBaseline/AdaptiveBaselineModel.mless';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/adaptiveBaselineModel',
        name: 'alertConfigId',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'alertCreated',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'applicationId',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'entityId',
        initialState: ''
      }
    ],
    reducerName: 'setState',
    reducer: (prev, next) => ({ ...prev, ...next }),
    replaceHistory: false
  }),
  withState('signal', 'setSignal', false),
  connectTo(({ alertConfigId, alertCreated, applicationId, entityId, signal }) => ({
    adaptiveBaselineModelResponse: !signal
      ? alwaysNull
      : getAdaptiveBaselineModel(alertConfigId, alertCreated, applicationId, entityId)
  }))
)(AdaptiveBaselineModel);

function AdaptiveBaselineModel({
  alertConfigId,
  alertCreated,
  applicationId,
  entityId,
  setState,
  setSignal,
  adaptiveBaselineModelResponse
}) {
  return (
    <div className={locals.view}>
      <div className={locals.header}>
        <Input
          className={locals.input}
          type="text"
          id="alertConfigId-value"
          placeholder="Smart Alert Id"
          value={alertConfigId}
          onChange={e => {
            setSignal(false);
            setState({ alertConfigId: e.target.value });
          }}
          autoFocus
        />

        <Input
          className={locals.input}
          type="number"
          id="alertCreated-value"
          placeholder="Created Timestamp"
          value={alertCreated}
          onChange={e => {
            setSignal(false);
            setState({ alertCreated: e.target.value });
          }}
        />

        <Input
          className={locals.input}
          type="text"
          id="applicationId-value"
          placeholder="Application Id"
          value={applicationId}
          onChange={e => {
            setSignal(false);
            setState({ applicationId: e.target.value });
          }}
        />

        <Input
          className={locals.input}
          type="text"
          id="entityId-value"
          placeholder="Entity Id"
          value={entityId}
          onChange={e => {
            setSignal(false);
            setState({ entityId: e.target.value });
          }}
        />

        <Button onClick={() => setSignal(true)}>{t('in-internal:thisUnit.snapshotVersions.refresh')}</Button>
      </div>

      <div className={locals.content}>
        {adaptiveBaselineModelResponse && (
          <div className={locals.codeWrapper}>
            {!!adaptiveBaselineModelResponse['errors'].length && (
              <Code code={JSON.stringify(adaptiveBaselineModelResponse['errors'], 0, 2)} lang="json" softWrap="true" />
            )}
            {!adaptiveBaselineModelResponse['errors'].length && (
              <Code code={'' + adaptiveBaselineModelResponse['data']} lang="text" softWrap="true" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getAdaptiveBaselineModel(alertConfigId, alertCreated, applicationId, entityId) {
  return onSubscribeBaselineModel({ alertConfigId, alertCreated, applicationId, entityId });
}
