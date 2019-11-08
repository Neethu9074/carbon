module.exports = exports = (tenant, unit) => [
  {
    uiClientKey: 'javaScriptStackTraceTranslationEnabled',
    instanaCtlKey: 'feature.javaScript.stack.trace.translation.enabled',
    consulKey: `settings/${tenant}-${unit}/JAVASCRIPT_STACK_TRACE_TRANSLATION_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'isSelfService',
    instanaCtlKey: 'feature.is.self.service',
    consulKey: `settings/${tenant}-${unit}/IS_SELFSERVICE`,
    defaultValue: false
  },
  {
    uiClientKey: 'lastSevenDaysTimePresetEnabled',
    instanaCtlKey: 'feature.last.seven.days.time.preset.enabled',
    consulKey: `settings/${tenant}-${unit}/LAST_SEVEN_DAYS_TIME_PRESET_ENABLED`,
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
    uiClientKey: 'trackUrlPathChanges',
    instanaCtlKey: 'feature.track.url.path.changes',
    consulKey: `settings/TRACK_URL_PATH_CHANGES`,
    defaultValue: true
  },
  {
    uiClientKey: 'samplingIndicatorEnabled',
    instanaCtlKey: 'feature.sampling.indicator.enabled',
    consulKey: `settings/SAMPLING_INDICATOR_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'unmonitoredHostsEnabled',
    instanaCtlKey: 'feature.unmonitored.hosts.enabled',
    consulKey: `settings/${tenant}-${unit}/UNMONITORED_HOSTS_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'customDashboardsEnabled',
    instanaCtlKey: 'feature.custom.dashboards.enabled',
    consulKey: `settings/${tenant}-${unit}/CUSTOM_DASHBOARDS_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'pcfEnabled',
    instanaCtlKey: 'feature.pcf.enabled',
    consulKey: `settings/${tenant}-${unit}/PCF_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'humioEnabled',
    instanaCtlKey: 'feature.humio.enabled',
    consulKey: `settings/${tenant}-${unit}/HUMIO_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'splunkEnabled',
    instanaCtlKey: 'feature.splunk.enabled',
    consulKey: `settings/${tenant}-${unit}/SPLUNK_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'logDnaEnabled',
    instanaCtlKey: 'feature.logDna.enabled',
    consulKey: `settings/${tenant}-${unit}/LOG_DNA_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'urlShortenerEnabled',
    instanaCtlKey: 'feature.url.shortener.enabled',
    consulKey: `settings/${tenant}-${unit}/URL_SHORTENER_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'websiteUserBreakdownEnabled',
    instanaCtlKey: 'feature.website.user.breakdown.enabled',
    consulKey: `settings/${tenant}-${unit}/WEBSITE_USER_BREAKDOWN_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'optInOptOutEnabled',
    instanaCtlKey: 'feature.opt.in.opt.out.enabled',
    consulKey: `settings/${tenant}-${unit}/OPT_IN_OPT_OUT_ENABLED`,
    defaultValue: true
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
    uiClientKey: 'isOnPrem',
    instanaCtlKey: 'feature.on.prem',
    consulKey: `settings/${tenant}-${unit}/IS_ON_PREM`,
    defaultValue: false
  },
  {
    uiClientKey: 'eumAlertingEnabled',
    instanaCtlKey: 'feature.eum.alerting.enabled',
    consulKey: `settings/${tenant}-${unit}/EUM_ALERTING_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'googleAnalyticsDisabled',
    instanaCtlKey: 'feature.google.analytics.disabled',
    consulKey: `settings/${tenant}-${unit}/GOOGLE_ANALYTICS_DISABLED`,
    defaultValue: false
  }
];
