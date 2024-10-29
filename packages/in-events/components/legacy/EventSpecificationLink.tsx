/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button, CarbonMenuItem, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  getEntityIdView,
  globalSettingsAlertingEventBuiltIn,
  globalSettingsAlertingEventCustom
} from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { role } from 'in-stores/user';
import { Event } from 'in-types';
import { t } from 'in-i18n';

import locals from './EventSpecificationLink.mless';

export default function EventSpecificationLink({
  event,
  buttonText,
  hasMarginRight,
  as = 'button'
}: {
  event: Event;
  buttonText?: string;
  hasMarginRight?: boolean;
  as?: 'button' | 'menuItem';
}) {
  const isCustom = isCustomEvent(event);
  const eventSpecificationId: string = event.metadata?.eventSpecificationId;

  const resolvedURL = useObservable(
    getEntityIdView(getEventSpecificationSettingsBasePath(isCustom), eventSpecificationId),
    []
  );
  const { navigate } = useNavigation();

  if (!role?.canConfigureEventsAndAlerts) {
    // at the moment the link of this button generally does not work when the canConfigureEventsAndAlerts permission is missing,
    // because we generally hide the Events & Alerts section, including the build-in events.
    return null;
  }

  if (!eventSpecificationId) {
    return null;
  }
  const defaultButtonText = isCustom ? t('in-events:buttonViewCustomEvent') : t('in-events:buttonViewBuiltInEvent');

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        label={buttonText ?? defaultButtonText}
        renderIcon={() => <SvgIcon type="lib_views_show" size="xs" />}
        onClick={() => {
          if (resolvedURL) {
            navigate(parseUrl(resolvedURL, true));
          }
        }}
      />
    );
  }

  return (
    <Button
      className={classNames({
        [locals.hasMarginRight]: hasMarginRight
      })}
      kind="secondary"
      href={resolvedURL ?? ''}
    >
      {buttonText ?? defaultButtonText}
    </Button>
  );
}

export function getEventSpecificationSettingsBasePath(isCustom: boolean) {
  return isCustom ? globalSettingsAlertingEventCustom : globalSettingsAlertingEventBuiltIn;
}

function isCustomEvent(event: Event): boolean {
  return event.metadata?.custom_issue ?? false;
}
