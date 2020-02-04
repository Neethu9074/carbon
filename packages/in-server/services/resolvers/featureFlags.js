module.exports = exports = (tenant, unit) => [
  {
    uiClientKey: 'mobileAppMonitoringEnabled',
    instanaCtlKey: 'feature.mobile.app.monitoring.enabled',
    consulKey: `settings/${tenant}-${unit}/MOBILE_APP_MONITORING_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'isSelfService',
    instanaCtlKey: 'feature.is.self.service',
    consulKey: `settings/${tenant}-${unit}/IS_SELFSERVICE`,
    defaultValue: false
  },
  {
    uiClientKey: 'releaseNotesEnabled',
    instanaCtlKey: 'feature.release.notes.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'maintenanceNotesEnabled',
    instanaCtlKey: 'feature.maintenance.notes.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'useInstanaSaasEumTrackingUrlEnabled',
    instanaCtlKey: 'feature.use.instana.saas.eum.tracking.url.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'tenantSwitcherEnabled',
    instanaCtlKey: 'feature.tenant.switcher.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'onPremLicenseInformationEnabled',
    instanaCtlKey: 'feature.onprem.license.information.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'customEventsInWebsiteMonitoringEnabled',
    instanaCtlKey: 'feature.custom.events.in.website.monitoring.enabled',
    consulKey: `settings/${tenant}-${unit}/CUSTOM_EVENTS_WEBSITE_MONITORING_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'ruleDeprecationValidationChecksEnabled',
    instanaCtlKey: 'feature.rule.deprecation.validation.checks.enabled',
    consulKey: `settings/${tenant}-${unit}/RULE_DEPRECATION_VALIDATION_CHECKS_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'containerInfoEnabled',
    instanaCtlKey: 'feature.container.info.enabled',
    consulKey: `settings/${tenant}-${unit}/CONTAINER_INFO_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'internalMonitoringUnit',
    instanaCtlKey: 'feature.internal.monitoring.unit',
    consulKey: `settings/${tenant}-${unit}/INTERNAL_MONITORING_UNIT`,
    defaultValue: false
  },
  {
    uiClientKey: 'isRbacEnabled',
    instanaCtlKey: 'feature.is.rbac.enabled',
    consulKey: `settings/${tenant}-${unit}/IS_RBAC_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'isAdhocMetricAggregationEnabled',
    instanaCtlKey: 'feature.is.adhoc.metric.aggregation.enabled',
    consulKey: `settings/${tenant}-${unit}/IS_ADHOC_METRIC_AGGREGATION_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'samplingIndicatorEnabled',
    instanaCtlKey: 'feature.sampling.indicator.enabled',
    consulKey: `settings/SAMPLING_INDICATOR_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'pcfEnabled',
    instanaCtlKey: 'feature.pcf.enabled',
    consulKey: `settings/${tenant}-${unit}/PCF_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'websiteUserBreakdownEnabled',
    instanaCtlKey: 'feature.website.user.breakdown.enabled',
    consulKey: `settings/${tenant}-${unit}/WEBSITE_USER_BREAKDOWN_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'isOnboardingGuideEnabled',
    instanaCtlKey: 'feature.onboarding.guide.enabled',
    consulKey: `settings/${tenant}-${unit}/IS_ONBOARDING_GUIDE_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'contextGuideEnabled',
    instanaCtlKey: 'feature.context.guide.enabled',
    consulKey: `settings/${tenant}-${unit}/CONTEXT_GUIDE_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'fullTermsConfigEnabled',
    instanaCtlKey: 'feature.full.terms.config.enabled',
    consulKey: `settings/${tenant}-${unit}/FULL_TERMS_CONFIG_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'eumAlertingEnabled',
    instanaCtlKey: 'feature.eum.alerting.enabled',
    consulKey: `settings/${tenant}-${unit}/EUM_ALERTING_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'vsphereEnabled',
    instanaCtlKey: 'feature.vsphere.enabled',
    consulKey: `settings/${tenant}-${unit}/VSPHERE_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'apDashboardEventsEnabled',
    instanaCtlKey: 'feature.ap.dashboard.events.enabled',
    consulKey: `settings/${tenant}-${unit}/AP_DASHBOARD_EVENTS_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'customDashboardsEnabled',
    instanaCtlKey: 'feature.custom.dashboards.enabled',
    consulKey: `settings/${tenant}-${unit}/CUSTOM_DASHBOARDS_ENABLED`,
    defaultValue: false
  }
];
