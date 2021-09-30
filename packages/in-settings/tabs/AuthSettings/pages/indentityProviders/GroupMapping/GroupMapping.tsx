/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  createMapForm,
  createField,
  createListForm,
  MapForm,
  Field,
  ListForm,
  Item,
  MapFormItems,
  ValidationResult,
  ValidationMessage
} from 'formalistic';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import {
  refresh,
  getMappings,
  setMappings,
  getIdp,
  setIdp,
  IdpGroupMapping,
  IdentityProviderPatch
} from 'in-settings/tabs/AuthSettings/api/groupMappings';
// @ts-expect-error
import { getConfigAsResultObservable as oidcConfig } from 'in-settings/tabs/AuthSettings/api/oidc';
// @ts-expect-error
import { getConfigAsResultObservable as ldapConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
// @ts-expect-error
import { getConfigAsResultObservable as samlConfig } from 'in-settings/tabs/AuthSettings/api/saml';
// @ts-expect-error
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
// @ts-expect-error
import { getGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
// @ts-expect-error
import SubViewHeader from 'in-settings/components/SubViewHeader';
// @ts-expect-error
import ApiItemView from 'in-settings/components/ApiItemView';
// @ts-expect-error
import CheckboxFancy from 'in-components/form/CheckboxFancy';
// @ts-expect-error
import FormGroup from 'in-components/form/FormGroup';
// @ts-expect-error
import Select from 'in-components/form/Select';
import { notBlankValidator } from 'in-services/validators/string';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { defaultRoleId } from 'in-stores/user';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './GroupMapping.mless';

interface InstanaGroup {
  id: string;
  name: string;
}

type Updater = (f: Item) => Item;

const DENY_ACCESS = 'denyAccess';
const GROUP_MAPPINGS = 'groupMappings';
const INSTANA_GROUPS = 'instanaGroups';
const GROUP_ID = 'groupId';

export default function GroupMapping() {
  return (
    <ApiItemView
      getObservables={() => ({
        mappings: getMappings(),
        instanaGroups: getGroupsAsResultObservable(),
        denyCheck: getIdp(),
        samlConfig: samlConfig(),
        ldapConfig: ldapConfig(),
        oidcConfig: oidcConfig()
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      saveItem={saveItem}
      render={render}
    />
  );
}

function render({ form, setForm }: { form: MapForm; setForm: (newForm: MapForm) => void }): JSX.Element {
  if (!(form.get('hasIdp') as Field<boolean>)?.value) {
    return (
      <>
        <Title title={t('in-settings:tabs.configureGroupMapping')} />
        <SubViewHeader>{t('in-settings:tabs.groupMapping')}</SubViewHeader>
        {t('in-settings:tabs.failIfNoIdp')}
      </>
    );
  }

  let instanaGroups: InstanaGroup[] = [];
  if (form.get(INSTANA_GROUPS)) {
    const groupsField: Field<InstanaGroup[]> = form.get(INSTANA_GROUPS) as Field<InstanaGroup[]>;
    instanaGroups = groupsField.value;
  }

  let denyAccess = false;
  if (form.get(DENY_ACCESS)) {
    const denyAccessField: Field<boolean> = form.get(DENY_ACCESS) as Field<boolean>;
    denyAccess = denyAccessField.value;
  }

  const shouldShowDenyIssue = internalCheckThereIsAtLeastOneGroupMappingIfDenyIsChecked(
    form.get(GROUP_MAPPINGS) as ListForm,
    form.get(DENY_ACCESS) as Field<boolean>
  );

  return (
    <>
      <Title title={t('in-settings:tabs.configureGroupMapping')} />
      <SubViewHeader>{t('in-settings:tabs.groupMapping')}</SubViewHeader>
      <CheckboxFancy
        label={t('in-settings:tabs.denyUserWithNoGroup')}
        checked={denyAccess}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setForm(
            form
              .updateIn([DENY_ACCESS], () =>
                createField({
                  value: e.target.checked
                })
              )
              .setTouched(true)
          );
        }}
      />
      {shouldShowDenyIssue && shouldShowDenyIssue.length > 0 && (
        <ValidationBlock className="">{shouldShowDenyIssue[0].message}</ValidationBlock>
      )}
      <ServerTablePresenter
        isSearchable={false}
        columnDefinitions={[
          keyColumnDefinition,
          valueColumnDefinition,
          instanaGroupColumnDefinition(instanaGroups),
          deleteRowColumnDefinition
        ]}
        noDataMessage={t('in-settings:tabs.noGroupMapping')}
        orderBy="label"
        orderDirection="ASC"
        rightHeader={<RightHeader addRow={addRow} />}
        getRowIndex={getRowIndex}
        deleteRow={deleteRow}
        updateIn={updateIn}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items: form.get(GROUP_MAPPINGS) ?? []
          }
        }}
      />
    </>
  );

  function addRow() {
    setForm(
      form.updateIn(
        [GROUP_MAPPINGS],
        (f: Item): Item =>
          (f as ListForm).push(newEntry({ id: null, key: '', value: '', groupId: defaultRoleId })).setTouched(true)
      )
    );
  }

  function deleteRow(payloadField: MapForm) {
    const entryPosition = getRowIndex(payloadField);

    if (entryPosition >= 0) {
      setForm(form.updateIn([GROUP_MAPPINGS], (f: Item) => (f as ListForm).remove(entryPosition).setTouched(true)));
    }
  }

  function getRowIndex(payloadField: Item): number {
    if (form.get(GROUP_MAPPINGS)) {
      const groupMappings: ListForm = form.get(GROUP_MAPPINGS) as ListForm;
      return groupMappings.reduce((acc: number, item: Item, i: number) => (item === payloadField ? i : acc), -1);
    }
    return -1;
  }

  function updateIn(path: string[], updater: Updater) {
    setForm(form.updateIn([GROUP_MAPPINGS, ...path], (f: Item) => updater(f).setTouched(true)));
  }
}

