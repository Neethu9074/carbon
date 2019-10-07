const rp = require('request-promise');

const serverConfig = require('../../serverConfig.js');
const cache = require('../loadingCache').createLoadingCache({ ttl: serverConfig.consul.cacheExpiry });

console.log('Initializing Consul resolver with config', serverConfig.consul);

exports.getUiBackendBaseUrl = (tenant, unit) =>
  cache(`getUiBackendBaseUrl:${tenant}:${unit}`, () => {
    return lookupServiceBaseUrl(`${tenant}-${unit}-ui-backend`);
  });

exports.getGroundskeeperBaseUrl = () =>
  cache(`groundskeeper`, () => {
    return lookupServiceBaseUrl(`groundskeeper`);
  });

exports.getBaseUrl = (tenant, unit) =>
  Promise.resolve(`https://${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`);

exports.getButlerDomain = (tenant, unit) =>
  Promise.resolve(`${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`);

exports.getFeatureFlags = (tenant, unit) =>
  cache(`getFeatureFlags:${tenant}:${unit}`, () => {
    return Promise.all([
      getBooleanSetting(`settings/${tenant}-${unit}/JAVASCRIPT_STACK_TRACE_TRANSLATION_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/IS_SELFSERVICE`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/LAST_SEVEN_DAYS_TIME_PRESET_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/CUSTOM_EVENTS_WEBSITE_MONITORING_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/RULE_DEPRECATION_VALIDATION_CHECKS_ENABLED`, true),
      getBooleanSetting(`settings/${tenant}-${unit}/CONTAINER_INFO_ENABLED`, true),
      getBooleanSetting(`settings/${tenant}-${unit}/INTERNAL_MONITORING_UNIT`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/IS_RBAC_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/IS_ADHOC_METRIC_AGGREGATION_ENABLED`, true),
      getBooleanSetting(`settings/${tenant}-${unit}/CUSTOM_DASHBOARDS_ENABLED`, false),
      getBooleanSetting(`settings/TRACK_URL_PATH_CHANGES`, true),
      getBooleanSetting(`settings/SAMPLING_INDICATOR_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/UNMONITORED_HOSTS_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/PCF_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/HUMIO_ENABLED`, true),
      getBooleanSetting(`settings/${tenant}-${unit}/LOG_DNA_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/URL_SHORTENER_ENABLED`, true),
      getBooleanSetting(`settings/${tenant}-${unit}/WEBSITE_USER_BREAKDOWN_ENABLED`, false),
      getBooleanSetting(`settings/${tenant}-${unit}/OPT_IN_OPT_OUT_ENABLED`, true),
      getBooleanSetting(`settings/${tenant}-${unit}/IS_ON_PREM`, false)
    ]).then(
      ([
        javaScriptStackTraceTranslationEnabled,
        isSelfService,
        lastSevenDaysTimePresetEnabled,
        customEventsInWebsiteMonitoringEnabled,
        ruleDeprecationValidationChecksEnabled,
        containerInfoEnabled,
        internalMonitoringUnit,
        isRbacEnabled,
        isAdhocMetricAggregationEnabled,
        customDashboardsEnabled,
        trackUrlPathChanges,
        samplingIndicatorEnabled,
        unmonitoredHostsEnabled,
        pcfEnabled,
        humioEnabled,
        logDnaEnabled,
        urlShortenerEnabled,
        websiteUserBreakdownEnabled,
        optInOptOutEnabled,
        isOnPrem
      ]) => ({
        javaScriptStackTraceTranslationEnabled,
        isSelfService,
        lastSevenDaysTimePresetEnabled,
        releaseNotesEnabled: true,
        maintenanceNotesEnabled: true,
        useInstanaSaasEumTrackingUrlEnabled: true,
        tenantSwitcherEnabled: true,
        onPremLicenseInformationEnabled: false,
        customEventsInWebsiteMonitoringEnabled,
        ruleDeprecationValidationChecksEnabled,
        containerInfoEnabled,
        internalMonitoringUnit,
        isRbacEnabled,
        isAdhocMetricAggregationEnabled,
        trackUrlPathChanges,
        samplingIndicatorEnabled,
        unmonitoredHostsEnabled,
        customDashboardsEnabled,
        pcfEnabled,
        humioEnabled,
        logDnaEnabled,
        urlShortenerEnabled,
        websiteUserBreakdownEnabled,
        optInOptOutEnabled,
        isOnPrem
      })
    );
  });

exports.getConfiguration = (tenant, unit) =>
  cache(`getConfiguration:${tenant}:${unit}`, () => {
    return getIntSetting(`settings/${tenant}-${unit}/MAX_ALLOWED_ALERTINGS_CONFIGURATIONS`, 50).then(
      maxAllowedAlertingConfigurations => ({
        maxAllowedAlertingConfigurations
      })
    );
  });

function lookupServiceBaseUrl(serviceName) {
  return rp({
    method: 'GET',
    url: `${serverConfig.consul.baseUrl}/v1/catalog/service/${serviceName}`,
    json: true,
    simple: true,
    timeout: 5000,
    resolveWithFullResponse: false
  }).then(services => {
    if (services.length === 0) {
      const error = new Error(`Consul lookup returned zero results for service name: ${serviceName}`);
      error.ignoreStackTrace = true;
      error.notFound = true;
      return Promise.reject(error);
    }
    return `http://${services[0].ServiceAddress}:${services[0].ServicePort}`;
  });
}

function getBooleanSetting(path, notDefinedFallback) {
  return getSetting(path, notDefinedFallback, str => str === 'true');
}

function getIntSetting(path, notDefinedFallback) {
  return getSetting(path, notDefinedFallback, str => {
    const v = parseInt(str, 10);
    if (isNaN(v)) {
      const error = new Error(
        `Could not parse integer setting retrieved from Consul at path ${path}. Received value: ${str}`
      );
      error.ignoreStackTrace = true;
      throw error;
    }
    return v;
  });
}

function getSetting(path, notDefinedFallback, valueParser) {
  return rp({
    method: 'GET',
    url: `${serverConfig.consul.baseUrl}/v1/kv/${path}`,
    json: true,
    simple: false,
    timeout: 5000,
    resolveWithFullResponse: true
  }).then(response => {
    if (response.statusCode === 404) {
      return notDefinedFallback;
    }

    if (response.statusCode < 200 || response.statusCode > 299) {
      const error = new Error(
        `Retrieval of setting from consul at path ${path} failed. Received status code ${
          response.statusCode
        } from Consul API.`
      );
      error.ignoreStackTrace = true;
      return Promise.reject(error);
    }

    if (response.body.length === 0) {
      return notDefinedFallback;
    }

    return valueParser(Buffer.from(response.body[0].Value, 'base64').toString('utf8'));
  });
}
