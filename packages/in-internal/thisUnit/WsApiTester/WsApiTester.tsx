/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

import { Card, Message, Spacer, Stack, Button } from '@instana/components';
import { Disposable } from '@instana/observables';

import ApiResponseList, { ApiTestResponse } from 'in-internal/thisUnit/WsApiTester/ApiResponseList';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useUrlState, { Options } from 'in-hooks/useUrlState';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';
import Input from 'in-components/form/Input';
import { seconds } from 'in-services/time';
import Code from 'in-components/form/Code';
import { t } from 'in-i18n';

import locals from './WsApiTester.mless';

interface WsApiTesterState {
  eventId: string;
  params: string;
}

const urlStateDefinition: Options<WsApiTesterState> = {
  bind: [
    {
      path: '/wsApiTester',
      name: 'wsApiTester.eventId',
      as: 'eventId',
      initialState: '',
      parser: buildJsonParser(),
      serializer: buildJsonSerializer()
    },
    {
      path: '/wsApiTester',
      name: 'wsApiTester.params',
      as: 'params',
      initialState: '',
      parser: buildJsonParser(),
      serializer: buildJsonSerializer()
    }
  ],
  reducer: (prevState, { eventId, params }) => ({
    eventId: eventId ?? prevState.eventId,
    params: params ?? prevState.params
  })
};

interface Subscription {
  subscriptionTime: number;
  disposable: Disposable;
}

export function WsApiTester() {
  const [subscription, setSubscription] = useState<Subscription>();
  useEffect(() => {
    if (subscription) {
      return () => subscription.disposable.dispose();
    }
    return;
  }, [subscription]);

  const [{ eventId, params }, setUrlState] = useUrlState(urlStateDefinition);

  const [responses, setResponses] = useState<ApiTestResponse[]>([]);

  const onEventIdUpdate = (value?: string) => {
    setUrlState({ params, eventId: value ?? '' });
  };

  const onParamsUpdate = (value?: string) => {
    setUrlState({ eventId, params: value ?? '' });
  };

  const onSubmit = () => {
    let payload: any;
    try {
      payload = JSON.parse(params);
    } catch (e) {
      addMessage({
        type: 'danger',
        title: t('in-internal:thisUnit.wsApiTester.subscriptionFailureMessage'),
        timeout: seconds.toMillis(6),
        content: (e as Error).message
      });
      return;
    }

    setResponses([]);

    const subscription = subscribeToAnonymousSubscription(eventId, payload!, onData);
    setSubscription({
      subscriptionTime: Date.now(),
      disposable: subscription
    });
  };

  const onData = (data: any) => {
    setResponses(r => [
      ...r,
      {
        timestamp: Date.now(),
        payload: data
      }
    ]);
  };

  const onDisconnect = () => {
    subscription?.disposable?.dispose();
    setSubscription(undefined);
    setResponses([]);
  };

  return (
    <Card
      title={t('in-internal:thisUnit.wsApiTester.title')}
      rightHeaderContent={<ApiTesterActions onSubmit={onSubmit} onDisconnect={onDisconnect} />}
    >
      <Stack gap="xsmall">
        <Header>{t('in-internal:thisUnit.wsApiTester.subscriptionConfigHeader')}</Header>
        <Sections>
          <Section title={t('in-internal:thisUnit.wsApiTester.eventIdInputLabel')}>
            <Input
              className={locals.fullWidthInput}
              type="text"
              value={eventId}
              onChange={e => onEventIdUpdate(e.target.value)}
            />
          </Section>
          <Section title={t('in-internal:thisUnit.wsApiTester.eventParametersLabel')}>
            <Code mode="application/json" value={params} onChange={onParamsUpdate} />
          </Section>
        </Sections>
      </Stack>
      <Spacer size="large" />
      <Stack gap="xsmall">
        <Header>{t('in-internal:thisUnit.wsApiTester.responsesHeader')}</Header>
        <Message dismissible>{t('in-internal:thisUnit.wsApiTester.errorNotice')}</Message>
        <ApiResponseList responses={responses} initialTimestamp={subscription?.subscriptionTime} />
      </Stack>
    </Card>
  );
}

interface ApiTesterActionsProps {
  onSubmit: () => void;
  onDisconnect: () => void;
}

function ApiTesterActions({ onSubmit, onDisconnect }: ApiTesterActionsProps) {
  return (
    <Stack direction="horizontal">
      <Button kind="primary" onClick={onSubmit}>
        {t('in-internal:thisUnit.wsApiTester.subscribeButtonLabel')}
      </Button>
      <Button kind="secondary" onClick={onDisconnect}>
        {t('in-internal:thisUnit.wsApiTester.disconnectButtonLabel')}
      </Button>
    </Stack>
  );
}

function subscribeToAnonymousSubscription(eventId: string, payload: any, onData: (data: any) => void): Disposable {
  return createResultSubscriptionFactory<any, any>({
    eventId
  })(payload).subscribe(onData);
}
