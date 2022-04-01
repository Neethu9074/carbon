/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

export const APP_CONFIGS = 'applicationConfigs';
export const MOB_CONFIGS = 'mobileAppConfigs';
export const WEB_CONFIGS = 'websiteConfigs';
export const ALERT_CHANNEL_CONFIGS = 'abstractIntegrationConfigs';
export const EVENT_CONFIGS = 'customEventSpecificationConfigs';
export const SMART_ALERT_CONFIGS = 'smartAlertConfigs';
export const ALERT_CONFIGS = 'alertConfigs';
export const GROUP_CONFIGS = 'groupConfigs';

export const MIGRATION_CONFIGS = [
  {
    type: APP_CONFIGS,
    label: 'Applications',
    icon: 'lib_application',
    configs: [],
    selected: null
  },
  {
    type: WEB_CONFIGS,
    label: 'Websites',
    icon: 'lib_website',
    configs: [],
    selected: null
  },
  {
    type: MOB_CONFIGS,
    label: 'Mobile Apps',
    icon: 'lib_mobile_app',
    configs: [],
    selected: null
  },
  {
    type: ALERT_CHANNEL_CONFIGS,
    label: 'Alert Channels',
    icon: 'lib_alerts_alert',
    configs: [],
    selected: null
  },

  {
    type: EVENT_CONFIGS,
    label: 'Custom Events',
    icon: 'lib_help_error_warning',
    configs: [],
    selected: null
  },
  {
    type: SMART_ALERT_CONFIGS,
    label: 'Smart Alerts',
    icon: 'lib_events_critical',
    configs: [],
    selected: null
  },
  {
    type: ALERT_CONFIGS,
    label: 'Alerts',
    icon: 'lib_alerts_alert',
    configs: [],
    selected: null
  },
  {
    type: GROUP_CONFIGS,
    label: 'Groups',
    icon: 'lib_group_by',
    configs: [],
    selected: null
  }
];
