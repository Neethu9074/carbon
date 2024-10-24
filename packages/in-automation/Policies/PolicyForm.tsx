/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import {
  Link,
  Spacer,
  Stack,
  Typography,
  IconButton,
  Button,
  TextArea,
  RadioButton,
  Checkbox
} from '@instana/components';
import { Action, TriggerType } from '@instana/types';

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
import { getPolicyFromForm, scopeAll, scopeDfq, ApplyOn, PolicyForm } from 'in-automation/Policies/usePolicyForm';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import useNavigateToPolicyDetails from 'in-automation/navigation/hooks/useNavigateToPolicyDetails';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { descriptionColumn, nameColumn } from 'in-automation/ActionTable/columnDefinitions';
import useNavigateToPolicies from 'in-automation/navigation/hooks/useNavigateToPolicies';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import CreatableTagSelect from 'in-components/CreatableTagSelect/CreatableTagSelect';
import { hasError, isLoading, listSuccess, success } from 'in-services/util/result';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { TriggerSpecification, isPolicy } from 'in-automation/types';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import SectionHeading from 'in-settings/components/SectionHeading';
import { TagsFilter } from 'in-automation/components/tableFilters';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import usePolicyTags from 'in-automation/hooks/usePolicyTags';
import { getTriggerType } from 'in-automation/utils/trigger';
import { EXECUTABLE_ACTIONS } from 'in-automation/constants';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { merge } from 'in-services/util/resultMerger';
import FormGroup from 'in-components/form/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { FetchStatus } from 'in-hooks/utils/types';
import Dialog from 'in-components/Dialog/Dialog';
import { Triggers } from 'in-automation/types';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './Policy.mless';

export function PolicyFormHeader({ isNew, policy }: { isNew: boolean; policy: PolicyFormEntity }) {
  return (
    <HorizontalFlexWrapper className={locals.spaceBetween}>
      <SubViewHeader>
        {isNew
          ? t('in-automation:policies.createANewPolicy')
          : t('in-automation:policies.configurePolicyEntityName', { entityName: policy.name })}
      </SubViewHeader>
      <HorizontalFlexWrapper>
        {isPolicy(policy) && role?.canConfigureAutomationPolicies && <CopyPolicyLink isNew={isNew} policy={policy} />}
      </HorizontalFlexWrapper>
    </HorizontalFlexWrapper>
  );
}

export function PolicyFormBody({
  form,
  setForm,
  actions,
  triggers
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  actions: Action[];
  triggers: Triggers;
}) {
  return (
    <LeftRightPadding>
      <Row>
        <Col lg={8}>
          <SectionHeading>{t('in-automation:policies.1PolicyDetails')}</SectionHeading>
          <DetailsSection form={form} setForm={setForm} />
          <SectionHeading>{t('in-automation:policies.2TriggerConfiguration')}</SectionHeading>
          <SelectTrigger form={form} setForm={setForm} triggers={triggers} />
          <TypeSection form={form} setForm={setForm} />
          <ScopeSection form={form} setForm={setForm} />
          <SectionHeading>{t('in-automation:policies.3ActionConfiguration')}</SectionHeading>
          <SelectAction form={form} setForm={setForm} actions={actions} />
        </Col>
      </Row>
    </LeftRightPadding>
  );
}

export function PolicyFormFooter({
  form,
  submitStatus,
  isNew
}: {
  isNew: boolean;
  submitStatus: FetchStatus | undefined;
  form: PolicyForm;
}) {
  const navigateToPolicies = useNavigateToPolicies();
  return (
    <>
      <Spacer vertical="xlarge" />
      <FormFooter>
        <CancelButton onClick={() => navigateToPolicies()} />
        {role?.canConfigureAutomationPolicies && (
          <SaveButton form={form} isSaving={submitStatus === 'pending'}>
            {submitStatus === 'pending'
              ? t('forms.states.saving')
              : isNew
              ? t('forms.actions.create')
              : t('forms.actions.save')}
          </SaveButton>
        )}
      </FormFooter>
    </>
  );
}

