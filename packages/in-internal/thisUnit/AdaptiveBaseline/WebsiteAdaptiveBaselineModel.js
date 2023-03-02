/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import onSubscribeBaselineModel from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteAdaptiveBaselineModel';
import { alwaysNull } from 'in-services/fixedStreams';
import useUrlState from 'in-hooks/useUrlState';
import Input from 'in-components/form/Input';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from 'in-internal/thisUnit/AdaptiveBaseline/AdaptiveBaselineModel.mless';

export default function WebsiteAdaptiveBaselineModel() {
  const urlStateConfig = {
    replaceHistory: false,
    bind: [
      {
        path: '/websiteAdaptiveBaselineModel',
        name: 'alertConfigId',
        initialState: ''
      },
      {
        path: '/websiteAdaptiveBaselineModel',
        name: 'alertCreated',
        initialState: ''
      },
      {
        path: '/websiteAdaptiveBaselineModel',
        name: 'websiteId',
        initialState: ''
      },
      {
        path: '/websiteAdaptiveBaselineModel',
        name: 'entityId',
        initialState: ''
      }
    ]
  };

  const [{ alertConfigId, alertCreated, websiteId, entityId }, setState] = useUrlState(urlStateConfig);
  const [signal, setSignal] = useState(false);
  const adaptiveBaselineModelResponse = useObservable(
    !signal ? alwaysNull : getWebsiteAdaptiveBaselineModel(alertConfigId, alertCreated, websiteId, entityId),
    [signal, alertConfigId, alertCreated, websiteId, entityId]
  );

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
          id="websiteId-value"
          placeholder="Website Id"
          value={websiteId}
          onChange={e => {
            setSignal(false);
            setState({ websiteId: e.target.value });
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

function getWebsiteAdaptiveBaselineModel(alertConfigId, alertCreated, websiteId, entityId) {
  return onSubscribeBaselineModel({ alertConfigId, alertCreated, websiteId, entityId });
}
