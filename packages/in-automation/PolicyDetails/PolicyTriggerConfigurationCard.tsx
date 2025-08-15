/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Repeat } from '@carbon/icons-react';
import classNames from 'classnames';
import React from 'react';
import { RRule } from 'rrule';

import { Column, FormGroup, Grid, Stack, Tile } from '@instana/carbon';
import { Link, Spacer, Typography } from '@instana/components';
import { Trigger, TriggerType } from '@instana/types';

import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import { MetricLabel as InfraMetricLabel } from 'in-alerting/smart-alerts/infrastructure/lists/MetricLabel';
import { getSubtitle as getSubtitleLog } from 'in-alerting/smart-alerts/logs/Alerts';
import { useGetAlertConfigLink as useGetLogAlertConfigLink } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import { getSubtitle as getSubtitleMobileApp } from 'in-alerting/smart-alerts/mobileApp/Alerts';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import { getSubtitle as getSubtitleWebsite } from 'in-alerting/smart-alerts/websites/Alerts';
import {
  useAlertConfig as useApplicationsAlertConfig,
  useLinkToGlobalAlertConfigWithoutAPDashboard
} from 'in-applications/navigation/paths';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import {
  dayIntervalOptions,
  daysOfTheWeekOptions,
  monthOptions,
  ONE_TIME,
  recurrenceOptions
} from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { getTriggerType, TriggerTypeField } from 'in-automation/PolicyDetails/TriggerTypeField';
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
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import { t } from 'in-i18n';
import { useGetAlertConfigLink as useGetInfraAlertConfigLink } from 'in-infrastructure/navigation/paths';
import { useGetAlertConfigLink } from 'in-mobile-apps/navigation/paths';
import { useGetAlertConfigLink as useGetServiceLevelAlertConfigLink } from 'in-service-levels/navigation/path';
import {
  getEntityIdView,
  globalSettingsAlertingEventBuiltIn,
  globalSettingsAlertingEventCustom
} from 'in-settings/navigation/paths';
import { EventName } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/Events';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLinkToGlobalAlertConfigWithoutDashboard } from 'in-synthetics/navigation/paths';
import { useAlertConfigLink } from 'in-websites/navigation/paths';

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
  const isSchedule = data.type === 'schedule';
  return (
    <Tile>
      <Stack orientation="horizontal">
        <Typography variant="heading-02">{t('in-automation:policies.triggerConfiguration')}</Typography>
      </Stack>
      <Grid fullWidth className={classNames(local.clearXMargin, local.customMarginY)}>
        {isSchedule ? <ScheduleDetails /> : <EventDetals data={data} triggers={triggers} />}
      </Grid>
    </Tile>
  );
}

function EventDetals({ data, triggers }: PolicyTriggerConfigurationCardProps) {
  const { form } = usePolicyFormContext();
  const automatic = form.getIn(['action', 'type', 'automatic']);
  const selectedTriggerType = triggers[data.type ?? 'builtinEvent'];
  const selectedTrigger = selectedTriggerType?.data?.find(trigger => trigger.id === data.id);
  return (
    <>
      <Column span="100%">
        <FormGroup legendText={t('in-automation:name')}>
          {selectedTrigger && (
            <TriggerLink trigger={selectedTrigger} type={data.type ?? 'builtinEvent'} className={local.triggerName} />
          )}
        </FormGroup>
      </Column>
      <Column span="100%">
        <FormGroup legendText={t('in-automation:description')}>{data?.description}</FormGroup>
      </Column>
      <Column span="100%">
        <FormGroup legendText={t('in-automation:triggerType')}>{getTriggerType(data.type ?? 'builtinEvent')}</FormGroup>
      </Column>
      <Column span="100%">
        {selectedTrigger && <TriggerTypeField trigger={selectedTrigger} type={data.type ?? 'builtinEvent'} />}
      </Column>
      {automatic.value && <ScopeSection />}
    </>
  );
}

