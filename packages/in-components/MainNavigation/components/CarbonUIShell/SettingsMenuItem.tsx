/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { locationWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { settingsPath } from 'in-stores/navigation/paths/mainPaths';
import { playwithEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

function InternalView() {
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);
  const { location, createHref, matchLocation } = useNavigation();

  if (!isInternalVisible) return null;

  const targetLocation = locationWithoutQueryParameter({ ...location, pathname: '/internal' });

  return (
    <MenuItem
      id="main-nav-internal"
      label={t('in-components:mainNavigation.viewSwitcherLabelInternal')}
      icon="lib_actions_lock"
      isActive={matchLocation('/internal')}
      href={createHref(targetLocation)}
    />
  );
}

export default function SettingsMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();
  if (playwithEnabled) return null;

  return (
    <>
      <MenuItem
        id="main-nav-settings"
        label={t('in-components:mainNavigation.viewSwitcherLabelSettings')}
        icon="lib_actions_settings_inverted"
        isActive={matchLocation(settingsPath)}
        href={createHrefToPath(settingsPath)}
      />
      <InternalView />
    </>
  );
}
