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
  firstMappingAdded,
  mappingChanged,
  mappingRemoved,
  enabledRestrictedAccess,
  disabledRestrictedAccess
} from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GroupMapping/tracker';
import {
  refresh,
  getMappings,
  setMappings,
  getIdpRestriction,
  setIdpRestriction,
  IdpGroupMapping,
  IdentityProviderPatch
} from 'in-settings/tabs/AuthSettings/api/groupMappings';
// @ts-expect-error
import { getConfigAsResultObservableNotMemoized as ldapConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
// @ts-expect-error
import { getConfigAsResultObservable as oidcConfig } from 'in-settings/tabs/AuthSettings/api/oidc';
// @ts-expect-error
import { getConfigAsResultObservable as samlConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import { getGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
// @ts-expect-error
import ApiItemView from 'in-settings/components/ApiItemView';
import { notBlankValidator } from 'in-services/validators/string';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ValidationBlock from 'in-components/form/ValidationBlock';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
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

interface GroupMappingTableProps extends ServerTablePresenterProps<MapForm<any>> {
  getRowIndex: (payloadField: Item) => number;
  updateIn: (path: string[], updater: (item: Item) => Item) => void;
  deleteRow: (toBeDeleted: MapForm<any>) => void;
}

const DENY_ACCESS = 'denyAccess';
const GROUP_MAPPINGS = 'groupMappings';
const INSTANA_GROUPS = 'instanaGroups';
const GROUP_ID = 'groupId';
const TRACKING = 'tracking';

export default function GroupMapping() {
  return (
    <ApiItemView
      getObservables={() => ({
        mappings: getMappings(),
        instanaGroups: getGroupsAsResultObservable(),
        denyCheck: getIdpRestriction(),
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

function render({ form, setForm }: { form: MapForm<any>; setForm: (newForm: MapForm<any>) => void }): JSX.Element {
  if (!form.get('hasIdp')?.value) {
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
    const groupsField: Field<InstanaGroup[]> = form.get(INSTANA_GROUPS);
    instanaGroups = groupsField.value;
  }

  let denyAccess = false;
  if (form.get(DENY_ACCESS)) {
    const denyAccessField: Field<boolean> = form.get(DENY_ACCESS);
    denyAccess = denyAccessField.value;
  }

  const shouldShowDenyIssue = internalCheckThereIsAtLeastOneGroupMappingIfDenyIsChecked(
    form.get(GROUP_MAPPINGS),
    form.get(DENY_ACCESS)
  );

  const groupMappings: MapForm<any>[] = form.get(GROUP_MAPPINGS) ?? [];

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
      <ServerTablePresenter<MapForm<any>, GroupMappingTableProps>
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
            items: groupMappings,
            pageSize: groupMappings.length,
            totalHits: groupMappings.length,
            page: 1
          }
        }}
        page={1}
        pageSize={groupMappings.length}
      />
    </>
  );

  function addRow() {
    setForm(
      form.updateIn(
        [GROUP_MAPPINGS],
        (f: Item): Item =>
          (f as ListForm<any>).push(newEntry({ id: null, key: '', value: '', groupId: defaultRoleId })).setTouched(true)
      )
    );
  }

  function deleteRow(payloadField: MapForm<any>) {
    const entryPosition = getRowIndex(payloadField);

    if (entryPosition >= 0) {
      setForm(
        form.updateIn([GROUP_MAPPINGS], (f: Item) => (f as ListForm<any>).remove(entryPosition).setTouched(true))
      );
    }
  }

  function getRowIndex(payloadField: Item): number {
    if (form.get(GROUP_MAPPINGS)) {
      const groupMappings: ListForm<any> = form.get(GROUP_MAPPINGS);
      return groupMappings.reduce((acc: number, item: Item, i: number) => (item === payloadField ? i : acc), -1);
    }
    return -1;
  }

  function updateIn(path: string[], updater: Updater) {
    // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
    setForm(form.updateIn([GROUP_MAPPINGS, ...path], (f: Item) => updater(f).setTouched(true)));
  }
}

type OnChangeInput = (path: string[], doThis: (f: Item) => Field<string>) => void;

function FormInputField(item: MapForm<any>, itemKey: string, onChange: OnChangeInput): JSX.Element {
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
        onChange={e => {
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

function DeleteMapping(item: MapForm<any>, deleteRow: (toBeDeleted: MapForm<any>) => void): JSX.Element {
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
  item: MapForm<any>,
  helpers: {
    getRowIndex: (payloadField: Item) => number;
    updateIn: (path: string[], updater: (item: Item) => Item) => void;
  }
) => React.ReactElement;

const keyColumnDefinition = {
  id: 'key',
  sortable: false,
  label: t('in-settings:tabs.groupMappingKey'),
  getContent: ((item: MapForm<any>, { getRowIndex, updateIn }) => {
    const onChange = onChangeFunctionFor(updateIn, getRowIndex, item);
    return FormInputField(item, 'key', onChange);
  }) as EditableContent
};

const valueColumnDefinition = {
  id: 'value',
  sortable: false,
  label: t('in-settings:tabs.groupMappingValue'),
  getContent: ((item: MapForm<any>, { getRowIndex, updateIn }) => {
    const onChange = onChangeFunctionFor(updateIn, getRowIndex, item);
    return FormInputField(item, 'value', onChange);
  }) as EditableContent
};

const instanaGroupColumnDefinition = (groups: InstanaGroup[]) => ({
  id: 'instanaGroup',
  sortable: false,
  label: t('in-settings:tabs.instanaGroup'),
  getContent: ((item: MapForm<any>, { getRowIndex, updateIn }) => {
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
  label: '',
  width: '5',
  sortable: false,
  getContent: (item: MapForm<any>, { deleteRow }: { deleteRow: (toBeDeleted: MapForm<any>) => void }) =>
    DeleteMapping(item, deleteRow)
};

function RightHeader({ addRow }: { addRow: () => void }): JSX.Element {
  return (
    <Button kind="action" icon="lib_openclose_add_circle_outline" onClick={addRow}>
      {t('in-settings:tabs.addGroupMapping')}
    </Button>
  );
}

function saveItem({ form, setMessage, setForm }: { form: any; setMessage: any; setForm: any }) {
  setMessage({ message: t('in-settings:tabs.savingGroupMapping'), type: 'neutral', isSaving: true });
  const setMappingsResult = setMappings(form.get(GROUP_MAPPINGS).toJS());
  trackDifference(form);
  setMappingsResult.once(
    () => {
      const denyCheckValue: IdentityProviderPatch = {
        restrictEmptyIdpGroups: form.get(DENY_ACCESS).toJS()
      };
      const denyCheckResult = setIdpRestriction(denyCheckValue);
      setForm(
        form.updateIn([TRACKING], () =>
          createMapForm({
            items: {
              initialSize: createField({ value: form.get('groupMappings').size }),
              initialRestrictAccessFlag: createField({ value: form.get('denyAccess').value })
            }
          })
        )
      );
      denyCheckResult.once(
        () => setMessage({ text: t('in-settings:tabs.groupMappingSuccessfullySaved'), type: 'success' }),
        error =>
          setMessage({ text: t('in-settings:tabs.groupMappingFailedToSave', { err: error.message }), type: 'error' })
      );
    },
    error => setMessage({ text: t('in-settings:tabs.groupMappingFailedToSave', { err: error.message }), type: 'error' })
  );
}

function trackDifference(form: MapForm<any>) {
  const tracking: MapForm<any> = form.get('tracking');

  if (form.get('groupMappings').size > 0) {
    if (tracking.get('initialSize').value === 0) {
      firstMappingAdded({ groupMappings: form.get('groupMappings')?.toJS() });
    } else {
      mappingChanged({ groupMappings: form.get('groupMappings')?.toJS() });
    }
  } else {
    mappingRemoved();
  }

  const initialRestrictAccessFlag: Field<boolean> = tracking.get('initialRestrictAccessFlag');
  if (form.get('denyAccess').value != initialRestrictAccessFlag.value) {
    if (form.get('denyAccess').value) {
      enabledRestrictedAccess();
    } else {
      disabledRestrictedAccess();
    }
  }
}

function newEntry({ id, key, value, groupId }: IdpGroupMapping): MapForm<any> {
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

function enrichForm(_form: MapForm<any>, { result }: { result: any }) {
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
      instanaGroups: createField({ value: result.instanaGroups }),
      tracking: createMapForm({
        items: {
          initialSize: createField({ value: formRows.length }),
          initialRestrictAccessFlag: createField({ value: denyCheck.restrictEmptyIdpGroups })
        }
      })
    }
  });
}

function checkThereIsAtLeastOneGroupMappingIfDenyIsChecked({ groupMappings, denyAccess }: MapFormItems) {
  const groupMappingsList: ListForm<any> = groupMappings as ListForm<any>;
  const denyAccessField: Field<boolean> = denyAccess as Field<boolean>;
  return internalCheckThereIsAtLeastOneGroupMappingIfDenyIsChecked(groupMappingsList, denyAccessField);
}

function internalCheckThereIsAtLeastOneGroupMappingIfDenyIsChecked(
  groupMappings: ListForm<any>,
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