function ScheduleDetails() {
  const { form } = usePolicyFormContext();
  const scheduleField = form.get('schedule');
  const frequeny = scheduleField.get('frequency').value;
  const frequencyLabel = recurrenceOptions.find(option => option.value === frequeny)?.label;
  const startTime = scheduleField.getIn(['start', 'time']).value;
  const interval = frequeny === ONE_TIME ? '' : scheduleField.getIn(['recurrence', 'interval']).value;
  const daysOfTheWeek = scheduleField.getIn(['recurrence', 'daysOfTheWeek']).value;
  const daysOfTheWeekLabel = daysOfTheWeek
    .toSorted()
    .map(item => daysOfTheWeekOptions.find(option => option.value === item)?.label)
    .join(', ');
  const repeatType = scheduleField.getIn(['recurrence', 'repeatType']).value;
  const dayInterval = scheduleField.getIn(['recurrence', 'dayInterval']).value;
  const dayIntervalLabel = dayIntervalOptions.find(option => option.value === dayInterval)?.label;
  const daysOfTheWeekField = scheduleField.getIn(['recurrence', 'daysOfTheWeek']);
  const [dayOfTheWeek] = daysOfTheWeekField.value;
  const dayOfTheWeekLabel = daysOfTheWeekOptions.find(option => option.value === dayOfTheWeek)?.label;
  const dateField = scheduleField.getIn(['recurrence', 'date']).value;
  const month = scheduleField.getIn(['recurrence', 'month']).value;
  const monthLabel = monthOptions.find(option => option.value === month)?.label;

  return (
    <>
      <Column span="50%">
        <FormGroup legendText={t('in-automation:triggerType')}>{t('in-automation:policies.schedule')}</FormGroup>
      </Column>
      <Column span="25%">
        <FormGroup legendText={t('in-automation:policyCreateTearsheet.startTime')}>{startTime}</FormGroup>
      </Column>
      <Column span="25%">
        <FormGroup legendText={t('in-automation:policyCreateTearsheet.repeat')}>{frequencyLabel}</FormGroup>
      </Column>
      {frequeny === RRule.DAILY && (
        <Column span="25%">
          <FormGroup legendText={t('in-automation:policyCreateTearsheet.repeatEvery')}>
            {interval} {t('in-automation:policyCreateTearsheet.intervalDropdown.days')}
          </FormGroup>
        </Column>
      )}
      {frequeny === RRule.WEEKLY && (
        <>
          <Column span="25%">
            <FormGroup legendText={t('in-automation:policyCreateTearsheet.repeatEvery')}>
              {interval} {t('in-automation:policyCreateTearsheet.intervalDropdown.weeks')}
            </FormGroup>
          </Column>
          <Column span="25%">
            <FormGroup legendText={t('in-automation:policyCreateTearsheet.days')}>{daysOfTheWeekLabel}</FormGroup>
          </Column>
        </>
      )}
      {frequeny === RRule.MONTHLY && repeatType === 'day' && (
        <Column span="50%">
          <FormGroup legendText={t('in-automation:policyCreateTearsheet.repeatEvery')}>
            {dayIntervalLabel} {dayOfTheWeekLabel} {t('in-automation:policyCreateTearsheet.ofTheMonth')}
          </FormGroup>
        </Column>
      )}
      {frequeny === RRule.YEARLY && repeatType === 'day' && (
        <Column span="50%">
          <FormGroup legendText={t('in-automation:policyCreateTearsheet.repeatEvery')}>
            {dayIntervalLabel} {dayOfTheWeekLabel} of {monthLabel}
          </FormGroup>
        </Column>
      )}
      {frequeny === RRule.YEARLY && repeatType === 'date' && (
        <>
          <Column span="25%">
            <FormGroup legendText={t('in-automation:policyCreateTearsheet.month')}>{monthLabel}</FormGroup>
          </Column>
          <Column span="25%">
            <FormGroup legendText={t('in-automation:policyCreateTearsheet.day')}>{dateField || 0}</FormGroup>
          </Column>
        </>
      )}
      {frequeny === RRule.MONTHLY && repeatType === 'date' && (
        <Column span="25%">
          <FormGroup legendText={t('in-automation:policyCreateTearsheet.date')}>{dateField || 0}</FormGroup>
        </Column>
      )}
      {frequeny !== ONE_TIME && (
        <>
          <Spacer vertical="small" />
          <Column span="50%">
            <RecurrenceSection />
          </Column>
        </>
      )}
    </>
  );
}

function RecurrenceSection() {
  const { form } = usePolicyFormContext();
  const repeatUntilField = form.getIn(['schedule', 'recurrence', 'repeatUntil']);

  return (
    <>
      <Stack orientation="horizontal">
        <Repeat />
        <Typography variant="heading-01">{t('in-automation:policyCreateTearsheet.recurrenceOptions')}</Typography>
      </Stack>
      <Grid>
        <Column span="25%">
          <RepeatUntilSection />
        </Column>
        {repeatUntilField.value === 'date' && (
          <Column span="25%">
            <EndDateSection />
          </Column>
        )}
        {repeatUntilField.value === 'occurrences' && (
          <Column span="25%">
            <OccurrencesSection />
          </Column>
        )}
      </Grid>
    </>
  );
}

function RepeatUntilSection() {
  const { form } = usePolicyFormContext();
  const repeatUntil = form.getIn(['schedule', 'recurrence', 'repeatUntil']).value;
  return <FormGroup legendText={t('in-automation:policyCreateTearsheet.repeatUntil')}>{repeatUntil}</FormGroup>;
}

function EndDateSection() {
  const { form } = usePolicyFormContext();
  const endDateField = form.getIn(['schedule', 'recurrence', 'endDate']).value;

  return <FormGroup legendText={t('in-automation:policyCreateTearsheet.endDate')}>{endDateField}</FormGroup>;
}

function OccurrencesSection() {
  const { form } = usePolicyFormContext();
  const occurrencesField = form.getIn(['schedule', 'recurrence', 'occurrences']).value;

  return <FormGroup legendText={t('in-automation:policyCreateTearsheet.occurrences')}>{occurrencesField}</FormGroup>;
}

function ScopeSection() {
  const { form } = usePolicyFormContext();
  const scope = form.get('scope');
  const applyOn = scope.get('applyOn');
  const query = scope.get('query');
  return (
    <>
      <Column span="100%">
        <FormGroup legendText={t('in-automation:policies.applyOn')}>
          {applyOn.map(field => applyOnValues[field.value])}
        </FormGroup>
      </Column>
      {applyOn.value === SCOPE.DFQ && (
        <Column span="100%">
          <FormGroup legendText={t('in-automation:policies.dynamicFocusQuery')}>
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
          </FormGroup>
        </Column>
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
        getSubtitle={config => (
          <InfraMetricLabel
            rule={config.rule}
            threshold={config.threshold}
            forecastingConfig={config.forecastingConfig}
          />
        )}
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
  if (type === 'schedule') return <></>;
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
