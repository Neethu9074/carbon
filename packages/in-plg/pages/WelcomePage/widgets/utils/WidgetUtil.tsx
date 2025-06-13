/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t, Trans } from '@instana/i18n-react';
import { Link } from '@instana/components';

import { role } from 'in-stores/user';

export const DEFAULT_NUMBER_ROWS = 5;
export const MAX_NUMBER_ROWS = 2000;

export function getNoDataHeader(label: string) {
  switch (label) {
    case 'applicationWidget':
      return t('in-plg:welcomepage.noData.applicationWidget.header');
    case 'platformsWidget':
      return t('in-plg:welcomepage.noData.platformsWidget.header');
    case 'businessMonitoringWidget':
      return t('in-plg:welcomepage.noData.businessMonitoringWidget.header');
    case 'incidentsWidget':
      return t('in-plg:welcomepage.noData.incidentsWidget.header');
    case 'websitesWidget':
      return t('in-plg:welcomepage.noData.websitesWidget.header');
    case 'mobileListWidget':
      return t('in-plg:welcomepage.noData.mobileListWidget.header');
    case 'infrastructureWidget.host':
      return t('in-plg:welcomepage.noData.infrastructureWidget.hosts.header');
    case 'infrastructureWidget.docker':
      return t('in-plg:welcomepage.noData.infrastructureWidget.docker.header');
    case 'infrastructureWidget.process':
      return t('in-plg:welcomepage.noData.infrastructureWidget.process.header');
    case 'syntheticWidget.test':
      return t('in-plg:welcomepage.noData.syntheticWidget.test.header');
    case 'syntheticWidget.location':
      return t('in-plg:welcomepage.noData.syntheticWidget.location.header');
    case 'syntheticWidget.smartalerts':
      return t('in-plg:welcomepage.noData.syntheticWidget.smartalerts.header');
    case 'dashboardWidget':
      return t('in-plg:welcomepage.noData.dashboardWidget.header');
    case 'serviceLevelsWidget':
      return t('in-plg:welcomepage.noData.serviceLevelsWidget.header');
    default:
      return '';
  }
}

export function getNoDataDescription(label: string) {
  switch (label) {
    case 'applicationWidget':
      return <Trans i18nKey="in-plg:welcomepage.noData.applicationWidget.description" />;
    case 'platformsWidget':
      return t('in-plg:welcomepage.noData.platformsWidget.description');
    case 'businessMonitoringWidget':
      return t('in-plg:welcomepage.noData.businessMonitoringWidget.description');
    case 'incidentsWidget':
      return <Trans i18nKey="in-plg:welcomepage.noData.incidentsWidget.description" />;
    case 'websitesWidget':
      return <Trans i18nKey="in-plg:welcomepage.noData.websitesWidget.description" />;
    case 'mobileListWidget':
      return <Trans i18nKey="in-plg:welcomepage.noData.mobileListWidget.description" />;
    case 'infrastructureWidget.host':
    case 'infrastructureWidget.docker':
    case 'infrastructureWidget.process':
      return (
        <Trans
          i18nKey="in-plg:welcomepage.noData.infrastructureWidget.description"
          components={{
            linkToAgents: (
              <Link href="/#/agents/installation" disabled={!role?.canConfigureAgents}>
                {t('in-plg:welcomepage.noData.infrastructureWidget.link')}
              </Link>
            )
          }}
        />
      );
    case 'syntheticWidget.test':
      return <Trans i18nKey="in-plg:welcomepage.noData.syntheticWidget.test.description" />;
    case 'syntheticWidget.location':
      return t('in-plg:welcomepage.noData.syntheticWidget.location.description');
    case 'syntheticWidget.smartalerts':
      return <Trans i18nKey="in-plg:welcomepage.noData.syntheticWidget.smartalerts.description" />;
    case 'dashboardWidget':
      return <Trans i18nKey="in-plg:welcomepage.noData.dashboardWidget.description" />;
    case 'serviceLevelsWidget':
      return <Trans i18nKey="in-plg:welcomepage.noData.serviceLevelsWidget.description" />;
    default:
      return '';
  }
}

export const getItemId = (item: any, widgetName?: string) => {
  if (!widgetName) return null;

  switch (widgetName) {
    case 'infrastructureWidget':
      return item.snapshotId;
    case 'applicationWidget':
      return item?.application?.id;
    case 'websitesWidget':
      return item?.website?.id;
    case 'mobileListWidget':
      return item?.mobileApp?.id;
    case 'platformsWidget':
      return item?.isKubernetes ? item.cluster.id : item.id;
    case 'businessMonitoringWidget':
      return item?.businessProcess?.definitionId;
    case 'dashboardWidget':
      return item?.id;
    default:
      return null;
  }
};
