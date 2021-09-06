/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Stack } from '@instana/components';

import ServicesAndEndpointsListPresenter, {
  ServicesAndEndpointsSearchInput
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import ReadOnlyIncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch';
import ReadOnlyInboundOrAllCalls from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import AlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/AlertTitleWithPlacholderHighlighting';
import ReadOnlyAlertEvaluation from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/smart-alert-dialog/TimeThresholdDescription';
import { getLogMessageRuleOperatorLabel } from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import AlertQueryBuilder from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import CustomPayloadCard from 'in-alerting/smart-alerts/applications/details/CustomPayloadCard';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { operators } from 'in-analyze/applicationFilter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import ListTitle from 'in-components/lists/Title';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/AlertConfiguration.mless';

const logLevelList = ['ERROR', 'WARN'];
const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig, isGlobalSmartAlert }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);

  const {
    rule: { operator, alertType, message, level },
    evaluationType,
    timeThreshold,
    alertChannelIds,
    tagFilterExpression,
    customPayloadFields
  } = alertConfig;

  const blueprintConfig = getBlueprintConfig(alertType);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.applications.alertConfiguration')} </ListTitle>

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
            <AdditionalFiltersCard tagFilterFormModel={tagFilterFormModel} />
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
          <AlertChannelsViewer alertChannelIds={alertChannelIds} />
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
          renderCustomTitle={() => <AlertTitleWithPlaceholderHighlighting configName={alertConfig.name} />}
        />
      </ExpandableLightCard>
      <CustomPayloadCard customPayloadFields={customPayloadFields} />
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
  const timeConfig = useTimeConfig();
  const [searchQuery, setSearchQuery] = useState(null);

  return (
    <LightCard
      title={t('in-alerting:smartAlerts.applications.details.applicationsServiceEndpointScopeTitle')}
      header={<ServicesAndEndpointsSearchInput onChange={setSearchQuery} />}
      headerClassName={locals.lightCardHeader}
      withoutPadding
      darkFrame
      framed
    >
      <ServicesAndEndpointsListPresenter
        onChange={noop}
        applicationsSelection={alertConfig.applications}
        boundaryScope={alertConfig.boundaryScope}
        includeSynthetic={alertConfig.includeSynthetic}
        timeConfig={timeConfig}
        isGlobalSmartAlert={isGlobalSmartAlert}
        searchQuery={searchQuery}
        showInteractedItemsOnly
        readOnly
      />
    </LightCard>
  );
}

function AdditionalFiltersCard({ tagFilterFormModel }) {
  return (
    <>
      {tagFilterFormModel.length > 0 && (
        <LightCard title={t('in-alerting:components.scopeConfigPresenterHelpTextAdditionalFilters')} darkFrame framed>
          <Stack gap="xsmall">
            <AlertQueryBuilder value={tagFilterFormModel} readOnly />
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
