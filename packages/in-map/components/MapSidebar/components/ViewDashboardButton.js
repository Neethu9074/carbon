/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';

import { Button } from '@instana/components';

import { isMapSidebarFocused$, setMapSidebarFocused } from 'in-map/components/MapSidebar/focus';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { t } from 'in-i18n';

export default function ViewDashboardButton({ snapshotId }) {
  const getDashboardLink = useGetDashboardLink();
  const buttonRef = useRef();

  isMapSidebarFocused$.subscribe(isMapSidebarFocused => {
    if (!isMapSidebarFocused) return;

    buttonRef.current?.focus();
    setMapSidebarFocused(false);
  });

  return (
    <Button size="compact" kind="tertiary" href={getDashboardLink(snapshotId)} ref={buttonRef}>
      {t('in-map:openDashboard')}
    </Button>
  );
}
