/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// This is a temperory notification and will be removed in R303
import React from 'react';

import { Button } from '@instana/carbon';

import { ampCompanyInfoEnabled, newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { ampUsage } from 'in-amp/navigation/paths';
import { t } from 'in-i18n';

import locals from 'in-plg/components/DataConsumptionMessage/PushDataConsumptionMessage.mless';

const localStorageKey = 'showAccountBillingPushNotification';
export function init() {
  const alreadyShown = localStorage.getItem(localStorageKey) === 'shown';

  if (
    !alreadyShown &&
    newAccountAndBillingPageEnabled &&
    !ampCompanyInfoEnabled &&
    window.instana.user?.role?.name === 'Owner' &&
    window.instana.user?.role?.canViewAccountAndBillingInformation
  ) {
    addMessage(
      {
        title: t('in-plg:accountBillingPushNotificationMessage.title'),
        type: 'info',
        icon: 'info',
        onClick: () => {
          localStorage.setItem(localStorageKey, 'shown');
          removeMessage('push-notification-message');
        },
        content: <PushNotificationContent />
      },
      'push-notification-message'
    );
  }
}

function PushNotificationContent() {
  const { createHrefToPath } = useNavigation();
  return (
    <>
      {t('in-plg:accountBillingPushNotificationMessage.description')}
      <Button
        size="sm"
        kind="tertiary"
        className={locals.button}
        href={createHrefToPath(ampUsage)}
        onClick={() => {
          localStorage.setItem(localStorageKey, 'shown');
          removeMessage('push-notification-message');
        }}
      >
        {t('in-plg:accountBillingPushNotificationMessage.buttonText')}
      </Button>
    </>
  );
}
