/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Button, Link, Spacer, Stack, Typography } from '@instana/components';

import {
  ApplyOn,
  PolicyForm,
  PolicyFormEntity,
  TriggerSpecification,
  Triggers,
  getTriggerType,
  isEventSpecification,
  isPolicy,
  scopeAll,
  scopeDfq
} from 'in-automation/Policies/types';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
// @ts-expect-error
import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { descriptionColumn, nameColumn, tagsColumn, typeColumn } from 'in-automation/ActionCatalog/ActionTable';
import { isAnsible, isScript, isWebhook, isGithub, isGitlab, isJira } from 'in-automation/ActionCatalog/shared';
import EvaluationTypeColumn from 'in-alerting/smart-alerts/applications/list/columns/EvaluationTypeColumn';
import { Action, ApplicationAlertConfigWithMetadata, EventSpecificationInfo, TriggerType } from 'in-types';
import { EntityType, EventName } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import ComboBox, { Option, hasMultipleValuesSelected } from 'in-components/ComboBox/ComboBox';
import useNavigateToPolicyDetails from 'in-automation/Policies/useNavigateToPolicyDetails';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import useNavigateToPolicies from 'in-automation/Policies/useNavigateToPolicies';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import usePaginatedResult from 'in-automation/Policies/usePaginatedResult';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { getPolicyFromForm } from 'in-automation/Policies/usePolicyForm';
import { usePagination } from 'in-automation/Policies/usePagination';
import SectionHeading from 'in-settings/components/SectionHeading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { listSuccess, success } from 'in-services/util/result';
import TagsTable from 'in-automation/ActionCatalog/TagsTable';
import IconButton from 'in-components/IconButton/IconButton';
import HelpText from 'in-components/form/HelpText/HelpText';
import TextArea from 'in-components/form/TextArea/TextArea';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { FetchStatus } from 'in-hooks/utils/types';
import Dialog from 'in-components/Dialog/Dialog';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './Policy.mless';

export function PolicyFormBody({
  form,
  setForm,
  actions,
  triggers
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
  actions: Action[];
  triggers: Triggers;
}) {
  return (
    <fieldset>
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
    </fieldset>
  );
}

