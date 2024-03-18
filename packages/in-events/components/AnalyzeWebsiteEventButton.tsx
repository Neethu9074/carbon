/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { AggregationType, WebsiteAlertConfig } from '@instana/types';
import { Button } from '@instana/legacy';

import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { fromBackendModel, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { websitesAlertingEventDetailsGoToAnalyze } from 'in-alerting/smart-alerts/websites/tracker';
// @ts-expect-error Missing exact typings
import { defaultGroupings } from 'in-websites/tags';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLinkToAnalyze } from 'in-websites/navigation/paths';
import { FixedTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

interface AnalyzeWebsiteEventButtonProps {
  alertConfig: WebsiteAlertConfig;
  websiteName: string;
  timeConfig: FixedTimeConfig;
  adaptiveBaselineInfo?: Record<string, number>;
}

export default function AnalyzeWebsiteEventButton({
  alertConfig,
  websiteName,
  timeConfig,
  adaptiveBaselineInfo
}: AnalyzeWebsiteEventButtonProps) {
  const { rule, tagFilterExpression } = alertConfig;
  const { alertType, metricName, aggregation } = rule;

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const linkToUA = useLinkToAnalyze({
    beaconType,
    timeConfig,
    groupBy: getGrouping(alertType, metricName),
    chartedMetrics: getChartedMetrics(alertType, aggregation),
    formModel: joinExpressions({
      expressions: [
        [tagFilter('beacon.website.name', EQUALS, websiteName)],
        tagFilterFormModel,
        blueprintConfig.getRuleTagFilterFormModel(rule),
        blueprintConfig.getExtraAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig, adaptiveBaselineInfo)
      ]
    })
  });
  const linkToUAWithoutParams = urlWithoutQueryParameter(linkToUA!);

  return (
    <Button
      kind="primary"
      icon={getIcon(alertType)}
      onClick={() => websitesAlertingEventDetailsGoToAnalyze({ beaconType })}
      href={linkToUAWithoutParams}
      style={{ outline: '10px red' }}
    >
      {getLinkTitle(alertType, metricName)}
    </Button>
  );
}

function getGrouping(alertType: string, metricName: string) {
  switch (alertType) {
    case 'specificJsError':
      return defaultGroupings.error;
    case 'statusCode':
      return defaultGroupings.httpRequest;
    case 'throughput':
      return metricName === 'pageLoads' ? defaultGroupings.pageLoad : defaultGroupings.pageChange;
    case 'slowness':
      return defaultGroupings.none;
    case 'customEvent':
      return defaultGroupings.custom;
    default:
      throw Error('Unsupported alert type');
  }
}

function getChartedMetrics(alertType: string, aggregation: AggregationType | undefined) {
  switch (alertType) {
    case 'specificJsError':
    case 'statusCode':
    case 'throughput':
    case 'customEvent':
      return [
        {
          metricId: 'beaconCount',
          aggregationId: 'SUM'
        }
      ];
    case 'slowness':
      return [
        {
          metricId: 'onLoadTime',
          aggregationId: aggregation ?? 'P90'
        }
      ];
    default:
      throw Error('Unsupported alert type');
  }
}

function getIcon(alertType: string) {
  switch (alertType) {
    case 'specificJsError':
      return 'lib_website_error';
    case 'statusCode':
      return 'lib_website_ajax';
    case 'throughput':
      return 'lib_website_page_load';
    case 'slowness':
      return 'lib_website_page_load';
    case 'customEvent':
      return 'lib_website_custom';
    default:
      throw Error('Unsupported alert type');
  }
}

function getLinkTitle(alertType: string, metricName: string) {
  switch (alertType) {
    case 'specificJsError':
      return t('in-events:titleAnalyzeJsErrors');
    case 'statusCode':
      return t('in-events:titleAnalyzeHTTPRequests');
    case 'throughput':
      return metricName === 'pageLoads'
        ? t('in-events:titleAnalyzePageLoads')
        : t('in-events:titleAnalyzePageTransitions');
    case 'slowness':
      return t('in-events:titleAnalyzeLoadTime');
    case 'customEvent':
      return t('in-events:titleAnalyzeCustomEvents');
    default:
      throw Error('Unsupported alert type');
  }
}
