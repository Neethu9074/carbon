/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ApplicationBoundaryScope, TagFilterExpression, TimeConfig } from '@instana/types';
import { CarbonComboButton, CarbonMenuItem, SvgIcon } from '@instana/components';

import { getValueMatchTagFilter, DOCKER_ID, CONTAINERD_ID, GARDEN_ID, CRIO_ID } from 'in-logging/queryBuilder';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import { CONTAINS, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

const errorMessagesButtonLabel = t('in-events:RCA.analyzeErrors');
const traceLogsButtonLabel = t('in-events:RCA.analyzeTraceLogs');
const applicationLogsButtonLabel = t('in-events:RCA.analyzeApplicationLogs');

const errorMessagesGroupByTagName = 'call.error.message';
const traceLogsGroupByTagName = 'log.message';

type PluginTypes = 'docker' | 'containerd' | 'crio' | 'garden' | 'host';

const pluginToTagMap = {
  docker: DOCKER_ID,
  containerd: CONTAINERD_ID,
  crio: CRIO_ID,
  garden: GARDEN_ID,
  host: 'host.name'
};

function getTagNameByPlugin(plugin: string, processContainerType: string) {
  const key = (plugin === 'process' ? processContainerType : plugin) as PluginTypes;
  if (key in pluginToTagMap) {
    return pluginToTagMap[key];
  }
  return undefined;
}

interface RootCauseLogsComboButtonProps {
  query: any;
  boundaryScope: ApplicationBoundaryScope;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  rcaEntityType: string;
  processId: string;
  containerId: string;
  processContainerType: string;
  hostName: string;
  plugin: string;
  includeInternal: boolean;
  includeSynthetic: boolean;
  isErrorMessagesTable: boolean;
  timeConfig?: TimeConfig;
}

export default function RootCauseLogsComboButton({
  query,
  boundaryScope,
  applicationName,
  serviceName,
  endpointName,
  rcaEntityType,
  processId,
  containerId,
  processContainerType,
  hostName,
  plugin,
  includeInternal,
  includeSynthetic,
  isErrorMessagesTable,
  timeConfig
}: RootCauseLogsComboButtonProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const { navigate } = useNavigation();

  const hiddenCalls = includeInternal || includeSynthetic ? { includeInternal, includeSynthetic } : null;
  const orderByGroups = { by: 'erroneousCalls_SUM' };
  const chartedMetrics = [createChartedMetric('erroneousCalls', 'SUM')];
  const fields = [createMetricField('erroneousCalls', 'SUM')];
  const applicationLogsButtonDisabled = rcaEntityType == 'infrastructure' ? false : true;
  const errorMessagesGroupBy = { groupbyTag: errorMessagesGroupByTagName };
  const traceLogsGroupBy = { groupbyTag: traceLogsGroupByTagName };

  const entityTagFilter = getTagFilterExpressionByPlugin(
    plugin,
    containerId,
    processId,
    processContainerType,
    hostName
  );

  let applicationLogsFormModel: TagFilterExpression | FormModelElement[] = [];
  let errorMessagesFormModel: FormModelElement | FormModelElement[] = [];
  let traceLogsFormModel: FormModelElement | FormModelElement[] = [];

  applicationLogsFormModel = joinExpressions({ expressions: [entityTagFilter !== undefined ? [entityTagFilter] : []] });

  if (query.length > 0) {
    errorMessagesFormModel = joinExpressions({
      expressions: [
        errorMessagesFormModel,
        tagFilter(errorMessagesGroupByTagName, CONTAINS, query),
        tagFilter('call.erroneous', EQUALS, true)
      ]
    });
    traceLogsFormModel = joinExpressions({
      expressions: [traceLogsFormModel, tagFilter(traceLogsGroupByTagName, CONTAINS, query)]
    });
  }

  const errorMessagesHref = getLinkToApplicationAnalyze({
    applicationName,
    serviceName,
    endpointName,
    dataSource: 'calls',
    groupBy: errorMessagesGroupBy,
    boundaryScope,
    formModel: errorMessagesFormModel,
    //@ts-ignore
    orderByGroups,
    chartedMetrics,
    fields,
    hiddenCalls,
    timeConfig
  });

  const traceLogsHref = getLinkToApplicationAnalyze({
    applicationName,
    serviceName,
    endpointName,
    dataSource: 'calls',
    groupBy: traceLogsGroupBy,
    boundaryScope,
    formModel: traceLogsFormModel,
    //@ts-ignore
    orderByGroups,
    chartedMetrics,
    fields,
    hiddenCalls,
    timeConfig
  });

  const logsHref = useLinkToLogs({
    tagFilterExpression: applicationLogsFormModel,
    timeConfig: timeConfig
  });

  return isErrorMessagesTable ? (
    <CarbonComboButton
      label={t('in-events:RCA.analyzeErrors')}
      size="sm"
      onClick={() => navigate(parseUrl(errorMessagesHref, true))}
    >
      {renderButton(traceLogsHref, traceLogsButtonLabel, navigate)}
      {renderButton(logsHref, applicationLogsButtonLabel, navigate, applicationLogsButtonDisabled)}
    </CarbonComboButton>
  ) : (
    <CarbonComboButton
      label={t('in-events:RCA.analyzeTraceLogs')}
      size="sm"
      onClick={() => navigate(parseUrl(traceLogsHref, true))}
    >
      {renderButton(errorMessagesHref, errorMessagesButtonLabel, navigate)}
      {renderButton(logsHref, applicationLogsButtonLabel, navigate, applicationLogsButtonDisabled)}
    </CarbonComboButton>
  );
}

function renderButton(
  href: string,
  label: string,
  navigate: (target: Location, replace?: boolean | undefined) => void,
  disableButton?: boolean
) {
  const icon = label === applicationLogsButtonLabel ? 'lib_analyze' : 'lib_application_call';
  return (
    <CarbonMenuItem
      label={label}
      disabled={disableButton}
      onClick={() => navigate(parseUrl(href, true))}
      renderIcon={() => <SvgIcon size="xs" type={icon} />}
    />
  );
}

function getTagFilterExpressionByPlugin(
  plugin: string,
  containerId: string,
  processId: string,
  processContainerType: string,
  hostName: string
) {
  const tagName = getTagNameByPlugin(plugin, processContainerType);

  if (tagName === undefined) {
    return undefined;
  }

  if (containerId !== undefined) {
    const tagFilter = getValueMatchTagFilter({
      name: tagName,
      value: containerId
    });
    return tagFilter;
  } else if (plugin === 'process' && processId !== undefined) {
    const tagFilter = getValueMatchTagFilter({
      name: tagName,
      value: processId
    });
    return tagFilter;
  } else if (plugin === 'host') {
    const tagFilter = getValueMatchTagFilter({
      name: tagName,
      value: hostName
    });
    return tagFilter;
  }
  return undefined;
}
