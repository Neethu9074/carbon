/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { MetricsList, Result, TagFilterExpression } from '@instana/types';
import { Li, ListGroup, Message } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import BreadcrumbAndLabel from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/BreadcrumbAndLabel';
import getMetricsMatchingRegex from 'in-infrastructure/subscriptions/getMetricsMatchingRegex';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';

import locals from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/RegexMetricList.mless';

interface Props {
  tagFilterExpression: TagFilterExpression;
  size: number;
  type: string;
}
interface Regex {
  regex?: string;
}

interface NonEmptyRegex {
  regex: string;
}

export default function RegexMetricList({ regex, ...props }: Props & Regex) {
  if (!regex) {
    return (
      <NoDataAvailable
        height="10rem"
        text={t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricsList.noRegex')}
      />
    );
  }

  return <NonEmptyRegexMetricList regex={regex} {...props} />;
}

function NonEmptyRegexMetricList({ regex, tagFilterExpression, size, type }: Props & NonEmptyRegex) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(getMetricsMatchingRegex({ regex, filter: { timeConfig, tagFilterExpression }, type, size }), [
      regex,
      timeConfig,
      tagFilterExpression,
      type,
      size
    ]) || pendingResult;

  return <ListPresenter result={result} />;
}

function ListPresenter({ result }: { result: Result<MetricsList> }) {
  if (result.progress.loading) {
    return (
      <LoadingIndicator
        text={t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricsList.loading')}
        height={100}
      />
    );
  }

  if (result.errors.length > 0) {
    return (
      <Message type="error" withIcon small>
        {t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricsList.error')}
      </Message>
    );
  }

  if (!result.data?.metrics || result.data.metrics.length === 0) {
    return (
      <NoDataAvailable
        height="10rem"
        text={t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricsList.noResults')}
      />
    );
  }

  return (
    <div className={locals.listContainer}>
      <ListGroup
        label={t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricsList.matches', {
          number: result.data?.totalSize
        })}
      >
        {result.data?.metrics.map(metric => (
          <Li key={metric.ownerType + '/' + metric.id} noBorderTop className={locals.li}>
            <BreadcrumbAndLabel
              className={locals.breadcrumb}
              path={[metric.category ?? getPluginName(metric.ownerType)].filter(Boolean) as string[]}
              label={<span className={locals.metricId}>{metric.id}</span>}
            />
          </Li>
        ))}
        {result.data?.totalSize > result.data?.metrics.length ? (
          <Li noBorderTop className={locals.li}>
            <div className={locals.more}>
              {t('in-custom-dashboards:widgets.srcInfrastructure.regexMetricsList.more', {
                number: result.data?.totalSize - result.data?.metrics.length
              })}
            </div>
          </Li>
        ) : null}
      </ListGroup>
    </div>
  );
}