function DetailsSection({
  form,
  setForm
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
}) {
  const name = form.get('name');
  const description = form.get('description');
  const tags = form.get('tags');
  const availableTags = usePolicyTags();

  return (
    <>
      {name.map(field => (
        <FormGroup>
          <Label htmlFor="policy-name" hasError={!field.valid && field.touched}>
            {t('in-automation:name')}
          </Label>
          <Input
            id="policy-name"
            type="text"
            value={field.value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form => form.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true)))
            }
            hasError={!field.valid && field.touched}
            maxLength={256}
            autoFocus
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>
            {t('in-automation:policies.showsUpInTheListOfPolicies')}
          </HelpText>
        </FormGroup>
      ))}
      {description.map(field => (
        <FormGroup>
          <Label htmlFor="policy-description" hasError={!field.valid && field.touched}>
            {t('in-automation:description')}
          </Label>
          <TextArea
            id="policy-description"
            value={field.value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form =>
                form.updateIn(['description'], item =>
                  item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                )
              )
            }
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>
            {t('in-automation:policies.showsUpInThePolicyDescription')}
          </HelpText>
        </FormGroup>
      ))}
      {tags.map(field => (
        <FormGroup>
          <Label htmlFor="policy-tags" hasError={!field.valid && field.touched}>
            {t('in-automation:tagsLabel')}
          </Label>
          <CreatableTagSelect
            id="policy-tags"
            isLoading={isLoading(availableTags)}
            tags={availableTags.data}
            value={field.value}
            onChange={newTags =>
              setForm(form => form.updateIn(['tags'], item => item.setValue(newTags).setTouched(true)))
            }
            disabled={!role?.canConfigureAutomationActions}
          />
        </FormGroup>
      ))}
    </>
  );
}

function ScopeSection({
  form,
  setForm
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
}) {
  const scope = form.get('scope');
  const applyOn = scope.get('applyOn');
  const query = scope.get('query');
  const automatic = form.getIn(['action', 'type', 'automatic']);

  if (!automatic.value) return null;

  return (
    <Row>
      <Col lg={6}>
        <FormGroup>
          {applyOn.map(field => (
            <>
              <Label htmlFor="policy-applyOn" hasError={!field.valid && field.touched}>
                {t('in-automation:policies.applyOn')}
              </Label>
              <ComboBox
                id="policy-applyOn"
                value={field.value}
                isClearable={false}
                disabled={!role?.canConfigureAutomationPolicies}
                onChange={e =>
                  setForm(form =>
                    form.updateIn(['scope', 'applyOn'], item =>
                      item.setValue((e as Option).value as ApplyOn).setTouched(true)
                    )
                  )
                }
                options={[
                  { value: scopeAll, label: t('in-automation:policies.allAvailableEntities') },
                  { value: scopeDfq, label: t('in-automation:policies.selectedEntitiesOnly') }
                ]}
              />
            </>
          ))}
        </FormGroup>
      </Col>
      <Col lg={6}>
        {applyOn.value === scopeDfq &&
          query.map(field => (
            <FormGroup>
              <Label hasError={!scope.valid && field.touched}>{t('in-automation:policies.dynamicFocusQuery')}</Label>
              <DfqSearchBar
                theme="light"
                disabled={!role?.canConfigureAutomationPolicies}
                onQueryValueChange={value => {
                  setForm(form => form.updateIn(['scope', 'query'], item => item.setValue(value).setTouched(true)));
                }}
                queryValue={field.value}
                manageFiltersDisabled
              />
              <DescriptionText>
                <Trans
                  i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesForWhichEntitiesTheRuleWillBeApplied"
                  components={{
                    // @ts-expect-error
                    docLink: <Link size="sm" href="https://ibm.biz/dynamic-focus-syntax" external />
                  }}
                />
              </DescriptionText>
            </FormGroup>
          ))}
      </Col>
    </Row>
  );
}

