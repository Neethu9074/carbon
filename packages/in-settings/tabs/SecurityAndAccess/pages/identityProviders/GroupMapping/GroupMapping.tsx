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
import React, { useState } from 'react';

import { Link, SvgIcon, Message, Checkbox, Button } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Select } from '@instana/components';

import {
  ENTERPRISE_IDP_MAPPING_FIRST,
  ENTERPRISE_IDP_MAPPING_CHANGED,
  ENTERPRISE_IDP_MAPPING_REMOVED,
  ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS,
  ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS_REMOVE
} from 'in-services/tracking/tracking';
import {
  refresh,
  getMappings,
  setMappings,
  getIdpRestriction,
  setIdpRestriction,
  IdpGroupMapping,
  IdentityProviderPatch
} from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getConfigAsResultObservableNotMemoized as ldapConfig } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import { getConfigAsResultObservable as oidcConfig } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { getConfigAsResultObservable as samlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { getGroupsAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
// @ts-expect-error
import ApiItemView from 'in-settings/components/ApiItemView';
import { compareIgnoreCase, containsIgnoreCase } from 'in-services/util/string';
import { notBlankValidator } from 'in-services/validators/string';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { listSuccess, loading } from 'in-services/util/result';
import { isLoading, hasError } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { identity } from 'in-services/util/function';
import FormGroup from 'in-components/form/FormGroup';
import { error } from 'in-services/util/result';
import { defaultRoleId } from 'in-stores/user';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

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

interface RenderProps {
  // eslint-disable-next-line react/no-unused-prop-types
  readonly form: MapForm<any>;
  // eslint-disable-next-line react/no-unused-prop-types
  readonly setForm: (newForm: MapForm<any>) => void;
}

export default function GroupMapping() {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string | undefined>('');
  const { trackCta } = useSegmentTracking();
  const pageSize = 100;

  function getMappingData() {
    const apis = {
      mappings: getMappings(),
      instanaGroups: getGroupsAsResultObservable(),
      denyCheck: getIdpRestriction(),
      samlConfig: samlConfig(undefined),
      ldapConfig: ldapConfig(),
      oidcConfig: oidcConfig(undefined)
    };
    const observableKeys: any = Object.keys(apis);
    const observableValues: any = Object.values(apis);
    return combineLatest(observableValues).map((results: any) => {
      const resultData: any = {};
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (isLoading(result)) {
          return pendingResult;
        }
        if (hasError(result)) {
          return error(result.errors);
        }
        resultData[observableKeys[i]] = result.data;
      }

      return resultData;
    });
  }

  const mappingData = getMappingData();
  const data = useObservable(mappingData, []) ?? pendingResult;

  function saveItem({ form, setMessage, setForm }: { form: any; setMessage: any; setForm: any }) {
    setMessage({ message: t('in-settings:tabs.savingGroupMapping'), type: 'neutral', isSaving: true });
    const setMappingsResult = setMappings(form.get(GROUP_MAPPINGS).toJS());
    trackDifference(form, trackCta);
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
      error =>
        setMessage({ text: t('in-settings:tabs.groupMappingFailedToSave', { err: error.message }), type: 'error' })
    );
  }

  function render({ form, setForm }: RenderProps): JSX.Element {
    if (!form.get('hasIdp')?.value) {
      return (
        <>
          <Title title={t('in-settings:tabs.configureGroupMapping')} />
          <SubViewHeader>{t('in-settings:tabs.groupMapping')}</SubViewHeader>
          <div className={locals.margin}>{t('in-settings:tabs.failIfNoIdp')}</div>
          <Trans
            i18nKey="in-settings:tabs.failIfNoIdpDocs"
            components={{
              gmLink: (
                // @ts-expect-error
                <Link external href="https://ibm.biz/idp-group-mapping" />
              ),
              authLink: (
                // @ts-expect-error
                <Link external href="https://ibm.biz/configuring-authentication" />
              )
            }}
          />
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

    let groupMappings: MapForm<MapFormItems> = form.get(GROUP_MAPPINGS) ?? [];
    const firstItem = (page - 1) * pageSize; // 1. => 0., 2 => 26
    let lastItem = pageSize * page; // 1. => 25, 2. => 50
    // @ts-expect-error invalid type
    if (lastItem > (groupMappings.items?.length ?? 0)) {
      // @ts-expect-error invalid type
      lastItem = groupMappings.items.length;
    }

    if (searchQuery !== '')
      groupMappings = {
        ...groupMappings,
        // @ts-expect-error invalid type
        items: groupMappings.items.filter(item => searchItem(item, ['key'], searchQuery))
      };

    const result = arrayToResult(
      // @ts-ignore
      groupMappings.items?.slice(firstItem, lastItem) ?? [],
      // @ts-ignore
      groupMappings.items?.length ?? 0,
      pageSize,
      page
    );
    return (
      <>
        <Title title={t('in-settings:tabs.configureGroupMapping')} />
        <SubViewHeader>{t('in-settings:tabs.groupMapping')}</SubViewHeader>
        <Checkbox
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
        <Message className={locals.description} type="neutral" withIcon small>
          <Trans
            i18nKey="in-settings:tabs.denyUserWithNoGroupDocs"
            components={{
              authLink: (
                // @ts-expect-error
                <Link external href="https://ibm.biz/configuring-authentication" />
              )
            }}
          />
        </Message>
        <div className={locals.description}>{t('in-settings:tabs.groupMappingInfoText')}</div>
        {shouldShowDenyIssue && shouldShowDenyIssue.length > 0 && (
          <ValidationBlock className="">{shouldShowDenyIssue[0].message}</ValidationBlock>
        )}
        <ServerTablePresenter<MapForm<any>, GroupMappingTableProps>
          fixedLayout
          isSearchable
          searchPlaceholder={t('in-settings:components.search')}
          searchMaxWidth={200}
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
          result={result}
          page={page}
          pageSize={pageSize}
          onChange={({ page, query }) => {
            setPage(page ?? 1);
            setSearchQuery(query);
          }}
        />
      </>
    );

    function addRow() {
      setForm(
        form.updateIn(
          [GROUP_MAPPINGS],
          (f: Item): Item =>
            (f as ListForm<any>)
              .unshift(newEntry({ id: null, key: '', value: '', groupId: defaultRoleId }))
              .setTouched(true)
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

  function searchItem(item: any, searchFields: string[], query: string) {
    for (let i = 0; i < searchFields.length; i++) {
      if (containsIgnoreCase(item.get(searchFields[i]).value + '', query ?? '')) {
        return true;
      }
    }
    return false;
  }

  return (
    <ApiItemView enrichForm={enrichForm} onCancelClick={refresh} saveItem={saveItem} render={render} result={data} />
  );

  function enrichForm(_form: MapForm<any>, { result }: { result: any }) {
    const hasIdp = result.samlConfig?.activated || result.oidcConfig?.activated || result.ldapConfig?.url;
    if (!hasIdp) {
      return createMapForm({ items: { hasIdp: createField({ value: false }) } });
    }

    const formRows = result.mappings
      ?.slice()
      .sort(idpGroupMappingComparator)
      .map((e: IdpGroupMapping) => newEntry(e));

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

function trackDifference(form: MapForm<any>, trackCta: CtaTrackingFunction) {
  const tracking: MapForm<any> = form.get('tracking');

  if (form.get('groupMappings').size > 0) {
    if (tracking.get('initialSize').value === 0) {
      // Segment tracking
      trackCta(ENTERPRISE_IDP_MAPPING_FIRST, { groupMappings: form.get('groupMappings')?.toJS() });
    } else {
      // Segment tracking
      trackCta(ENTERPRISE_IDP_MAPPING_CHANGED, { groupMappings: form.get('groupMappings')?.toJS() });
    }
  } else {
    // Segment tracking
    trackCta(ENTERPRISE_IDP_MAPPING_REMOVED);
  }

  const initialRestrictAccessFlag: Field<boolean> = tracking.get('initialRestrictAccessFlag');
  if (form.get('denyAccess').value != initialRestrictAccessFlag.value) {
    if (form.get('denyAccess').value) {
      // Segment tracking
      trackCta(ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS);
    } else {
      // Segment tracking
      trackCta(ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS_REMOVE);
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

const idpGroupMappingComparator = (a: IdpGroupMapping, b: IdpGroupMapping): 1 | 0 | -1 => {
  const keyCompare = compareIgnoreCase(a?.key ?? '', b?.key ?? '');
  if (keyCompare !== 0) {
    return keyCompare;
  }

  const valueCompare = compareIgnoreCase(a?.value ?? '', b?.value ?? '');
  if (valueCompare !== 0) {
    return valueCompare;
  }

  return compareIgnoreCase(a?.groupId ?? '', b?.groupId ?? '');
};

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
function arrayToResult(
  array: Array<any>,
  totalHits: number,
  pageSize: number,
  page: number,
  itemMapper = identity,
  time = Date.now()
) {
  return array ? listSuccess(array.map(itemMapper), totalHits, pageSize, page, time) : loading;
}
