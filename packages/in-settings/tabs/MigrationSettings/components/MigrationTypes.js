/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

export const APP_CONFIGS = 'applicationConfigs';
export const MOB_CONFIGS = 'mobileAppConfigs';
export const WEB_CONFIGS = 'websiteConfigs';
export const ALERT_CHANNEL_CONFIGS = 'abstractIntegrationConfigs';
export const EVENT_CONFIGS = 'customEventSpecificationConfigs';
export const SMART_APP_ALERT_CONFIGS = 'applicationAlertConfigs';
export const SMART_WEB_ALERT_CONFIGS = 'websiteAlertConfigs';
export const ALERT_CONFIGS = 'alertingConfigs';
export const GROUP_CONFIGS = 'groupConfigs';

export const MIGRATION_CONFIGS = [
  {
    key: APP_CONFIGS,
    type: APP_CONFIGS,
    label: 'Applications',
    icon: 'lib_application',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  },
  {
    key: WEB_CONFIGS,
    type: WEB_CONFIGS,
    label: 'Websites',
    icon: 'lib_website',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  },
  {
    key: MOB_CONFIGS,
    type: MOB_CONFIGS,
    label: 'Mobile Apps',
    icon: 'lib_mobile_app',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  },
  {
    key: ALERT_CHANNEL_CONFIGS,
    type: ALERT_CHANNEL_CONFIGS,
    label: 'Alert Channels',
    icon: 'lib_alerts_alert',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  },

  {
    key: EVENT_CONFIGS,
    type: EVENT_CONFIGS,
    label: 'Custom Events',
    icon: 'lib_help_error_warning',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  },
  {
    key: SMART_APP_ALERT_CONFIGS,
    type: SMART_APP_ALERT_CONFIGS,
    label: 'Application Smart Alerts',
    icon: 'lib_events_critical',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  },
  {
    key: SMART_WEB_ALERT_CONFIGS,
    type: SMART_WEB_ALERT_CONFIGS,
    label: 'Website Smart Alerts',
    icon: 'lib_events_critical',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  },
  {
    key: ALERT_CONFIGS,
    type: ALERT_CONFIGS,
    label: 'Infrastructure Alerts',
    icon: 'lib_alerts_alert',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  },
  {
    key: GROUP_CONFIGS,
    type: GROUP_CONFIGS,
    label: 'Groups',
    icon: 'lib_group_by',
    configs: [],
    selected: [],
    shadowSelected: [],
    filtered: []
  }
];