function TypeSection({
  form,
  setForm
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
}) {
  const type = form.getIn(['action', 'type']);
  return (
    <FormGroup>
      <Label hasError={!type.valid && type.touched}>{t('in-automation:policies.policyType')}</Label>
      <Row>
        <Col lg={3} className={locals.column}>
          <Checkbox
            label={t('in-automation:policies.manual')}
            checked={type.get('manual').value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form =>
                form
                  .updateIn(['action', 'type', 'manual'], item => item.setValue(e.target.checked))
                  .updateIn(['action', 'type'], item => item.setTouched(true))
              )
            }
          />
        </Col>
        <Col lg={3} className={locals.column}>
          <Checkbox
            label={t('in-automation:policies.automatic')}
            checked={type.get('automatic').value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form =>
                form
                  .updateIn(['action', 'type', 'automatic'], item => item.setValue(e.target.checked))
                  .updateIn(['action', 'type'], item => item.setTouched(true))
              )
            }
          />
        </Col>
      </Row>
      <TouchedMessages field={type} className={locals.subErrorTextFormField} />
    </FormGroup>
  );
}

function CopyPolicyLink({ isNew, policy }: { isNew: boolean; policy: PolicyFormEntity }) {
  const navigateToPolicyDetails = useNavigateToPolicyDetails();

  if (isNew || !isPolicy(policy)) return null;

  return (
    <Tooltip content={t('in-automation:duplicate')} delay={500}>
      <Link ellipsis onClick={() => navigateToPolicyDetails(policy.id, true)}>
        <IconButton id={`copy_${policy.id}`} buttonType="button" kind="primaryv2" type="lib_actions_copy" />
      </Link>
    </Tooltip>
  );
}

