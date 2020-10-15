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
    uiClientKey: 'routeIdOverPathTplEnabled',
    instanaCtlKey: 'feature.route.id.over.path.tpl.enabled',
    consulKey: `settings/${tenant}-${unit}/ROUTE_ID_OVER_PATH_TPL_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'infraExplorePresentationEnabled',
    instanaCtlKey: 'feature.infrastructure.explore.presentation.enabled',
    consulKey: `settings/${tenant}-${unit}/INFRASTRUCTURE_EXPLORE_PRESENTATION_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'infraExporeDataEnabled',
    instanaCtlKey: 'feature.infrastructure.explore.data.enabled',
    consulKey: `settings/${tenant}-${unit}/INFRASTRUCTURE_EXPLORE_DATA_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'newApCreationEnabled',
    instanaCtlKey: 'feature.new.ap.creation.enabled',
    consulKey: `settings/${tenant}-${unit}/NEW_AP_CREATION_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'entityCountWidgetEnabled',
    instanaCtlKey: 'feature.entity.count.widget.enabled',
    consulKey: `settings/${tenant}-${unit}/ENTITY_COUNT_WIDGET_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'ampEnabled',
    instanaCtlKey: 'feature.amp.enabled',
    consulKey: `settings/${tenant}-${unit}/AMP_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'ampCompanyInfoEnabled',
    instanaCtlKey: 'feature.amp.company.info.enabled',
    consulKey: `settings/AMP_COMPANY_INFO_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'alertCustomPayloadEnabled',
    instanaCtlKey: 'feature.alert.custom.payload.enabled',
    consulKey: `settings/${tenant}-${unit}/ALERT_CUSTOM_PAYLOAD_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'sloWidgetEnabled',
    instanaCtlKey: 'feature.slo.widget.enabled',
    consulKey: `settings/${tenant}-${unit}/SLO_WIDGET_ENABLED`,
    defaultValue: true
  },
  {
    uiClientKey: 'newAnalyticsEnabled',
    instanaCtlKey: 'feature.new.analytics.enabled',
    consulKey: `settings/${tenant}-${unit}/NEW_ANALYTICS_ENABLED`,
    defaultValue: false
  },
  {
    uiClientKey: 'persistentVolumeSupportEnabled',
    instanaCtlKey: 'feature.kubernetes.pvc.enabled',
    consulKey: `settings/${tenant}-${unit}/KUBERNETES_PVC_ENABLED`,
    defaultValue: false
  }
];
