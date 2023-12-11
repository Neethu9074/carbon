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
import { descriptionColumn, nameColumn, tagsColumn, typeColumn } from 'in-automation/ActionCatalog/ActionTable';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { EventName } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import ComboBox, { Option, hasMultipleValuesSelected } from 'in-components/ComboBox/ComboBox';
import useNavigateToPolicyDetails from 'in-automation/Policies/useNavigateToPolicyDetails';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { isAnsible, isScript, isWebhook } from 'in-automation/ActionCatalog/shared';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import useNavigateToPolicies from 'in-automation/Policies/useNavigateToPolicies';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import usePaginatedResult from 'in-automation/Policies/usePaginatedResult';
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
import { Action, Policy } from 'in-types';
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
          <SectionHeading>{t('in-automation:policies.2PolicyConfiguration')}</SectionHeading>
          <SelectTrigger form={form} setForm={setForm} triggers={triggers} />
          <ScopeSection form={form} setForm={setForm} />
          <SourceSection form={form} setForm={setForm} />
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
      {!isNew && (
        <HorizontalFlexWrapper>{isPolicy(policy) && <CopyPolicyLink policy={policy} />}</HorizontalFlexWrapper>
      )}
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
        <SaveButton form={form} isSaving={submitStatus === 'pending'}>
          {submitStatus === 'pending'
            ? t('forms.states.saving')
            : isNew
            ? t('forms.actions.create')
            : t('forms.actions.save')}
        </SaveButton>
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

function SourceSection({
  form,
  setForm
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
}) {
  const type = form.getIn(['action', 'type']);
  return (
    <FormGroup>
      <Label hasError={!type.valid && type.touched}>{t('in-automation:policies.source')}</Label>
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
        <TouchedMessages field={type} className={locals.subErrorTextFormField} />
      </Row>
    </FormGroup>
  );
}

