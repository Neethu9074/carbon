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
  Link,
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
import {
  useAlertConfig as useApplicationsAlertConfig,
  useLinkToGlobalAlertConfigWithoutAPDashboard
} from 'in-applications/navigation/paths';
import {
  getEntityIdView,
  globalSettingsAlertingEventBuiltIn,
  globalSettingsAlertingEventCustom
} from 'in-settings/navigation/paths';
import { useGetAlertConfigLink as useGetLogAlertConfigLink } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import { useGetAlertConfigLink as useGetServiceLevelAlertConfigLink } from 'in-service-levels/navigation/path';
import { useGetAlertConfigLink as useGetInfraAlertConfigLink } from 'in-infrastructure/navigation/paths';
import { getSubtitle as getSubtitleInfra } from 'in-alerting/smart-alerts/infrastructure/Alerts';
import { getSubtitle as getSubtitleMobileApp } from 'in-alerting/smart-alerts/mobileApp/Alerts';
import { getTriggerType, TriggerTypeField } from 'in-automation/PolicyDetails/TriggerTypeField';
import { EventName } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/Events';
import { getSubtitle as getSubtitleWebsite } from 'in-alerting/smart-alerts/websites/Alerts';
import { useLinkToGlobalAlertConfigWithoutDashboard } from 'in-synthetics/navigation/paths';
import { usePolicyFormContext } from 'in-automation/Policies/usePolicyForm/usePolicyForm';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import { getSubtitle as getSubtitleLog } from 'in-alerting/smart-alerts/logs/Alerts';
import { useGetAlertConfigLink } from 'in-mobile-apps/navigation/paths';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { useAlertConfigLink } from 'in-websites/navigation/paths';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import { Trigger, TriggerType } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-automation/PolicyDetails/PolicyDetails.mless';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

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
              {selectedTrigger && (
                <TriggerLink trigger={selectedTrigger} type={data.type} className={local.triggerName} />
              )}
            </CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:description')}>{data?.description}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:triggerType')}>{getTriggerType(data.type)}</CarbonFormGroup>
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
              <div className={local.DfqSearchBarWrapper} key={1}>
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
    return <NameColumnCell config={item} />;
  }
  if (isEventSpecification(item)) {
    return <EventName hasRowNavigation={false} entity={item} />;
  }
  if (item?.threshold) {
    return <NameColumnCell config={item} getSubtitle={config => getSubtitleLog(config.threshold!)} />;
  }
  return null;
}

interface TriggerLinkProps {
  trigger: TriggerSpecification;
  type: TriggerType;
  className?: string;
}

export function TriggerLink({ trigger, type, className }: TriggerLinkProps) {
  const { id } = trigger;
  let websiteId, applicationId, mobileAppId, created;
  if (type === 'websiteSmartAlert' && 'websiteId' in trigger) {
    websiteId = trigger.websiteId;
  }
  if (type === 'applicationSmartAlert' && 'applicationId' in trigger) {
    applicationId = trigger.applicationId;
  }
  if (type === 'mobileAppSmartAlert' && 'mobileAppId' in trigger) {
    mobileAppId = trigger.mobileAppId;
  }
  if (['infraSmartAlert', 'logSmartAlert', 'sloSmartAlert'].includes(type) && 'created' in trigger) {
    created = trigger.created;
  }

  const getApplicationsAlertConfig = useApplicationsAlertConfig();
  const getLinkToGlobalAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutAPDashboard();
  const mobileAlertConfigLink = useGetAlertConfigLink();
  const websiteAlertConfigLink = useAlertConfigLink(id, websiteId as string);
  const getInfraAlertConfigLink = useGetInfraAlertConfigLink();
  const getLinkToSyntheticAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutDashboard();
  const getLogAlertConfigLink = useGetLogAlertConfigLink();
  const getServiceLevelAlertConfigLink = useGetServiceLevelAlertConfigLink();
  const { createHrefToPath } = useNavigation();

  const fields = {
    applicationSmartAlert: getApplicationsAlertConfig(id, applicationId as string),
    globalApplicationSmartAlert: getLinkToGlobalAlertConfigWithoutAPDashboard(id),
    websiteSmartAlert: websiteAlertConfigLink,
    mobileAppSmartAlert: mobileAlertConfigLink(id, mobileAppId as string),
    infraSmartAlert: getInfraAlertConfigLink(id, created),
    syntheticsSmartAlert: getLinkToSyntheticAlertConfigWithoutAPDashboard(id),
    logSmartAlert: getLogAlertConfigLink(id, created),
    sloSmartAlert: getServiceLevelAlertConfigLink(id, created as number),
    builtinEvent: getEntityIdView(globalSettingsAlertingEventBuiltIn, id, createHrefToPath),
    customEvent: getEntityIdView(globalSettingsAlertingEventCustom, id, createHrefToPath)
  };
  return (
    <Link href={fields[type]} className={className} external>
      {getEventName(trigger)}
    </Link>
  );
}
