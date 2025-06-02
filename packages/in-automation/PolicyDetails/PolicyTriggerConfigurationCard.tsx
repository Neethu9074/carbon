/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import {
  CarbonColumn,
  CarbonFormGroup,
  CarbonGrid,
  CarbonRow,
  CarbonStack,
  CarbonTile,
  Typography
} from '@instana/components';

import {
  isApplicationSmartAlert,
  isEventSpecification,
  isGlobalApplicationSmartAlert,
  isInfraSmartAlert,
  isMobileAppSmartAlert,
  isSloSmartAlert,
  isSyntheticsSmartAlert,
  isWebsiteSmartAlert,
  Triggers,
  TriggerSpecification
} from 'in-automation/types';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import { getSubtitle as getSubtitleInfra } from 'in-alerting/smart-alerts/infrastructure/Alerts';
import { getSubtitle as getSubtitleMobileApp } from 'in-alerting/smart-alerts/mobileApp/Alerts';
import { EventName } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/Events';
import { getSubtitle as getSubtitleWebsite } from 'in-alerting/smart-alerts/websites/Alerts';
import { usePolicyFormContext } from 'in-automation/Policies/usePolicyForm/usePolicyForm';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import { getSubtitle as getSubtitleLog } from 'in-alerting/smart-alerts/logs/Alerts';
import { TriggerTypeField } from 'in-automation/PolicyDetails/TriggerTypeField';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import { Trigger } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-automation/PolicyDetails/PolicyDetails.mless';

const applyOnValues = {
  [SCOPE.ALL]: t('in-automation:policies.allAvailableEntities'),
  [SCOPE.DFQ]: t('in-automation:policies.selectedEntitiesOnly')
};

interface PolicyTriggerConfigurationCardProps {
  data: Trigger;
  triggers: Triggers;
}

export default function PolicyTriggerConfigurationCard({ data, triggers }: PolicyTriggerConfigurationCardProps) {
  const { form } = usePolicyFormContext();
  const automatic = form.getIn(['action', 'type', 'automatic']);
  const selectedTriggerType = triggers[data.type];

  // @ts-ignore
  const selectedTrigger = selectedTriggerType.data?.find(trigger => trigger.id === data.id);
  return (
    <CarbonTile>
      <CarbonStack orientation="horizontal">
        <Typography variant="heading-02">{t('in-automation:policies.triggerConfiguration')}</Typography>
      </CarbonStack>
      <CarbonRow>
        <CarbonGrid fullWidth className={classNames(local.noHorizontalPaddings, local.customMarginY)}>
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:name')}>
              {selectedTrigger && getEventName(selectedTrigger)}
            </CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:description')}>{data?.description}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="100%">
            {selectedTrigger && <TriggerTypeField trigger={selectedTrigger} type={data.type} />}
          </CarbonColumn>
          {automatic.value && <ScopeSection />}
        </CarbonGrid>
      </CarbonRow>
    </CarbonTile>
  );
}

function ScopeSection() {
  const { form } = usePolicyFormContext();
  const scope = form.get('scope');
  const applyOn = scope.get('applyOn');
  const query = scope.get('query');
  return (
    <>
      <CarbonColumn span="100%">
        <CarbonFormGroup legendText={t('in-automation:policies.applyOn')}>
          {applyOn.map(field => applyOnValues[field.value])}
        </CarbonFormGroup>
      </CarbonColumn>
      {applyOn.value === SCOPE.DFQ && (
        <CarbonColumn span="100%">
          <CarbonFormGroup legendText={t('in-automation:policies.dynamicFocusQuery')}>
            {query.map(field => (
              <div className={local.DfqSearchBarWrapper}>
                <DfqSearchBar
                  theme="light"
                  onQueryValueChange={() => {}}
                  disabled
                  queryValue={field.value}
                  manageFiltersDisabled
                />
              </div>
            ))}
          </CarbonFormGroup>
        </CarbonColumn>
      )}
    </>
  );
}

function getEventName(item: TriggerSpecification) {
  if (isWebsiteSmartAlert(item)) {
    return <NameColumnCell config={item} getSubtitle={config => getSubtitleWebsite(config.rule, config.rules)} />;
  }
  if (isApplicationSmartAlert(item)) {
    return <SimpleListNameColumn config={item} />;
  }
  if (isMobileAppSmartAlert(item)) {
    return <NameColumnCell config={item} getSubtitle={config => getSubtitleMobileApp(config.rule, config.threshold)} />;
  }
  if (isGlobalApplicationSmartAlert(item)) {
    return <SimpleListNameColumn config={item} />;
  }
  if (isSyntheticsSmartAlert(item)) {
    return (
      <NameColumnCell
        config={item}
        getSubtitle={() => t('in-alerting:smartAlerts.synthetics.alertList.numberOfFailures')}
        renderName={config => replaceTitlePlaceholdersWithMarkup(config.name)}
      />
    );
  }
  if (isInfraSmartAlert(item)) {
    return (
      <NameColumnCell
        config={item}
        getSubtitle={config => getSubtitleInfra(config.rule, config.threshold, config.forecastingConfig)}
      />
    );
  }
  if (isSloSmartAlert(item)) {
    <NameColumnCell config={item} />;
  }
  if (isEventSpecification(item)) {
    return <EventName hasRowNavigation={false} entity={item} />;
  }
  if (item && item.threshold) {
    return <NameColumnCell config={item} getSubtitle={config => getSubtitleLog(config.threshold!)} />;
  }
  return null;
}
