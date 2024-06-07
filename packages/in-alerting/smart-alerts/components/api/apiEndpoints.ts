/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

interface baseUrlProps {
  [key: string]: string;
}

export const baseUrl: baseUrlProps = {
  MOBILEAPP: 'api/events/settings/mobile-app-alert-configs',
  INFRA: '/api/events/settings/infra-alert-configs',
  SYNTHETICS: '/api/events/settings/global-alert-configs/synthetics',
  WEBSITE: 'api/events/settings/website-alert-configs',
  APPLICATION: 'api/events/settings/application-alert-configs',
  APPLICATION_GLOBAL: '/api/events/settings/global-alert-configs/applications',
  LOGS: 'api/events/settings/global-alert-configs/logs',
  SLO: 'api/events/settings/global-alert-configs/service-levels'
};