type OnChangeInput = (path: string[], doThis: (f: Item) => Field<string>) => void;

function FormInputField(item: MapForm, itemKey: string, onChange: OnChangeInput): JSX.Element {
  let inputValue: string = '';
  if (item.get(itemKey)) {
    const inputValueField: Field<string> = item.get(itemKey) as Field<string>;
    inputValue = inputValueField.value;
  }

  return (
    <FormGroup withoutBottomMargin>
      <Input
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange([itemKey], (f: Item) => (f as Field<string>).setValue(e.target.value).setTouched(true));
        }}
      />
    </FormGroup>
  );
}

function InstanaGroupPick(groups: InstanaGroup[], selectedGroupId: string, onChange: OnChangeInput): JSX.Element {
  return (
    <div className={locals.instanaGroup}>
      <Select
        value={selectedGroupId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange([GROUP_ID], (f: Item) => (f as Field<string>).setValue(e.target.value).setTouched(true));
        }}
      >
        {groups &&
          groups.map((g: InstanaGroup) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
      </Select>
    </div>
  );
}

function DeleteMapping(item: MapForm, deleteRow: (toBeDeleted: MapForm) => void): JSX.Element {
  return (
    <div>
      <Tooltip content={t('in-settings:tabs.deleteGroupMapping')}>
        <SvgIcon className={locals.delete} type="lib_actions_delete" onClick={() => deleteRow(item)} />
      </Tooltip>
    </div>
  );
}

function onChangeFunctionFor(
  updateIn: (path: string[], updater: Updater) => void,
  getRowIndex: (payloadField: Item) => number,
  item: Item
): OnChangeInput {
  return (paths: any[], updaterFromColDefinition: Updater) =>
    updateIn([getRowIndex(item), ...paths], updaterFromColDefinition);
}

type EditableContent = (
  item: MapForm,
  helpers: {
    getRowIndex: (payloadField: Item) => number;
    updateIn: (path: string[], updater: (item: Item) => Item) => void;
  }
) => JSX.Element;

const keyColumnDefinition = {
  id: 'key',
  sortable: false,
  label: t('in-settings:tabs.groupMappingKey'),
  getContent: ((item: MapForm, { getRowIndex, updateIn }) => {
    const onChange = onChangeFunctionFor(updateIn, getRowIndex, item);
    return FormInputField(item, 'key', onChange);
  }) as EditableContent
};

const valueColumnDefinition = {
  id: 'value',
  sortable: false,
  label: t('in-settings:tabs.groupMappingValue'),
  getContent: ((item: MapForm, { getRowIndex, updateIn }) => {
    const onChange = onChangeFunctionFor(updateIn, getRowIndex, item);
    return FormInputField(item, 'value', onChange);
  }) as EditableContent
};

const instanaGroupColumnDefinition = (groups: InstanaGroup[]) => ({
  id: 'instanaGroup',
  sortable: false,
  label: t('in-settings:tabs.instanaGroup'),
  getContent: ((item: MapForm, { getRowIndex, updateIn }) => {
    let selectedGroup: string = '';
    if (item.get(GROUP_ID)) {
      const selectedGroupField: Field<string> = item.get(GROUP_ID) as Field<string>;
      selectedGroup = selectedGroupField.value;
    }
    const onChange = onChangeFunctionFor(updateIn, getRowIndex, item);
    return InstanaGroupPick(groups, selectedGroup, onChange);
  }) as EditableContent
});

const deleteRowColumnDefinition = {
  id: 'deleteRow',
  width: '5',
  sortable: false,
  getContent: (item: MapForm, { deleteRow }: { deleteRow: (toBeDeleted: MapForm) => void }) =>
    DeleteMapping(item, deleteRow)
};

function RightHeader({ addRow }: { addRow: () => void }): JSX.Element {
  return (
    <Button kind="action" icon="lib_openclose_add_circle_outline" onClick={addRow}>
      {t('in-settings:tabs.addGroupMapping')}
    </Button>
  );
}

function saveItem({ form, setMessage }: { form: any; setMessage: any }) {
  setMessage({ message: t('in-settings:tabs.savingGroupMapping'), type: 'neutral', isSaving: true });
  const setMappingsResult = setMappings(form.get(GROUP_MAPPINGS).toJS());
  setMappingsResult.once(
    () => {
      const denyCheckValue: IdentityProviderPatch = {
        restrictEmptyIdpGroups: form.get(DENY_ACCESS).toJS()
      };
      const denyCheckResult = setIdp(denyCheckValue);
      denyCheckResult.once(
        () => setMessage({ text: t('in-settings:tabs.groupMappingSuccessfullySaved'), type: 'success' }),
        error =>
          setMessage({ text: t('in-settings:tabs.groupMappingFailedToSave', { err: error.message }), type: 'error' })
      );
    },
    error => setMessage({ text: t('in-settings:tabs.groupMappingFailedToSave', { err: error.message }), type: 'error' })
  );
}

function newEntry({ id, key, value, groupId }: IdpGroupMapping): MapForm {
  return createMapForm({
    items: {
      key: createField({
        validator: notBlankValidator,
        value: key
      }),
      value: createField({
        value: value
      }),
      groupId: createField({
        value: groupId
      }),
      id: createField({
        value: id
      })
    }
  });
}

function enrichForm(_form: MapForm, { result }: { result: any }) {
  const hasIdp = result.samlConfig?.activated || result.oidcConfig?.activated || result.ldapConfig?.url;

  if (!hasIdp) {
    return createMapForm({ items: { hasIdp: createField({ value: false }) } });
  }

  const formRows = result.mappings.map((e: IdpGroupMapping) => newEntry(e));
  const denyCheck: IdentityProviderPatch = result.denyCheck;
  const mappingsListForm = createListForm({ items: formRows });
  return createMapForm({
    validator: checkThereIsAtLeastOneGroupMappingIfDenyIsChecked,
    items: {
      hasIdp: createField({ value: true }),
      groupMappings: mappingsListForm,
      denyAccess: createField({
        value: denyCheck.restrictEmptyIdpGroups
      }),
      instanaGroups: createField({ value: result.instanaGroups })
    }
  });
}

function checkThereIsAtLeastOneGroupMappingIfDenyIsChecked({ groupMappings, denyAccess }: MapFormItems) {
  const groupMappingsList: ListForm = groupMappings as ListForm;
  const denyAccessField: Field<boolean> = denyAccess as Field<boolean>;
  return internalCheckThereIsAtLeastOneGroupMappingIfDenyIsChecked(groupMappingsList, denyAccessField);
}

function internalCheckThereIsAtLeastOneGroupMappingIfDenyIsChecked(
  groupMappings: ListForm,
  denyAccess: Field<boolean>
) {
  if (groupMappings.size <= 0 && denyAccess.value) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.thereShouldBeAtLeastOneGroupMapping')
      } as ValidationMessage
    ] as ValidationResult;
  }
  return [];
}
