/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

module.exports = exports = [
  {
    uiClientKey: 'isSelfService',
    instanaCtlKey: 'feature.is.self.service',
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
    defaultValue: true
  },
  {
    uiClientKey: 'internalMonitoringUnit',
    instanaCtlKey: 'feature.internal.monitoring.unit',
    defaultValue: false
  },
  {
    uiClientKey: 'samplingIndicatorEnabled',
    instanaCtlKey: 'feature.sampling.indicator.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'pcfEnabled',
    instanaCtlKey: 'feature.pcf.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'websiteUserBreakdownEnabled',
    instanaCtlKey: 'feature.website.user.breakdown.enabled',
    defaultValue: false
  },

  {
    uiClientKey: 'contextGuideEnabled',
    instanaCtlKey: 'feature.context.guide.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'fullTermsConfigEnabled',
    instanaCtlKey: 'feature.full.terms.config.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'vsphereEnabled',
    instanaCtlKey: 'feature.vsphere.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'customDashboardsEnabled',
    instanaCtlKey: 'feature.custom.dashboards.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'skipOnboardingDialog',
    instanaCtlKey: 'feature.skip.oboarding.dialog',
    defaultValue: false
  },
  {
    uiClientKey: 'applicationSmartAlertsEnabled',
    instanaCtlKey: 'feature.application.smart.alerts.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'agentMonitoringIssuesEnabled',
    instanaCtlKey: 'feature.agent.monitoring.issues.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'routeIdOverPathTplEnabled',
    instanaCtlKey: 'feature.route.id.over.path.tpl.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'infraExplorePresentationEnabled',
    instanaCtlKey: 'feature.infrastructure.explore.presentation.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'infraExporeDataEnabled',
    instanaCtlKey: 'feature.infrastructure.explore.data.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'beeInstanaInfraMetricsEnabled',
    instanaCtlKey: 'feature.beeinstana.infra.metrics.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'highResolutionInfrastructureMetricsEnabled',
    instanaCtlKey: 'feature.high.resolution.infrastructure.metrics.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'newApCreationEnabled',
    instanaCtlKey: 'feature.new.ap.creation.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'entityCountWidgetEnabled',
    instanaCtlKey: 'feature.entity.count.widget.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'infraMetricsWidgetEnabled',
    instanaCtlKey: 'feature.infra.metrics.widget.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'ampCompanyInfoEnabled',
    instanaCtlKey: 'feature.amp.company.info.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'sloWidgetEnabled',
    instanaCtlKey: 'feature.slo.widget.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'newAnalyticsEnabled',
    instanaCtlKey: 'feature.new.analytics.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'persistentVolumeSupportEnabled',
    instanaCtlKey: 'feature.kubernetes.pvc.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'qb2InCustomDashboardsEnabled',
    instanaCtlKey: 'feature.qb2.custom.dashboards.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'webMobileQb2AnalyzeEnabled',
    instanaCtlKey: 'feature.web.mobile.qb2.analyze.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'loggingEnabled',
    instanaCtlKey: 'feature.logging.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'loggingEnabledOnTrace',
    instanaCtlKey: 'feature.logging.enabled.on.trace',
    defaultValue: false
  },
  {
    uiClientKey: 'showUserSettingInternalTagsInUA',
    instanaCtlKey: 'feature.show.user.setting.internal.tags.in.ua',
    defaultValue: false
  },
  {
    uiClientKey: 'qb2InAPCreationEnabled',
    instanaCtlKey: 'feature.qb2.ap.creation.enabled',
    defaultValue: true
  },
  {
    uiClientKey: 'languageSelectorEnabled',
    instanaCtlKey: 'feature.language.selector.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'pseudoLanguageEnabled',
    instanaCtlKey: 'feature.pseudo.language.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'authenticationOidcEnabled',
    instanaCtlKey: 'feature.authentication.oidc.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'syntheticCallsEnabled',
    instanaCtlKey: 'feature.synthetic.calls.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'applicationHealthOverviewEnabled',
    instanaCtlKey: 'feature.application.health.overview.enabled',
    defaultValue: false
  },
  {
    uiClientKey: 'hideEventsSettings',
    instanaCtlKey: 'feature.settings.team.events.hide',
    defaultValue: false
  }
];
