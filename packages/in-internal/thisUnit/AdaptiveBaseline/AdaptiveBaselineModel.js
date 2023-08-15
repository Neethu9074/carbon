/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import onSubscribeApplicationBaselineModel from 'in-alerting/smart-alerts/applications/subscriptions/getApplicationAdaptiveBaselineModel';
import onSubscribeMobileAppBaselineModel from 'in-alerting/smart-alerts/mobileApp/subscriptions/getMobileAppAdaptiveBaselineModel';
import onSubscribeWebsiteBaselineModel from 'in-alerting/smart-alerts/websites/subscriptions/getWebsiteAdaptiveBaselineModel';
import { alwaysNull } from 'in-services/fixedStreams';
import useUrlState from 'in-hooks/useUrlState';
import Input from 'in-components/form/Input';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from 'in-internal/thisUnit/AdaptiveBaseline/AdaptiveBaselineModel.mless';

export default function AdaptiveBaselineModel() {
  const applicationUrlStateConfig = {
    replaceHistory: false,
    bind: [
      {
        path: '/adaptiveBaselineModel',
        name: 'applicationAlertConfigId',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'applicationAlertCreated',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'applicationId',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'applicationEntityId',
        initialState: ''
      }
    ]
  };

  const websiteUrlStateConfig = {
    replaceHistory: false,
    bind: [
      {
        path: '/adaptiveBaselineModel',
        name: 'websiteAlertConfigId',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'websiteAlertCreated',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'websiteId',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'websiteEntityId',
        initialState: ''
      }
    ]
  };

  const mobileAppUrlStateConfig = {
    replaceHistory: false,
    bind: [
      {
        path: '/adaptiveBaselineModel',
        name: 'mobileAppAlertConfigId',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'mobileAppAlertCreated',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'mobileAppId',
        initialState: ''
      },
      {
        path: '/adaptiveBaselineModel',
        name: 'mobileAppEntityId',
        initialState: ''
      }
    ]
  };

  const [
    { applicationAlertConfigId, applicationAlertCreated, applicationId, applicationEntityId },
    applicationSetState
  ] = useUrlState(applicationUrlStateConfig);
  const [applicationSignal, applicationSetSignal] = useState(false);
  const applicationAdaptiveBaselineModelResponse = useObservable(
    !applicationSignal
      ? alwaysNull
      : getApplicationAdaptiveBaselineModel(
          applicationAlertConfigId,
          applicationAlertCreated,
          applicationId,
          applicationEntityId
        ),
    [applicationSignal, applicationAlertConfigId, applicationAlertCreated, applicationId, applicationEntityId]
  );

  const [{ websiteAlertConfigId, websiteAlertCreated, websiteId, websiteEntityId }, websiteSetState] =
    useUrlState(websiteUrlStateConfig);
  const [websiteSignal, websiteSetSignal] = useState(false);
  const websiteAdaptiveBaselineModelResponse = useObservable(
    !websiteSignal
      ? alwaysNull
      : getWebsiteAdaptiveBaselineModel(websiteAlertConfigId, websiteAlertCreated, websiteId, websiteEntityId),
    [websiteSignal, websiteAlertConfigId, websiteAlertCreated, websiteId, websiteEntityId]
  );

  const [{ mobileAppAlertConfigId, mobileAppAlertCreated, mobileAppId, mobileAppEntityId }, mobileAppSetState] =
    useUrlState(mobileAppUrlStateConfig);
  const [mobileAppSignal, mobileAppSetSignal] = useState(false);
  const mobileAppAdaptiveBaselineModelResponse = useObservable(
    !mobileAppSignal
      ? alwaysNull
      : getMobileAppAdaptiveBaselineModel(
          mobileAppAlertConfigId,
          mobileAppAlertCreated,
          mobileAppId,
          mobileAppEntityId
        ),
    [mobileAppSignal, mobileAppAlertConfigId, mobileAppAlertCreated, mobileAppId, mobileAppEntityId]
  );

  return (
    <div className={locals.view}>
      <h3>Application Smart Alert</h3>
      <div className={locals.header}>
        <Input
          className={locals.input}
          type="text"
          id="applicationAlertConfigId-value"
          placeholder="Smart Alert Id"
          value={applicationAlertConfigId}
          onChange={e => {
            applicationSetSignal(false);
            applicationSetState({ applicationAlertConfigId: e.target.value });
          }}
          autoFocus
        />

        <Input
          className={locals.input}
          type="number"
          id="applicationAlertCreated-value"
          placeholder="Created Timestamp"
          value={applicationAlertCreated}
          onChange={e => {
            applicationSetSignal(false);
            applicationSetState({ applicationAlertCreated: e.target.value });
          }}
        />

        <Input
          className={locals.input}
          type="text"
          id="applicationId-value"
          placeholder="Application Id"
          value={applicationId}
          onChange={e => {
            applicationSetSignal(false);
            applicationSetState({ applicationId: e.target.value });
          }}
        />

        <Input
          className={locals.input}
          type="text"
          id="applicationEntityId-value"
          placeholder="Entity Id"
          value={applicationEntityId}
          onChange={e => {
            applicationSetSignal(false);
            applicationSetState({ applicationEntityId: e.target.value });
          }}
        />

        <Button onClick={() => applicationSetSignal(true)}>{t('in-internal:thisUnit.snapshotVersions.refresh')}</Button>
      </div>
      <AdaptiveBaselineModelResponse response={applicationAdaptiveBaselineModelResponse} />

      <h3>Website Smart Alert</h3>
      <div>
        <div className={locals.header}>
          <Input
            className={locals.input}
            type="text"
            id="websiteAlertConfigId-value"
            placeholder="Smart Alert Id"
            value={websiteAlertConfigId}
            onChange={e => {
              websiteSetSignal(false);
              websiteSetState({ websiteAlertConfigId: e.target.value });
            }}
            autoFocus
          />

          <Input
            className={locals.input}
            type="number"
            id="websiteAlertCreated-value"
            placeholder="Created Timestamp"
            value={websiteAlertCreated}
            onChange={e => {
              websiteSetSignal(false);
              websiteSetState({ websiteAlertCreated: e.target.value });
            }}
          />

          <Input
            className={locals.input}
            type="text"
            id="websiteId-value"
            placeholder="Website Id"
            value={websiteId}
            onChange={e => {
              websiteSetSignal(false);
              websiteSetState({ websiteId: e.target.value });
            }}
          />

          <Input
            className={locals.input}
            type="text"
            id="websiteEntityId-value"
            placeholder="Entity Id"
            value={websiteEntityId}
            onChange={e => {
              websiteSetSignal(false);
              websiteSetState({ websiteEntityId: e.target.value });
            }}
          />

          <Button onClick={() => websiteSetSignal(true)}>{t('in-internal:thisUnit.snapshotVersions.refresh')}</Button>
        </div>
        <AdaptiveBaselineModelResponse response={websiteAdaptiveBaselineModelResponse} />
      </div>

      <h3>Mobile App Smart Alert</h3>

      <div>
        <div className={locals.header}>
          <Input
            className={locals.input}
            type="text"
            id="mobileAppAlertConfigId-value"
            placeholder="Smart Alert Id"
            value={mobileAppAlertConfigId}
            onChange={e => {
              mobileAppSetSignal(false);
              mobileAppSetState({ mobileAppAlertConfigId: e.target.value });
            }}
            autoFocus
          />

          <Input
            className={locals.input}
            type="number"
            id="mobileAppAlertCreated-value"
            placeholder="Created Timestamp"
            value={mobileAppAlertCreated}
            onChange={e => {
              mobileAppSetSignal(false);
              mobileAppSetState({ mobileAppAlertCreated: e.target.value });
            }}
          />

          <Input
            className={locals.input}
            type="text"
            id="mobileAppId-value"
            placeholder="Mobile App Id"
            value={mobileAppId}
            onChange={e => {
              mobileAppSetSignal(false);
              mobileAppSetState({ mobileAppId: e.target.value });
            }}
          />

          <Input
            className={locals.input}
            type="text"
            id="mobileAppEntityId-value"
            placeholder="Entity Id"
            value={mobileAppEntityId}
            onChange={e => {
              mobileAppSetSignal(false);
              mobileAppSetState({ mobileAppEntityId: e.target.value });
            }}
          />

          <Button onClick={() => mobileAppSetSignal(true)}>{t('in-internal:thisUnit.snapshotVersions.refresh')}</Button>
        </div>
        <AdaptiveBaselineModelResponse response={mobileAppAdaptiveBaselineModelResponse} />
      </div>
    </div>
  );
}

function getApplicationAdaptiveBaselineModel(alertConfigId, alertCreated, applicationId, entityId) {
  return onSubscribeApplicationBaselineModel({ alertConfigId, alertCreated, applicationId, entityId });
}

function getWebsiteAdaptiveBaselineModel(alertConfigId, alertCreated, websiteId, entityId) {
  return onSubscribeWebsiteBaselineModel({ alertConfigId, alertCreated, websiteId, entityId });
}

function getMobileAppAdaptiveBaselineModel(alertConfigId, alertCreated, mobileAppId, entityId) {
  return onSubscribeMobileAppBaselineModel({ alertConfigId, alertCreated, mobileAppId, entityId });
}

function AdaptiveBaselineModelResponse(props) {
  return (
    <div className={locals.content}>
      {props.response && (
        <div className={locals.codeWrapper}>
          {!!props.response['errors'].length && (
            <Code code={JSON.stringify(props.response['errors'], 0, 2)} lang="json" softWrap="true" />
          )}
          {!props.response['errors'].length && <Code code={'' + props.response['data']} lang="text" softWrap="true" />}
        </div>
      )}
    </div>
  );
}
