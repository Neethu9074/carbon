/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, CarbonMenuItem, SvgIcon } from '@instana/components';
import { AggregationType } from '@instana/types';

import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { fromBackendModel, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { websitesAlertingEventDetailsGoToAnalyze } from 'in-alerting/smart-alerts/websites/tracker';
import { WebsiteSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
// @ts-expect-error Missing exact typings
import { defaultGroupings } from 'in-websites/tags';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLinkToAnalyze } from 'in-websites/navigation/paths';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { FixedTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

interface AnalyzeWebsiteEventButtonProps {
  alertConfig: WebsiteSmartAlertConfig;
  websiteName: string;
  timeConfig: FixedTimeConfig;
  adaptiveBaselineInfo?: Record<string, number>;
  as?: 'button' | 'menuItem';
}

export default function AnalyzeWebsiteEventButton({
  alertConfig,
  websiteName,
  timeConfig,
  adaptiveBaselineInfo,
  as = 'button'
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
    chartedMetrics: getChartedMetrics(alertType, aggregation, metricName),
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
  const { navigate } = useNavigation();

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        label={getLinkTitle(alertType, metricName)}
        renderIcon={() => <SvgIcon size="xs" type={getIcon(alertType, metricName)} />}
        onClick={() => {
          websitesAlertingEventDetailsGoToAnalyze({ beaconType });
          navigate(parseUrl(linkToUAWithoutParams, true));
        }}
        style={{ outline: '10px red' }}
      />
    );
  }

  return (
    <Button
      kind="primary"
      icon={getIcon(alertType, metricName)}
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

function getChartedMetrics(alertType: string, aggregation: AggregationType | undefined, metricName: string) {
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
          metricId: metricName === 'httpLatency' ? 'beaconDuration' : 'onLoadTime',
          aggregationId: aggregation ?? 'P90'
        }
      ];
    default:
      throw Error('Unsupported alert type');
  }
}

function getIcon(alertType: string, metricName: string) {
  switch (alertType) {
    case 'specificJsError':
      return 'lib_website_error';
    case 'statusCode':
      return 'lib_website_ajax';
    case 'throughput':
      return 'lib_website_page_load';
    case 'slowness':
      return metricName === 'httpLatency' ? 'lib_website_ajax' : 'lib_website_page_load';
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
      return metricName === 'httpLatency'
        ? t('in-events:titleAnalyzeHTTPRequests')
        : t('in-events:titleAnalyzeLoadTime');
    case 'customEvent':
      return t('in-events:titleAnalyzeCustomEvents');
    default:
      throw Error('Unsupported alert type');
  }
}
