/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import {
  getEntityIdView,
  teamSettingsAlertingEventBuiltIn,
  teamSettingsAlertingEventCustom
} from 'in-settings/navigation/paths';
import { role } from 'in-stores/user';
import { Event } from 'in-types';
import { t } from 'in-i18n';

export default function EventSpecificationLink({
  event,
  buttonText,
  className
}: {
  event: Event;
  buttonText?: string;
  className?: string;
}) {
  if (!role?.canConfigureCustomAlerts) {
    // at the moment the link of this button generally does not work when the canConfigureCustomAlerts permission is missing,
    // because we generally hide the Events & Alerts section, including the build-in events.
    return null;
  }

  const eventSpecificationId: string = event.metadata?.eventSpecificationId;
  if (!eventSpecificationId) {
    return null;
  }

  const isCustom = isCustomEvent(event);

  const defaultButtonText = isCustom ? t('in-events:buttonViewCustomEvent') : t('in-events:buttonViewBuiltInEvent');
  return (
    <Button
      className={className}
      kind="secondary"
      href$={getEntityIdView(getEventSpecificationSettingsBasePath(isCustom), eventSpecificationId)}
    >
      {buttonText ?? defaultButtonText}
    </Button>
  );
}

function getEventSpecificationSettingsBasePath(isCustom: boolean) {
  return isCustom ? teamSettingsAlertingEventCustom : teamSettingsAlertingEventBuiltIn;
}

function isCustomEvent(event: Event): boolean {
  return event.metadata?.custom_issue ?? false;
}