export function PolicyFormHeader({ isNew, policy }: { isNew: boolean; policy: PolicyFormEntity }) {
  return (
    <HorizontalFlexWrapper className={locals.spaceBetween}>
      <SubViewHeader>
        {isNew
          ? t('in-automation:policies.createANewPolicy')
          : t('in-automation:policies.configurePolicyEntityName', { entityName: policy.name })}
      </SubViewHeader>
      <HorizontalFlexWrapper>
        {role?.canConfigureAutomationPolicies && <CopyPolicyLink isNew={isNew} policy={policy} />}
      </HorizontalFlexWrapper>
    </HorizontalFlexWrapper>
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
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
}) {
  const name = form.get('name');
  const description = form.get('description');

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
            onChange={e =>
              setForm(form => form!.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true)))
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
            onChange={e =>
              setForm(form =>
                form!.updateIn(['description'], item =>
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
      <FormGroup>
        <TagsTable
          form={form}
          setForm={setForm}
          onChange={(fieldName, value) =>
            //@ts-expect-error
            setForm(form => form!.updateIn([fieldName], item => item.setValue(value).setTouched(true)))
          }
        />
      </FormGroup>
    </>
  );
}

function ScopeSection({
  form,
  setForm
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
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
                onChange={e =>
                  setForm(form =>
                    form!.updateIn(['scope', 'applyOn'], item =>
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
                onQueryValueChange={value => {
                  setForm(form => form!.updateIn(['scope', 'query'], item => item.setValue(value).setTouched(true)));
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
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
}) {
  const type = form.getIn(['action', 'type']);
  return (
    <FormGroup>
      <Label hasError={!type.valid && type.touched}>{t('in-automation:policies.policyType')}</Label>
      <Row>
        <Col lg={3} className={locals.column}>
          <CheckboxFancy
            label={t('in-automation:policies.manual')}
            checked={type.get('manual').value}
            onChange={e =>
              setForm(form =>
                form!
                  .updateIn(['action', 'type', 'manual'], item => item.setValue(e.target.checked))
                  .updateIn(['action', 'type'], item => item.setTouched(true))
              )
            }
          />
        </Col>
        <Col lg={3} className={locals.column}>
          <CheckboxFancy
            label={t('in-automation:policies.automatic')}
            checked={type.get('automatic').value}
            onChange={e =>
              setForm(form =>
                form!
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
      <Link ellipsis onClick={() => navigateToPolicyDetails(policy, true)}>
        <IconButton id={`copy_${policy.id}`} buttonType="button" kind="primaryv2" type="lib_actions_copy" />
      </Link>
    </Tooltip>
  );
}

const triggerNameColumn: ColumnDefinition<TriggerSpecification> = {
  id: 'name',
  label: t('in-automation:name'),
  getContent: item => {
    if (isEventSpecification(item)) {
      return <EventName hasRowNavigation={false} entity={item} />;
    }
    return <SimpleListNameColumn config={item} />;
  },
  width: 23
};

const triggerDescriptionColumn: ColumnDefinition<TriggerSpecification> = {
  id: 'description',
  label: t('in-automation:description'),
  getContent: item => (
    <FourLineWrapper>
      <Typography variant="body-regular">{item.description}</Typography>
    </FourLineWrapper>
  ),
  width: 23
};

const evalutationTypeColumn: ColumnDefinition<ApplicationAlertConfigWithMetadata> = {
  id: 'properties',
  label: t('in-automation:policies.properties'),
  getContent: item => <EvaluationTypeColumn config={item} isGlobalSmartAlertConfig={false} />,
  width: 23
};

const entityTypeColumn: ColumnDefinition<EventSpecificationInfo> = {
  id: 'entityType',
  label: t('in-automation:policies.entityType'),
  getContent: item => <EntityType entity={item} />,
  width: 23
};

function SelectTrigger({
  triggers,
  form,
  setForm
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
  triggers: Triggers;
}) {
  const triggerId = form.get('triggerId');
  const triggerType = form.get('triggerType');
  // This is fixed in TS 5.2 - array methods on union of arrays
  // @ts-expect-error
  const selectedTrigger = triggers[triggerType.value].find(trigger => trigger.id === triggerId.value);

  const columnDefinitions: ColumnDefinition<TriggerSpecification>[] = [
    triggerNameColumn,
    triggerDescriptionColumn,
    triggerType.value === 'applicationSmartAlert' ? evalutationTypeColumn : entityTypeColumn
  ];

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
        result={listSuccess(selectedTrigger ? [selectedTrigger] : [])}
        leftHeader={
          <Label hasError={!triggerId.valid && triggerId.touched}>{t('in-automation:policies.eventTrigger')}</Label>
        }
        rightHeader={
          <Button
            kind="action"
            onClick={() => addActiveDialog(<SelectTriggerDialog form={form} setForm={setForm} triggers={triggers} />)}
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-automation:policies.addEventTrigger')}
          </Button>
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
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
}) {
  const selectedTriggerId = form.get('triggerId').value;
  const selectedTriggerType = form.get('triggerType').value;
  const [selectedId, setSelectedId] = useState(selectedTriggerId);
  const [selectedType, setSelectedType] = useState(selectedTriggerType);

  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = usePagination();
  const { selectedTab, eventType, setEventType, setSelectedTab, filteredTriggers } = useTriggerFilters({
    triggers,
    selectedTriggerType,
    setServerTableState
  });
  const result = usePaginatedResult<TriggerSpecification>(
    success(filteredTriggers),
    { page, pageSize, orderBy, orderDirection, query },
    ['name', 'description'],
    [
      entity => selectedId !== entity.id,
      entity => {
        const value = entity[orderBy as keyof TriggerSpecification];
        return typeof value === 'string' ? value.trim().toLowerCase() : value;
      }
    ]
  );

  function handleSubmit() {
    setForm(form =>
      form!
        .updateIn(['triggerId'], item => item.setValue(selectedId).setTouched(true))
        .updateIn(['triggerType'], item => item.setValue(selectedType).setTouched(true))
    );
    close();
  }

  function onChange(item: TriggerSpecification) {
    setSelectedId(item.id);
    setSelectedType(getTriggerType(item));
    setServerTableState({ page: 1, query: '' });
  }

  const columnDefinitions: ColumnDefinition<TriggerSpecification>[] = [
    {
      id: 'select',
      label: '',
      width: 5,
      getContent: item => (
        <CheckboxFancy label="" asRadioButton checked={item.id === selectedId} onChange={() => onChange(item)} />
      )
    },
    triggerNameColumn,
    triggerDescriptionColumn,
    selectedTab === 'applicationSmartAlert' ? evalutationTypeColumn : entityTypeColumn
  ];

  const table = (
    <ServerTablePresenter<TriggerSpecification, ServerTablePresenterProps<TriggerSpecification>>
      searchPlaceholder={t('in-automation:policies.searchEventTriggers')}
      searchWidth={170}
      searchMaxWidth={170}
      onChange={setServerTableState}
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
        <TabSelect activePanelId={selectedTab} onChange={setSelectedTab}>
          <TabSelectHeader>
            <Typography variant="heading-200" noWrap>
              {t('in-automation:policies.selectEventTrigger')}
            </Typography>
          </TabSelectHeader>
          <TabSelectMenu>
            <TabSelectItem forId="event" withRadioButton>
              {t('in-automation:policies.event')}
            </TabSelectItem>
            <TabSelectItem forId="applicationSmartAlert" withRadioButton>
              {t('in-automation:policies.applicationSmartAlert')}
            </TabSelectItem>
          </TabSelectMenu>
          <TabSelectPanels>
            <TabSelectPanel id="event">{table}</TabSelectPanel>
            <TabSelectPanel id="applicationSmartAlert">{table}</TabSelectPanel>
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
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
  actions: Action[];
}) {
  const action = form.get('action');
  const actionId = action.get('actionId');

  const selectedAction = actions.find(action => action.id === actionId.value);
  const result = listSuccess(selectedAction ? [selectedAction] : []);

  const columnDefinitions: ColumnDefinition<Action>[] = [nameColumn(false), descriptionColumn, typeColumn, tagsColumn];
  const executableAction =
    isScript(selectedAction?.type) ||
    isWebhook(selectedAction?.type) ||
    isAnsible(selectedAction?.type) ||
    isGithub(selectedAction?.type) ||
    isGitlab(selectedAction?.type) ||
    isJira(selectedAction?.type);
  if (executableAction) {
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
                      form!
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
          <Button
            kind="action"
            onClick={() => addActiveDialog(<SelectActionDialog setForm={setForm} actions={actions} form={form} />)}
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-automation:policies.addAction')}
          </Button>
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
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
}) {
  const selectedActionId = form.getIn(['action', 'actionId']).value;
  const [selectedId, setSelectedId] = useState(selectedActionId);

  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = usePagination();
  const actionTags = [...new Set(actions.flatMap(action => action.tags ?? []))];
  const { filteredActions, types, setTypes, tags, setTags } = useActionFilters({ actions, setServerTableState });
  const result = usePaginatedResult(
    success(filteredActions),
    { page, pageSize, orderBy, orderDirection, query },
    ['name', 'description', 'type', action => action?.tags?.toString() ?? ''],
    [
      entity => selectedId !== entity.id,
      entity => {
        const value = entity[orderBy as keyof Action];
        return typeof value === 'string' ? value.trim().toLowerCase() : value;
      }
    ]
  );

  function handleSubmit() {
    setForm(form => form!.updateIn(['action', 'actionId'], item => item.setValue(selectedId).setTouched(true)));
    close();
  }

  function onChange(item: Action) {
    setSelectedId(item.id);
    setServerTableState({ page: 1, query: '' });
  }

  const columnDefinitions: ColumnDefinition<Action>[] = [
    {
      id: 'select',
      label: '',
      width: 5,
      getContent: item => (
        <CheckboxFancy label="" asRadioButton checked={item.id === selectedId} onChange={() => onChange(item)} />
      )
    },
    nameColumn(false),
    descriptionColumn,
    typeColumn,
    tagsColumn
  ];

  return (
    <Dialog className={locals.select} title={t('in-automation:policies.addAction')} onClose={close} withoutBodyPadding>
      <div className={locals.selectDialog}>
        <ServerTablePresenter<Action, ServerTablePresenterProps<Action>>
          searchPlaceholder={t('in-automation:searchActions')}
          onChange={setServerTableState}
          page={page}
          onRowClick={onChange}
          pageSize={pageSize}
          result={result}
          query={query}
          rightHeader={
            <ActionFilters types={types} actionTags={actionTags} setTypes={setTypes} tags={tags} setTags={setTags} />
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

const options = [
  { value: 'doc_link', label: t('in-automation:ActionCatalog.docLink') },
  { value: 'SCRIPT', label: t('in-automation:ActionCatalog.script') },
  { value: 'HTTP', label: t('in-automation:ActionCatalog.http') },
  { value: 'MANUAL', label: t('in-automation:ActionCatalog.manual') },
  { value: 'ANSIBLE', label: t('in-automation:ActionCatalog.ansible') }
];

function ActionFilters({
  types,
  tags,
  actionTags,
  setTags,
  setTypes
}: {
  types: string[];
  actionTags: string[];
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setTypes: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <>
      <Stack direction="horizontal">
        <ComboBox
          options={options}
          placeholder={t('in-automation:type')}
          value={types}
          onChange={newValue => {
            if (!newValue) {
              setTypes([]);
            } else if (hasMultipleValuesSelected(newValue)) {
              setTypes(newValue.map(o => o.value));
            } else {
              setTypes([newValue.value]);
            }
          }}
        />
        <ComboBox
          options={actionTags.map(tag => ({ value: tag, label: tag }))}
          placeholder={t('in-automation:tags')}
          value={tags}
          onChange={newValue => {
            if (!newValue) {
              setTags([]);
            } else if (hasMultipleValuesSelected(newValue)) {
              setTags(newValue.map(o => o.value));
            } else {
              setTags([newValue.value]);
            }
          }}
        />
      </Stack>
      <Spacer horizontal="small" />
    </>
  );
}

function useActionFilters({
  actions,
  setServerTableState
}: {
  actions: Action[];
  setServerTableState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [types, setTypes] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
    {
      key: 'type' as const,
      value: types
    },
    {
      key: 'tags' as const,
      value: tags
    }
  ];
  const filteredActions = actions.filter(action => {
    let shouldInclude = true;
    filters.forEach(filter => {
      const nonEmptyFilter = filter.value.length > 0;
      if (filter.key === 'type' && nonEmptyFilter) {
        shouldInclude = shouldInclude && filter.value.includes(action.type);
      } else if (filter.key === 'tags' && nonEmptyFilter) {
        shouldInclude = shouldInclude && (action.tags?.some(tag => filter.value.includes(tag)) ?? false);
      }
    });
    return shouldInclude;
  });
  return {
    filteredActions,
    types,
    setTypes: (types: React.SetStateAction<string[]>) => {
      setTypes(types);
      setServerTableState({ page: 1, query: '' });
    },
    tags,
    setTags: (tags: React.SetStateAction<string[]>) => {
      setTags(tags);
      setServerTableState({ page: 1, query: '' });
    }
  };
}

type TriggerTab = 'event' | 'applicationSmartAlert';
type EventType = 'customEvent' | 'builtinEvent' | null;

function useTriggerFilters({
  triggers,
  selectedTriggerType,
  setServerTableState
}: {
  triggers: Triggers;
  selectedTriggerType: TriggerType;
  setServerTableState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [selectedTab, setSelectedTab] = useState<TriggerTab>(
    selectedTriggerType === 'builtinEvent' || selectedTriggerType === 'customEvent' ? 'event' : 'applicationSmartAlert'
  );
  const [eventType, setEventType] = useState<EventType>(null);
  const filteredTriggers =
    selectedTab === 'applicationSmartAlert'
      ? triggers['applicationSmartAlert']
      : eventType === null
      ? [...triggers.builtinEvent, ...triggers.customEvent]
      : eventType === 'builtinEvent'
      ? triggers.builtinEvent
      : triggers.customEvent;

  return {
    selectedTab,
    eventType,
    setEventType: (eventType: React.SetStateAction<EventType>) => {
      setEventType(eventType);
      setServerTableState({ page: 1, query: '' });
    },
    setSelectedTab: (tab: React.SetStateAction<TriggerTab>) => {
      setSelectedTab(tab);
      setServerTableState({ page: 1, query: '' });
    },
    filteredTriggers
  };
}
