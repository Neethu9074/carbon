/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Stack } from '@instana/components';
import { just } from '@instana/observables';

import ServicesAndEndpointsListPresenter, {
  ServicesAndEndpointsSearchInput
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import ReadOnlyIncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch';
import ReadOnlyInboundOrAllCalls from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import getAlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/getAlertTitleWithPlaceholderHighlighting';
import useTagBasedApplicationPayloadConfigurator from 'in-alerting/smart-alerts/applications/hooks/useTagBasedApplicationPayloadConfigurator';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ReadOnlyAlertEvaluation from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { getLogMessageRuleOperatorLabel } from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/applications/details/AlertThresholdInfos';
import getEndpointsCursorPaginated from 'in-applications/subscriptions/getEndpointsCursorPaginated';
import getServicesCursorPaginated from 'in-applications/subscriptions/getServicesCursorPaginated';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { alertChannelPerSeverityApplicationSaEnabled } from 'in-services/featureFlags';
import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import getApplication from 'in-applications/subscriptions/getApplication';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { operators } from 'in-analyze/applicationFilter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import ListTitle from 'in-components/lists/Title';
import { success } from 'in-services/util/result';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

const logLevelList = ['ERROR', 'WARN'];
const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig, isGlobalSmartAlert }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const {
    name,
    evaluationType,
    timeThreshold,
    alertChannelIds,
    alertChannels,
    tagFilterExpression,
    applications,
    boundaryScope,
    customPayloadFields,
    rules
  } = alertConfig;
  const ruleWithThreshold = rules[0];
  const {
    rule: { operator, alertType, message, level, aggregation, metricName },
    thresholdOperator,
    thresholds: thresholdsMap
  } = ruleWithThreshold;
  const blueprintConfig = getBlueprintConfig(alertType);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  const TagBasedPayloadConfigurator = useTagBasedApplicationPayloadConfigurator(applications, boundaryScope);
  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.applications.alertConfiguration')} </ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos
          thresholdOperator={thresholdOperator}
          thresholdsMap={thresholdsMap}
          evaluationType={evaluationType}
          rule={{ alertType, aggregation, metricName }}
        />
      </ExpandableLightCard>

      <ChartViewConfiguratorWithEntitySelection
        alertConfigWithFormModel={{
          ...alertConfig,
          tagFilterExpression: tagFilterFormModel
        }}
        onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.label')}
        doNotSetDefaultHeight
        framed
      >
        {(chartViewConfig, applicationId, serviceId, endpointId) => (
          <>
            {alertType === 'logs' && (
              <SelectedAlertTypeInfo
                title={t(
                  'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.logMessageCardTitle'
                )}
                description={getDescription(operator, message)}
                badges={getLogLevelAsList(level)}
              />
            )}
            <ApplicationAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              isAlertDetailView
            />
          </>
        )}
      </ChartViewConfiguratorWithEntitySelection>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.scope.label')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding
        darkFrame
      >
        <div className={locals.evaluationType}>
          <ReadOnlyAlertEvaluation evaluationType={evaluationType} isGlobalSmartAlert={isGlobalSmartAlert} />
        </div>
        <div className={locals.paddingBodyWrapper}>
          <Stack>
            <CallsScopeCard alertConfig={alertConfig} />
            <ServiceEndpointSelectionCard alertConfig={alertConfig} isGlobalSmartAlert={isGlobalSmartAlert} />
            <AdditionalFiltersCard
              tagFilterFormModel={tagFilterFormModel}
              alertType={alertType}
              thresholdType={alertConfig.threshold.type}
            />
          </Stack>
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.label')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <TimeThresholdDescription timeThreshold={timeThreshold} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.alertChannel.label')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer
            alertChannelIds={alertChannelIds}
            alertChannels={alertChannels}
            alertChannelPerSeverityEnabled={alertChannelPerSeverityApplicationSaEnabled}
          />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.applications.details.titleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos
          alertConfig={alertConfig}
          renderCustomTitle={() =>
            getAlertTitleWithPlaceholderHighlighting({ configName: name, evaluationType: evaluationType })
          }
          shouldDisplayAlertLevelSection={false}
        />
      </ExpandableLightCard>
      <GlobalCustomPayloadCard context="APPLICATION" />
      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
        openByDefault
      />
    </AlertDetailsCard>
  );
}

function CallsScopeCard({ alertConfig }) {
  return (
    <LightCard title={t('in-alerting:smartAlerts.applications.details.callsScopeTitle')} framed darkFrame>
      <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
      <ReadOnlyIncludeInternalOrSyntheticCallsSwitch alertConfig={alertConfig} />
    </LightCard>
  );
}

function ServiceEndpointSelectionCard({ alertConfig, isGlobalSmartAlert }) {
  const { applications } = alertConfig;
  const timeConfig = useTimeConfig();
  const [searchQuery, setSearchQuery] = useState(null);

  const moreThanOneSelection = applications && Object.values(applications).length > 1;

  // FIXME In the current read-only mode of this control, when the fake API-subscriptions are passed,
  //       we currently need to hide the entity search, because it turns out that it was broken since at least R234,
  //       and simply never returns any results. The respective dead code should either be fixed, or removed.
  //       Potentially related PR: https://github.ibm.com/instana/ui-client/pull/10139
  const showSearch = false;

  return (
    <ExpandableLightCard
      title={t('in-alerting:smartAlerts.applications.details.applicationsServiceEndpointScopeTitle')}
      header={
        moreThanOneSelection &&
        showSearch && (
          <ServicesAndEndpointsSearchInput
            placeholderText={t(
              'in-alerting:smartAlerts.components.smartAlertDialog.scopeConfigSearchApplicationsPlaceholder'
            )}
            onChange={setSearchQuery}
          />
        )
      }
      headerClassName={locals.lightCardHeader}
      openByDefault
      bodyWithoutPadding
      darkFrame
      framed
    >
      <ServicesAndEndpointsListPresenter
        onChange={noop}
        applicationsSelection={alertConfig.applications}
        boundaryScope={alertConfig.boundaryScope}
        includeInternal={alertConfig.includeInternal}
        includeSynthetic={alertConfig.includeSynthetic}
        timeConfig={timeConfig}
        isGlobalSmartAlert={isGlobalSmartAlert}
        searchQuery={searchQuery}
        showInteractedItemsOnly
        apiSubscriptions={noAppsFetchingApiSubscriptions}
        readOnly
      />
    </ExpandableLightCard>
  );
}

const noAppsFetchingApiSubscriptions = {
  getApplicationsCursorPaginated: () => just(success({ items: [] })),
  getApplication,
  getServicesCursorPaginated,
  getEndpointsCursorPaginated
};

function AdditionalFiltersCard({ tagFilterFormModel, alertType, thresholdType }) {
  const { QueryBuilder } = getQueryBuilderForAlertType(alertType, thresholdType);
  return (
    <>
      {tagFilterFormModel.length > 0 && (
        <LightCard title={t('in-alerting:components.scopeConfigPresenterHelpTextAdditionalFilters')} darkFrame framed>
          <Stack gap="xsmall">
            <QueryBuilder value={tagFilterFormModel} readOnly />
          </Stack>
        </LightCard>
      )}
    </>
  );
}

AlertConfiguration.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  isGlobalSmartAlert: PropTypes.bool
};

function getDescription(operator, message) {
  let description = getLogMessageRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = `${description}: "${message}"`;
  }
  return description;
}

function getLogLevelAsList(level) {
  if (level === 'ANY') {
    return logLevelList;
  }
  return [level];
}
