/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from '@instana/i18n-react';

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
    case 'infrastructureWidget':
      return t('in-plg:welcomepage.noData.infrastructureWidget.header');
    case 'syntheticWidget.test':
      return t('in-plg:welcomepage.noData.syntheticWidget.test.header');
    case 'syntheticWidget.location':
      return t('in-plg:welcomepage.noData.syntheticWidget.location.header');
    case 'syntheticWidget.smartalerts':
      return t('in-plg:welcomepage.noData.syntheticWidget.smartalerts.header');
    case 'dashboardWidget':
      return t('in-plg:welcomepage.noData.dashboardWidget.header');
    default:
      return '';
  }
}

export function getNoDataDescription(label: string) {
  switch (label) {
    case 'applicationWidget':
      return t('in-plg:welcomepage.noData.applicationWidget.description');
    case 'platformsWidget':
      return t('in-plg:welcomepage.noData.platformsWidget.description');
    case 'businessMonitoringWidget':
      return t('in-plg:welcomepage.noData.businessMonitoringWidget.description');
    case 'incidentsWidget':
      return t('in-plg:welcomepage.noData.incidentsWidget.description');
    case 'websitesWidget':
      return t('in-plg:welcomepage.noData.websitesWidget.description');
    case 'mobileListWidget':
      return t('in-plg:welcomepage.noData.mobileListWidget.description');
    case 'infrastructureWidget':
      return t('in-plg:welcomepage.noData.infrastructureWidget.description');
    case 'syntheticWidget.test':
      return t('in-plg:welcomepage.noData.syntheticWidget.test.description');
    case 'syntheticWidget.location':
      return t('in-plg:welcomepage.noData.syntheticWidget.location.description');
    case 'syntheticWidget.smartalerts':
      return t('in-plg:welcomepage.noData.syntheticWidget.smartalerts.description');
    case 'dashboardWidget':
      return t('in-plg:welcomepage.noData.dashboardWidget.description');
    default:
      return '';
  }
}

export function getNoDataButton(label: string) {
  switch (label) {
    case 'applicationWidget':
      return t('in-plg:welcomepage.noData.applicationWidget.buttonName');
    case 'websitesWidget':
      return t('in-plg:welcomepage.noData.websitesWidget.buttonName');
    case 'mobileListWidget':
      return t('in-plg:welcomepage.noData.mobileListWidget.buttonName');
    case 'syntheticWidget.test':
      return t('in-plg:welcomepage.noData.syntheticWidget.test.buttonName');
    case 'syntheticWidget.smartalerts':
      return t('in-plg:welcomepage.noData.syntheticWidget.smartalerts.buttonName');
    case 'dashboardWidget':
      return t('in-plg:welcomepage.noData.dashboardWidget.buttonName');
    default:
      return '';
  }
}