function SelectTrigger({
  triggers,
  form,
  setForm
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  triggers: Triggers;
}) {
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
  form,
  triggers,
  setForm
}: {
  form: PolicyForm;
  triggers: Triggers;
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
    setSelectedId(item.id);
    setSelectedType(getTriggerType(item));
    setServerTableUrlState({ page: 1, query: '' });
  }

  const columnDefinitions: ColumnDefinition<TriggerSpecification>[] = [
    {
      id: 'select',
      label: '',
      width: 5,
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

function SelectAction({
  actions,
  form,
  setForm
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  actions: Action[];
}) {
  const action = form.get('action');
  const actionId = action.get('actionId');

  const selectedAction = actions.find(action => action.id === actionId.value);
  const result = listSuccess(selectedAction ? [selectedAction] : []);

  const columnDefinitions: ColumnDefinition<Action>[] = [
    nameColumn,
    descriptionColumn,
    tagsColumn as ColumnDefinition<Action>
  ];
  const isExecutableAction = selectedAction ? EXECUTABLE_ACTIONS.includes(selectedAction.type) : false;
  if (isExecutableAction && role?.canConfigureAutomationPolicies) {
    columnDefinitions.push({
      id: 'configure',
      label: '',
      width: 8,
      getContent: item => (
        <Tooltip content={t('in-automation:policies.configure')} delay={500}>
          <IconButton
            onClick={() =>
              addActiveDialog(
                <RunActionDialog
                  handleSave={(params, volatileId) => {
                    setForm(form =>
                      form
                        .updateIn(['action', 'parameters'], item => item.setValue(params).setTouched(true))
                        .updateIn(['action', 'agentId'], item => item.setValue(volatileId.host_id!).setTouched(true))
                    );
                    close();
                  }}
                  policy={getPolicyFromForm(form)}
                  action={item}
                  volatileId={{}}
                />
              )
            }
            buttonType="button"
            kind="primaryv2"
            type="lib_actions_edit"
          />
        </Tooltip>
      )
    });
  }

  return (
    <FormGroup>
      <ServerTablePresenter
        leftHeader={<Label hasError={!action.valid && action.touched}>{t('in-automation:policies.action')}</Label>}
        pageSize={1}
        page={0}
        isSearchable={false}
        noDataMessage={t('in-automation:policies.noActionConfigured')}
        orderBy="id"
        orderDirection="ASC"
        columnDefinitions={columnDefinitions}
        result={result}
        rightHeader={
          role?.canConfigureAutomationPolicies && (
            <Button
              kind="action"
              onClick={() => addActiveDialog(<SelectActionDialog setForm={setForm} actions={actions} form={form} />)}
              icon="lib_openclose_add_circle_outline"
            >
              {t('in-automation:policies.addAction')}
            </Button>
          )
        }
        fixedLayout
      />
      {action.touched && <TouchedMessages field={action} className={locals.subErrorTextFormField} />}
    </FormGroup>
  );
}

function SelectActionDialog({
  actions,
  form,
  setForm
}: {
  actions: Action[];
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
}) {
  const selectedActionId = form.getIn(['action', 'actionId']).value;
  const [selectedId, setSelectedId] = useState(selectedActionId);

  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment: '/action',
    matrixPrefix: '',
    defaultOrderBy: 'name',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;
  const actionTags = [...new Set(actions.flatMap(action => action.tags ?? []))];
  const { filteredActions, types, setTypes, tags, setTags } = useActionFilters({ actions, setServerTableUrlState });
  const result = usePaginatedResult({
    result: success(filteredActions),
    serverTableUrlState,
    setServerTableUrlState,
    searchAttributes: ['name', 'description', 'type', action => action?.tags?.toString() ?? ''],
    sort: [
      entity => selectedId !== entity.id,
      entity => {
        const value = entity[orderBy as keyof Action];
        return typeof value === 'string' ? value.trim().toLowerCase() : value;
      }
    ]
  });

  function handleSubmit() {
    setForm(form => form.updateIn(['action', 'actionId'], item => item.setValue(selectedId).setTouched(true)));
    close();
  }

  function onChange(item: Action) {
    setSelectedId(item.id);
    setServerTableUrlState({ page: 1, query: '' });
  }

  const columnDefinitions: ColumnDefinition<Action>[] = [
    {
      id: 'select',
      label: '',
      width: 5,
      getContent: item => <RadioButton label="" checked={item.id === selectedId} onChange={() => onChange(item)} />
    },
    nameColumn,
    descriptionColumn,
    tagsColumn as ColumnDefinition<Action>
  ];

  return (
    <Dialog className={locals.select} title={t('in-automation:policies.addAction')} onClose={close} withoutBodyPadding>
      <div className={locals.selectDialog}>
        <ServerTablePresenter<Action, ServerTablePresenterProps<Action>>
          searchPlaceholder={t('in-automation:searchActions')}
          onChange={setServerTableUrlState}
          page={page}
          onRowClick={onChange}
          pageSize={pageSize}
          result={result}
          query={query}
          rightHeader={
            <>
              <Stack direction="horizontal">
                <TypeFilter type={types} setType={params => setTypes({ types: params.types })} />
                <TagsFilter availableTags={actionTags} tags={tags} setTags={setTags} />
              </Stack>
              <Spacer horizontal="small" />
            </>
          }
          columnDefinitions={columnDefinitions}
          orderBy={orderBy}
          orderDirection={orderDirection}
          fixedLayout
        />
      </div>
      <Spacer vertical="small" />
      <FormFooter>
        <CancelButton onClick={close} />
        <Button kind="primary" disabled={!selectedId} onClick={handleSubmit}>
          {t('in-automation:policies.addAction')}
        </Button>
      </FormFooter>
    </Dialog>
  );
}

function useActionFilters({
  actions,
  setServerTableUrlState
}: {
  actions: Action[];
  setServerTableUrlState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [types, setTypesState] = useState<string[] | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
    {
      key: 'types' as const,
      value: types
    },
    {
      key: 'tags' as const,
      value: tags
    }
  ];

  const filteredActions = actions.filter(action => {
    // Filter OOTB wastsonx actions
    if (action.metadata?.builtIn && action.metadata?.ai !== null) {
      return false;
    }

    let shouldInclude = true;
    filters.forEach(filter => {
      const nonEmptyFilter = filter.value?.length;
      if (filter.key === 'types' && nonEmptyFilter) {
        shouldInclude = shouldInclude && (filter.value?.some(type => action.type === type) ?? false);
      } else if (filter.key === 'tags' && nonEmptyFilter) {
        shouldInclude = shouldInclude && (action.tags?.some(tag => filter.value.includes(tag)) ?? false);
      }
    });

    return shouldInclude;
  });

  return {
    filteredActions,
    types,
    setTypes: ({ types }: { types: string[] | undefined }) => {
      setTypesState(types);
      setServerTableUrlState({ page: 1, query: '' });
    },
    tags,
    setTags: (tags: string[]) => {
      setTags(tags);
      setServerTableUrlState({ page: 1, query: '' });
    }
  };
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
