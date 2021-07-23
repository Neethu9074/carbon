/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';

import { getInitializationCallStack, getSubscriptionPayload } from 'in-connection';
import createSubscription from 'in-subscription/subscription';
import { Message } from 'in-types';
import { t } from 'in-i18n';

const logger = createLogger('in-connection/clientErrorMessages');

export function init() {
  createSubscription<void, Message>({
    eventId: 'subscribe-message'
  })().subscribe(onNewMessage);
}

function onNewMessage(msg: Message) {
  const args: any[] = [t('in-connection:clientErrMsg.techClientMsgeErrFromBackend'), msg];

  if (msg.subscriptionId != null) {
    args.push(getInitializationCallStack(msg.subscriptionId), {
      subscriptionPayload: getSubscriptionPayload(msg.subscriptionId)
    });
  }

  logger.error(...args);
}