function CopyPolicyLink({ policy }: { policy: Policy }) {
  const navigateToPolicyDetails = useNavigateToPolicyDetails();
  return (
    <Tooltip content={t('in-automation:duplicate')} delay={500}>
      <Link ellipsis onClick={() => navigateToPolicyDetails(policy, true)}>
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
  setForm: React.Dispatch<React.SetStateAction<PolicyForm | null>>;
  triggers: Triggers;
}) {
  const triggerId = form.get('triggerId');
  const triggerType = form.get('triggerType');
  // This is fixed in TS 5.2 - array methods on union of arrays
  // @ts-expect-error
  const selectedTrigger = triggers[triggerType.value].find(trigger => trigger.id === triggerId.value);

  return triggerId.map(field => (
    <FormGroup>
      <ServerTablePresenter
        pageSize={1}
        page={0}
        isSearchable={false}
        orderBy="id"
        noDataMessage={t('in-automation:policies.noTriggerConfigured')}
        orderDirection="ASC"
        columnDefinitions={[
          {
            id: 'name',
            label: t('in-automation:name'),
            getContent: (item: TriggerSpecification) => {
              if (isEventSpecification(item)) {
                return <EventName hasRowNavigation={false} entity={item} />;
              }
              return <SimpleListNameColumn config={item} />;
            },
            width: 23
          },
          {
            id: 'description',
            label: t('in-automation:description'),
            getContent: (item: TriggerSpecification) => (
              <Typography variant="body-regular">{item.description}</Typography>
            ),
            width: 23
          }
        ]}
        result={listSuccess(selectedTrigger ? [selectedTrigger] : [])}
        leftHeader={
          <Label hasError={!triggerId.valid && triggerId.touched}>{t('in-automation:policies.trigger')}</Label>
        }
        rightHeader={
          <Button
            kind="action"
            onClick={() => addActiveDialog(<SelectTriggerDialog form={form} setForm={setForm} triggers={triggers} />)}
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-automation:policies.addTrigger')}
          </Button>
        }
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
  const result = usePaginatedResult<TriggerSpecification>(
    success(triggers[selectedType]),
    { page, pageSize, orderBy, orderDirection, query },
    ['name', 'description']
  );
  function handleSubmit() {
    setForm(form =>
      form!
        .updateIn(['triggerId'], item => item.setValue(selectedId!).setTouched(true))
        .updateIn(['triggerType'], item => item.setValue(selectedType).setTouched(true))
    );
    close();
  }
  const table = (
    <ServerTablePresenter
      searchPlaceholder={t('in-automation:policies.searchTriggers')}
      onChange={setServerTableState}
      page={page}
      pageSize={pageSize}
      result={result}
      query={query}
      columnDefinitions={[
        {
          id: 'select',
          label: '',
          width: 5,
          getContent: (item: TriggerSpecification) => (
            <CheckboxFancy
              label=""
              asRadioButton
              checked={item.id === selectedId}
              onChange={() => setSelectedId(item.id)}
            />
          )
        },
        {
          id: 'name',
          label: t('in-automation:name'),
          getContent: (item: TriggerSpecification) => {
            if (isEventSpecification(item)) {
              return <EventName hasRowNavigation={false} entity={item} />;
            }
            return <SimpleListNameColumn config={item} />;
          },
          width: 23
        },
        {
          id: 'description',
          label: t('in-automation:description'),
          getContent: (item: TriggerSpecification) => (
            <Typography variant="body-regular">{item.description}</Typography>
          ),
          width: 23
        }
      ]}
      orderBy={orderBy}
      orderDirection={orderDirection}
    />
  );
  return (
    <Dialog className={locals.select} title={t('in-automation:policies.addTrigger')} onClose={close} withoutBodyPadding>
      <div className={locals.selectDialog}>
        <TabSelect
          activePanelId={selectedType}
          onChange={id => {
            setSelectedType(id);
            setServerTableState({ page: 1, query: '' });
          }}
        >
          <TabSelectHeader>
            <Typography variant="heading-200" noWrap>
              {t('in-automation:policies.selectTrigger')}
            </Typography>
          </TabSelectHeader>
          <TabSelectMenu>
            <TabSelectItem forId="builtinEvent" withRadioButton>
              {t('in-automation:policies.builtInEvent')}
            </TabSelectItem>
            <TabSelectItem forId="customEvent" withRadioButton>
              {t('in-automation:policies.customEvent')}
            </TabSelectItem>
            <TabSelectItem forId="applicationSmartAlert" withRadioButton>
              {t('in-automation:policies.applicationSmartAlert')}
            </TabSelectItem>
          </TabSelectMenu>
          <TabSelectPanels>
            <TabSelectPanel id="builtinEvent">{table}</TabSelectPanel>
            <TabSelectPanel id="customEvent">{table}</TabSelectPanel>
            <TabSelectPanel id="applicationSmartAlert">{table}</TabSelectPanel>
          </TabSelectPanels>
        </TabSelect>
      </div>

      <FormFooter>
        <CancelButton onClick={close} />
        <Button kind="primary" disabled={!selectedId} onClick={handleSubmit}>
          {t('in-automation:policies.addTrigger')}
        </Button>
      </FormFooter>
    </Dialog>
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

  const executableAction =
    isScript(selectedAction?.type) || isWebhook(selectedAction?.type) || isAnsible(selectedAction?.type);

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
        columnDefinitions={[
          nameColumn(false),
          descriptionColumn,
          typeColumn,
          tagsColumn,
          ...(executableAction
            ? [
                {
                  id: 'configure',
                  label: '',
                  width: 5,
                  getContent: (item: Action) => (
                    <Tooltip content={t('in-automation:policies.configure')} delay={500}>
                      <IconButton
                        onClick={() =>
                          addActiveDialog(
                            <RunActionDialog
                              handleSave={(params, volatileId) => {
                                setForm(form =>
                                  form!
                                    .updateIn(['action', 'parameters'], item => item.setValue(params).setTouched(true))
                                    .updateIn(['action', 'agentId'], item =>
                                      item.setValue(volatileId.host_id!).setTouched(true)
                                    )
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
                }
              ]
            : [])
        ]}
        result={listSuccess(selectedAction ? [selectedAction] : [])}
        rightHeader={
          <Button
            kind="action"
            onClick={() => addActiveDialog(<SelectActionDialog setForm={setForm} actions={actions} form={form} />)}
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-automation:policies.addAction')}
          </Button>
        }
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
  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = usePagination();
  const actionTags = [...new Set(actions.flatMap(action => action.tags ?? []))];
  const { filteredActions, types, setTypes, tags, setTags } = useFilters(actions, setServerTableState);
  const result = usePaginatedResult(success(filteredActions), { page, pageSize, orderBy, orderDirection, query }, [
    'name',
    'description',
    'type',
    action => action?.tags?.toString() ?? ''
  ]);
  const [selectedId, setSelectedId] = useState(selectedActionId);
  function handleSubmit() {
    setForm(form => form!.updateIn(['action', 'actionId'], item => item.setValue(selectedId).setTouched(true)));
    close();
  }
  return (
    <Dialog className={locals.select} title={t('in-automation:policies.addAction')} onClose={close} withoutBodyPadding>
      <div className={locals.selectDialog}>
        <ServerTablePresenter
          searchPlaceholder={t('in-automation:searchActions')}
          onChange={setServerTableState}
          page={page}
          pageSize={pageSize}
          result={result}
          query={query}
          rightHeader={
            <ActionFilters types={types} actionTags={actionTags} setTypes={setTypes} tags={tags} setTags={setTags} />
          }
          columnDefinitions={[
            {
              id: 'select',
              label: '',
              width: 5,
              getContent: (item: Action) => (
                <CheckboxFancy
                  label=""
                  asRadioButton
                  checked={item.id === selectedId}
                  onChange={() => setSelectedId(item.id)}
                />
              )
            },
            nameColumn(false),
            descriptionColumn,
            typeColumn,
            tagsColumn
          ]}
          orderBy={orderBy}
          orderDirection={orderDirection}
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

function useFilters(
  actions: Action[],
  setServerTableState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void
) {
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
