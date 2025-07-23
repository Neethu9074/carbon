/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

//@ts-expect-error TS migration
import DashboardBreadcrumb from 'in-infrastructure/Dashboard/components/DashboardBreadcrumb';
//@ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
//@ts-expect-error TS migration
import ZoneTag from 'in-map/components/MapSidebar/components/ZoneTag';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { SnapshotItem } from 'in-infrastructure/CollectorsView/Dashboard/CollectorDashboard';
//@ts-expect-error TS migration
import { getShowZoneInSidebarHeader } from 'in-sdk/snapshot';
import DashboardHeader from 'in-components/DashboardHeader';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './CollectorDashboardHeader.mless';

interface Props {
  snapshot: SnapshotItem;
}

export default function CollectorDashboardHeader({ snapshot }: Props) {
  const timeConfig = useTimeConfig();

  function renderButtonLine() {
    return (
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
      />
    );
  }

  function renderMetaInformation() {
    return <div className={locals.headerMetaLabel}>{t('in-infrastructure:collectorView.otelCollector')}</div>;
  }

  return (
    <>
      {snapshot && (
        <>
          <DashboardBreadcrumb
            snapshotId={snapshot.get('id')}
            snapshot={snapshot}
            title={t('in-infrastructure:collectorView.otelCollector')}
          />
          <DashboardHeader
            title={snapshot.get('label')}
            label={snapshot.get('label')}
            renderButtonLine={renderButtonLine}
            renderMetaInformation={renderMetaInformation}
            isBeta
          />
        </>
      )}
    </>
  );
}
