/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Spacer, Stack, Typography, Button, RadioButton } from '@instana/components';
import { TriggerType } from '@instana/types';

import {
  appFilterAppliedColumn,
  entityTypeColumn,
  infraFilterAppliedColumn,
  logsFilterAppliedColumn,
  mobileAppFilterAppliedColumn,
  sloFilterAppliedColumn,
  syntheticFilterAppliedColumn,
  triggerDescriptionColumn,
  triggerNameColumn,
  websiteFilterAppliedColumn
} from 'in-automation/components/Triggers/columnDefinitions';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { usePolicyFormContext } from 'in-automation/Policies/usePolicyForm/usePolicyForm';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { PolicyForm } from 'in-automation/Policies/usePolicyForm/types';
import { hasError, listSuccess } from 'in-services/util/result';
import { getTriggerType } from 'in-automation/utils/trigger';
import { TriggerSpecification } from 'in-automation/types';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { merge } from 'in-services/util/resultMerger';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label/Label';
import Dialog from 'in-components/Dialog/Dialog';
import { Triggers } from 'in-automation/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Policy.mless';

export default function SelectTrigger({ triggers }: { triggers: Triggers }) {
  const { form, setForm } = usePolicyFormContext();

  const triggerId = form.get('triggerId');
  const triggerType = form.get('triggerType');
  const selectedTriggerType = triggers[triggerType.value];
  // @ts-expect-error
  const selectedTrigger = selectedTriggerType.data?.find(trigger => trigger.id === triggerId.value);

  const result = hasError(selectedTriggerType)
    ? {
        data: { items: [] },
        errors: selectedTriggerType.errors,
        progress: {
          loading: false
        }
      }
    : listSuccess(selectedTrigger ? [selectedTrigger] : []);
  const columnDefinitions: ColumnDefinition<TriggerSpecification>[] = [triggerNameColumn, triggerDescriptionColumn];

  if (triggerType.value === 'applicationSmartAlert' || triggerType.value === 'globalApplicationSmartAlert')
    columnDefinitions.push(appFilterAppliedColumn);
  if (triggerType.value === 'websiteSmartAlert') columnDefinitions.push(websiteFilterAppliedColumn);
  if (triggerType.value === 'mobileAppSmartAlert') columnDefinitions.push(mobileAppFilterAppliedColumn);
  if (triggerType.value === 'infraSmartAlert') columnDefinitions.push(infraFilterAppliedColumn);
  if (triggerType.value === 'syntheticsSmartAlert') columnDefinitions.push(syntheticFilterAppliedColumn);
  if (triggerType.value === 'logSmartAlert') columnDefinitions.push(logsFilterAppliedColumn);
  if (triggerType.value === 'sloSmartAlert') columnDefinitions.push(sloFilterAppliedColumn);
  if (triggerType.value === 'builtinEvent' || triggerType.value === 'customEvent')
    columnDefinitions.push(entityTypeColumn);

  return triggerId.map(field => (
    <FormGroup>
      <ServerTablePresenter
        pageSize={1}
        page={0}
        isSearchable={false}
        orderBy="id"
        noDataMessage={t('in-automation:policies.noEventTriggerConfigured')}
        orderDirection="ASC"
        columnDefinitions={columnDefinitions}
        // @ts-expect-error
        result={result}
        leftHeader={
          <Label hasError={!triggerId.valid && triggerId.touched}>{t('in-automation:policies.eventTrigger')}</Label>
        }
        rightHeader={
          role?.canConfigureAutomationPolicies && (
            <Button
              kind="action"
              onClick={() => addActiveDialog(<SelectTriggerDialog form={form} setForm={setForm} triggers={triggers} />)}
              icon="lib_openclose_add_circle_outline"
            >
              {t('in-automation:policies.addEventTrigger')}
            </Button>
          )
        }
        fixedLayout
      />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
    </FormGroup>
  ));
}

