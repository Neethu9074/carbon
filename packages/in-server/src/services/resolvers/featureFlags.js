module.exports = exports = (tenant, unit) => [
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
    uiClientKey: 'contextGuideEnabled',
    instanaCtlKey: 'feature.context.guide.enabled',
    consulKey: `settings/CONTEXT_GUIDE_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'fullTermsConfigEnabled',
    instanaCtlKey: 'feature.full.terms.config.enabled',
    consulKey: `settings/${tenant}-${unit}/FULL_TERMS_CONFIG_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'vsphereEnabled',
    instanaCtlKey: 'feature.vsphere.enabled',
    consulKey: `settings/${tenant}-${unit}/VSPHERE_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'customDashboardsEnabled',
    instanaCtlKey: 'feature.custom.dashboards.enabled',
    consulKey: `settings/${tenant}-${unit}/CUSTOM_DASHBOARDS_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'skipOnboardingDialog',
    instanaCtlKey: 'feature.skip.oboarding.dialog',
    consulKey: `settings/${tenant}-${unit}/SKIP_ONBOARDING_DIALOG`,
    defaultValue: false
  },
  {
    uiClientKey: 'applicationSmartAlertsEnabled',
    instanaCtlKey: 'feature.application.smart.alerts.enabled',
    consulKey: `settings/${tenant}-${unit}/APPLICATION_SMART_ALERTS_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'agentMonitoringIssuesEnabled',
    instanaCtlKey: 'feature.agent.monitoring.issues.enabled',
    consulKey: `settings/${tenant}-${unit}/AGENT_MONITORING_ISSUES_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'sloConfigurationEnabled',
    instanaCtlKey: 'feature.sli.configuration.enabled',
    consulKey: `settings/${tenant}-${unit}/SLO_CONFIGURATION_ENABLED`,
    defaultValue: false
  }
];
