/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button, CarbonMenuItem, SvgIcon } from '@instana/components';

import { joinExpressions, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE } from 'in-services/tracking/tracking';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { containsTagName } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { createChartedMetric } from 'in-analyze/navigation/paths';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { entityTypes } from 'in-analyze/applicationFilter';
import Tooltip from 'in-components/Tooltip';
import { t, Trans } from 'in-i18n';

const dataSource = 'calls';
const STATUS_CODE = 'statusCode';
const HTTP_STATUS_CALL = 'call.http.status';
const HTTP_STATUS_CLASS = 'call.http.statusClass';
const alertTypeWithDisabledGrouping = ['slowness'];
export const tagNamesToUseEndpointGrouping = ['endpoint.id', 'endpoint.name', 'service.id', 'service.name'];

export default function AnalyzeApplicationEventButton({
  alertConfig,
  timeConfig,
  applicationId,
  applicationName,
  serviceId,
  endpointId,
  adaptiveBaselineInfo = {},
  as = 'button'
}) {
  const { trackCta } = useSegmentTracking();
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const { navigate } = useNavigation();

  const linkToUA = getLinkToUnboundAnalytics(
    {
      applicationId,
      applicationName,
      serviceId,
      endpointId,
      alertConfig,
      timeConfig,
      adaptiveBaselineInfo
    },
    getLinkToApplicationAnalyze
  );

  const linkDisabled = !linkToUA;

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        renderIcon={() => <SvgIcon type="lib_application_call" size="xs" />}
        onClick={() => {
          trackCta(APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE);
          navigate(parseUrl(linkToUA, true));
        }}
        disabled={linkDisabled}
        label={t('in-events:analyzeCalls')}
      />
    );
  }

  return (
    <Tooltip
      content={
        linkDisabled && (
          <div>
            <Trans i18nKey="in-events:tooltipAnalyzeCalls" />
          </div>
        )
      }
    >
      <Button
        kind="primary"
        icon="lib_application_call"
        onClick={() => trackCta(APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE)}
        href={linkToUA}
        disabled={linkDisabled}
      >
        {t('in-events:analyzeCalls')}
      </Button>
    </Tooltip>
  );
}

AnalyzeApplicationEventButton.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  applicationId: PropTypes.string.isRequired,
  applicationName: PropTypes.string,
  serviceId: PropTypes.string,
  adaptiveBaselineInfo: PropTypes.object,
  endpointId: PropTypes.string,
  as: PropTypes.oneOf(['button', 'menuItem'])
};

export function getLinkToUnboundAnalytics(
  {
    applicationId,
    applicationName,
    serviceId,
    serviceName, // still used for link in Affected Entities list
    endpointId,
    endpointName, // still used for link in Affected Entities list
    alertConfig,
    timeConfig,
    adaptiveBaselineInfo,
    groupingTagName = null
  },
  getLinkToApplicationAnalyze
) {
  const { rule, tagFilterExpression, includeInternal, includeSynthetic, evaluationType } = alertConfig;
  const { alertType, statusCodeStart, statusCodeEnd } = rule;
  const groupByStatusClass = alertType == STATUS_CODE && statusCodeStart != statusCodeEnd;

  const excludeViolationRelatedFilters = alertType === STATUS_CODE;

  const groupByTag = groupingTagName
    ? groupingTagName
    : getGroupingTagName(alertType, tagFilterExpression, serviceId, endpointId, evaluationType, groupByStatusClass);

  const enrichedAnalyzeTagFilterFormModel = getEnrichedAnalyzeTagFilterFormModel({
    alertConfig,
    applicationId,
    applicationName,
    serviceId,
    endpointId,
    timeConfig,
    excludeViolationRelatedFilters,
    endpointName,
    serviceName,
    adaptiveBaselineInfo
  });

  const linkToApplicationAnalyze = getLinkToApplicationAnalyze({
    dataSource,
    timeConfig,
    groupBy: toGroupByTag(groupByTag),
    chartedMetrics: getChartedMetrics(alertType),
    formModel: enrichedAnalyzeTagFilterFormModel,
    hiddenCalls: {
      includeInternal,
      includeSynthetic
    }
  });

  return urlWithoutQueryParameter(linkToApplicationAnalyze);
}

export function getEnrichedAnalyzeTagFilterFormModel({
  alertConfig,
  applicationId,
  applicationName,
  serviceId,
  endpointId,
  timeConfig,
  excludeViolationRelatedFilters = false,
  endpointName,
  serviceName,
  adaptiveBaselineInfo = {}
}) {
  const { rule, tagFilterExpression } = alertConfig;
  const alertType = rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);

  return joinExpressions({
    expressions: [
      applicationName
        ? blueprintConfig.getEntityTagFilterFormModel(
            alertConfig,
            applicationId,
            applicationName,
            serviceId,
            endpointId
          )
        : null,
      serviceName ? tagFilter('service.name', EQUALS, serviceName, null, DESTINATION) : null, // service.name is still used by the affected entities list
      endpointName ? tagFilter('endpoint.name', EQUALS, endpointName, null, DESTINATION) : null, // endpoint.name is still used by the affected entities list
      fromBackendModel(tagFilterExpression),
      excludeViolationRelatedFilters ? [] : blueprintConfig.getRuleTagFilterFormModel(rule),
      excludeViolationRelatedFilters
        ? []
        : blueprintConfig.getExtraAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig, adaptiveBaselineInfo)
    ].filter(Boolean)
  });
}

function getChartedMetrics(alertType) {
  if (alertType === 'slowness') {
    return [createChartedMetric('latency', 'DISTRIBUTION')];
  }
  if (alertType === 'errors') {
    // we don't show errors with MEAN aggregation here, because we already include a call.erroneous filter
    return [createChartedMetric('erroneousCalls', 'SUM')];
  }
  return [createChartedMetric('calls', 'SUM')];
}

function getGroupingTagName(alertType, tagFilterExpression, serviceId, endpointId, evaluationType, groupByStatusClass) {
  if (alertTypeWithDisabledGrouping.includes(alertType)) {
    return null; // no grouping
  }

  if (alertType === 'errors') {
    switch (evaluationType) {
      case 'PER_AP':
        return 'service.name';
      case 'PER_AP_SERVICE':
        return 'endpoint.name';
      case 'PER_AP_ENDPOINT':
        return 'call.name';
      default:
        break;
    }
  }

  if (alertType === STATUS_CODE) {
    if (groupByStatusClass) {
      return HTTP_STATUS_CLASS;
    }
    return HTTP_STATUS_CALL;
  }
  if (serviceId) {
    return 'endpoint.name';
  }

  if (endpointId) {
    return null;
  }

  if (alertType === 'throughput') {
    const needsGroupByEndpoint = tagNamesToUseEndpointGrouping.some(tagName =>
      containsTagName(tagFilterExpression, tagName)
    );

    return needsGroupByEndpoint ? 'endpoint.name' : 'service.name';
  }

  return dataSourceConstants.calls.defaultGrouping.groupbyTag;
}

function toGroupByTag(tagName) {
  if (!tagName) {
    return {}; // no grouping
  }
  const tagsWithNoEntity = new Set([HTTP_STATUS_CALL, HTTP_STATUS_CLASS, 'call.name']);

  return {
    groupbyTag: tagName,
    groupbyTagEntity: tagsWithNoEntity.has(tagName) ? undefined : entityTypes.DESTINATION
  };
}