function SelectTriggerDialog({
  triggers,
  form,
  setForm
}: {
  triggers: Triggers;
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
}) {
  const selectedTriggerId = form.get('triggerId').value;
  const selectedTriggerType = form.get('triggerType').value;
  const [selectedId, setSelectedId] = useState(selectedTriggerId);
  const [selectedType, setSelectedType] = useState(selectedTriggerType);

  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment: '/trigger',
    matrixPrefix: '',
    defaultOrderBy: 'name',
    defaultPageSize: 5
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const { selectedTab, eventType, setEventType, setSelectedTab, filteredTriggers } = useTriggerFilters({
    triggers,
    selectedTriggerType,
    setServerTableUrlState
  });
  const result = usePaginatedResult<TriggerSpecification>({
    result: filteredTriggers,
    serverTableUrlState,
    setServerTableUrlState,
    searchAttributes: ['name', 'description'],
    sort: [
      entity => selectedId !== entity.id,
      entity => {
        const value = entity[orderBy as keyof TriggerSpecification];
        return typeof value === 'string' ? value.trim().toLowerCase() : value;
      }
    ]
  });

  function handleSubmit() {
    setForm(form =>
      form
        .updateIn(['triggerId'], item => item.setValue(selectedId).setTouched(true))
        .updateIn(['triggerType'], item => item.setValue(selectedType).setTouched(true))
    );
    close();
  }

  function onChange(item: TriggerSpecification) {
    const selectedTriggerType = selectedTab === 'event' ? getTriggerType(item) : selectedTab;
    setSelectedId(item.id);
    setSelectedType(selectedTriggerType);
    setServerTableUrlState({ page: 1, query: '' });
  }

  const columnDefinitions: ColumnDefinition<TriggerSpecification>[] = [
    {
      id: 'select',
      label: '',
      width: 50,
      getContent: item => <RadioButton label="" checked={item.id === selectedId} onChange={() => onChange(item)} />
    },
    triggerNameColumn,
    triggerDescriptionColumn
  ];

  if (selectedTab === 'applicationSmartAlert' || selectedTab === 'globalApplicationSmartAlert')
    columnDefinitions.push(appFilterAppliedColumn);
  if (selectedTab === 'websiteSmartAlert') columnDefinitions.push(websiteFilterAppliedColumn);
  if (selectedTab === 'mobileAppSmartAlert') columnDefinitions.push(mobileAppFilterAppliedColumn);
  if (selectedTab === 'infraSmartAlert') columnDefinitions.push(infraFilterAppliedColumn);
  if (selectedTab === 'syntheticsSmartAlert') columnDefinitions.push(syntheticFilterAppliedColumn);
  if (selectedTab === 'logSmartAlert') columnDefinitions.push(logsFilterAppliedColumn);
  if (selectedTab === 'sloSmartAlert') columnDefinitions.push(sloFilterAppliedColumn);
  if (selectedTab === 'event') columnDefinitions.push(entityTypeColumn);

  const table = (
    <ServerTablePresenter<TriggerSpecification, ServerTablePresenterProps<TriggerSpecification>>
      searchPlaceholder={t('in-automation:policies.searchEventTriggers')}
      searchWidth={170}
      searchMaxWidth={170}
      onChange={setServerTableUrlState}
      onRowClick={onChange}
      page={page}
      pageSize={pageSize}
      result={result}
      query={query}
      rightHeader={selectedTab === 'event' && <TriggerFilters eventType={eventType} setEventType={setEventType} />}
      columnDefinitions={columnDefinitions}
      orderBy={orderBy}
      orderDirection={orderDirection}
      fixedLayout
    />
  );
  return (
    <Dialog
      className={locals.select}
      title={t('in-automation:policies.addEventTrigger')}
      onClose={close}
      withoutBodyPadding
    >
      <div className={locals.selectDialog}>
        <TabSelect menuWidth="20%" panelsWidth="80%" activePanelId={selectedTab} onChange={setSelectedTab}>
          <TabSelectHeader>
            <Typography variant="heading-200" noWrap>
              {t('in-automation:policies.selectEventTrigger')}
            </Typography>
          </TabSelectHeader>
          <TabSelectMenu>
            <TabSelectItem forId="event" withRadioButton>
              {t('in-automation:policies.event')}
            </TabSelectItem>
            <TabSelectItem forId="globalApplicationSmartAlert" withRadioButton>
              {t('in-automation:policies.globalApplicationSmartAlert')}
            </TabSelectItem>
            <TabSelectItem forId="applicationSmartAlert" withRadioButton>
              {t('in-automation:policies.applicationSmartAlert')}
            </TabSelectItem>
            <TabSelectItem forId="websiteSmartAlert" withRadioButton>
              {t('in-automation:policies.websiteSmartAlert')}
            </TabSelectItem>
            <TabSelectItem forId="mobileAppSmartAlert" withRadioButton>
              {t('in-automation:policies.mobileAppSmartAlert')}
            </TabSelectItem>
            <TabSelectItem forId="infraSmartAlert" withRadioButton>
              {t('in-automation:policies.infraSmartAlert')}
            </TabSelectItem>
            <TabSelectItem forId="syntheticsSmartAlert" withRadioButton>
              {t('in-automation:policies.syntheticsSmartAlert')}
            </TabSelectItem>
            <TabSelectItem forId="logSmartAlert" withRadioButton>
              {t('in-automation:policies.logSmartAlert')}
            </TabSelectItem>
            <TabSelectItem forId="sloSmartAlert" withRadioButton>
              {t('in-automation:policies.sloSmartAlert')}
            </TabSelectItem>
          </TabSelectMenu>
          <TabSelectPanels>
            <TabSelectPanel id="event">{table}</TabSelectPanel>
            <TabSelectPanel id="applicationSmartAlert">{table}</TabSelectPanel>
            <TabSelectPanel id="websiteSmartAlert">{table}</TabSelectPanel>
            <TabSelectPanel id="globalApplicationSmartAlert">{table}</TabSelectPanel>
            <TabSelectPanel id="infraSmartAlert">{table}</TabSelectPanel>
            <TabSelectPanel id="mobileAppSmartAlert">{table}</TabSelectPanel>
            <TabSelectPanel id="syntheticsSmartAlert">{table}</TabSelectPanel>
            <TabSelectPanel id="logSmartAlert">{table}</TabSelectPanel>
            <TabSelectPanel id="sloSmartAlert">{table}</TabSelectPanel>
          </TabSelectPanels>
        </TabSelect>
      </div>

      <FormFooter>
        <CancelButton onClick={close} />
        <Button kind="primary" disabled={!selectedId} onClick={handleSubmit}>
          {t('in-automation:policies.addEventTrigger')}
        </Button>
      </FormFooter>
    </Dialog>
  );
}

