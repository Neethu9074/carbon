import { createLogger } from '@instana/logger';

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
    'Technical client message (most likely error details) from backend',
    msg,
    getInitializationCallStack(msg.subscriptionId),
    {
      subscriptionPayload: getSubscriptionPayload(msg.subscriptionId)
    }
  ].filter(Boolean);
  logger.error(...args);
}
