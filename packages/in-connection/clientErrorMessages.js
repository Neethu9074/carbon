/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createLogger } from '@instana/logger';
import { t } from 'in-i18n';

import { getInitializationCallStack, getSubscriptionPayload } from 'in-connection';
import createSubscription from 'in-subscription/subscription';

const logger = createLogger('in-connection/clientErrorMessages');

export function init() {
  createSubscription({
    eventId: 'subscribe-message'
  })().subscribe(onNewMessage);
}

function onNewMessage(msg) {
  const args = [
    t('in-connection:clientErrMsg.techClientMsgeErrFromBackend'),
    msg,
    getInitializationCallStack(msg.subscriptionId),
    {
      subscriptionPayload: getSubscriptionPayload(msg.subscriptionId)
    }
  ].filter(Boolean);
  logger.error(...args);
}