const typeOptions = [
  { value: 'builtinEvent', label: t('in-automation:policies.builtIn') },
  { value: 'customEvent', label: t('in-automation:policies.custom') }
] as const;

function TriggerFilters({
  eventType,
  setEventType
}: {
  eventType: EventType;
  setEventType: React.Dispatch<React.SetStateAction<EventType>>;
}) {
  return (
    <>
      <Stack direction="horizontal">
        <ComboBox
          options={typeOptions}
          placeholder={t('in-automation:type')}
          value={eventType}
          onChange={newValue => {
            if (!newValue) {
              setEventType(null);
            } else {
              // @ts-expect-error
              setEventType(newValue.value);
            }
          }}
        />
      </Stack>
      <Spacer horizontal="small" />
    </>
  );
}

type TriggerTab =
  | 'event'
  | 'applicationSmartAlert'
  | 'globalApplicationSmartAlert'
  | 'websiteSmartAlert'
  | 'infraSmartAlert'
  | 'mobileAppSmartAlert'
  | 'syntheticsSmartAlert'
  | 'logSmartAlert'
  | 'sloSmartAlert';
type EventType = 'customEvent' | 'builtinEvent' | null;

function useTriggerFilters({
  triggers,
  selectedTriggerType,
  setServerTableUrlState
}: {
  triggers: Triggers;
  selectedTriggerType: TriggerType;
  setServerTableUrlState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [selectedTab, setSelectedTab] = useState<TriggerTab>(
    selectedTriggerType === 'builtinEvent' || selectedTriggerType === 'customEvent' ? 'event' : selectedTriggerType
  );
  const [eventType, setEventType] = useState<EventType>(null);
  const filteredTriggers =
    selectedTab === 'event'
      ? eventType === null
        ? merge([triggers.builtinEvent, triggers.customEvent], data => [...data[0], ...data[1]])
        : eventType === 'builtinEvent'
        ? triggers.builtinEvent
        : triggers.customEvent
      : triggers[selectedTab];

  return {
    selectedTab,
    eventType,
    setEventType: (eventType: React.SetStateAction<EventType>) => {
      setEventType(eventType);
      setServerTableUrlState({ page: 1, query: '' });
    },
    setSelectedTab: (tab: React.SetStateAction<TriggerTab>) => {
      setSelectedTab(tab);
      setServerTableUrlState({ page: 1, query: '' });
    },
    filteredTriggers
  };
}
