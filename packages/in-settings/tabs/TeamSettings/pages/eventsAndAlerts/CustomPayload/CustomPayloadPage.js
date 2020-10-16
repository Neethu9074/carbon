import React, { useState } from 'react';
import { createLogger } from 'instalog';

import {
  defaultType,
  staticBooleanType,
  staticNumberType,
  staticStringType,
  dynamicType,
  mergeResultWithPayloadForm,
  toServerItemModel,
  defaultValueForType,
  createNewFormEntry,
  createForm
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/form';
import {
  toFormModel,
  toViewModel,
  createTagBasedPayloadConfigurator
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import {
  useSaveToServerHandler,
  initialState
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/useSaveToServerHandler';
import {
  getGlobalCustomPayloadAsResultObservable,
  saveGlobalCustomPayload
} from 'in-settings/tabs/TeamSettings/api/customPayload';
import getAlertingCustomPayloadTagCatalog from 'in-infrastructure/subscriptions/getAlertingCustomPayloadTagCatalog';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { isLoading, hasError, successObservableFactory } from 'in-services/util/result';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { evaluateClassNames } from 'in-services/util/classnames';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import { pendingResult } from 'in-services/fixedObjects';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';

import locals from './CustomPayloadForm.mless';

const logger = createLogger('customPayloadConfig');

const { TagBasedPayloadConfigurator } = createTagBasedPayloadConfigurator({
  getTagCatalog: getAlertingCustomPayloadTagCatalog,
  getSuggestions: successObservableFactory({
    suggestions: []
  })
});

export default function CustomPayloadPage() {
  const result = useObservable(getGlobalCustomPayloadAsResultObservable(), []) ?? pendingResult;
  const { savingState, save } = useSaveToServerHandler(saveGlobalCustomPayload, logger);
  if (isLoading(result)) {
    return null;
  }
  return <CustomPayload result={result} save={save} savingState={savingState} />;
}

export function CustomPayload(props) {
  const { result, save, savingState } = props;
  const [form, setForm] = useState(createForm(result?.data?.fields ?? []));
  const { message, error, storing } = savingState ?? initialState;

  function getRowIndex(payloadField) {
    return form.reduce((acc, item, i) => (item === payloadField ? i : acc), -1);
  }

  function updateIn(paths, changeField) {
    setForm(form.updateIn(paths, f => changeField(f).setTouched(true)).setTouched(true));
  }

  const addRow = () => {
    setForm(form.push(createNewFormEntry()).setTouched(true));
  };

  const deleteRow = payloadField => {
    if (form.toJS().length === 1) {
      setForm(form.remove(0).push(createNewFormEntry()));
      return;
    }
    const entryPosition = getRowIndex(payloadField);
    if (entryPosition >= 0) {
      setForm(form.remove(entryPosition).setTouched(true));
    }
  };

  const { canConfigureGlobalAlertPayload } = role;
  const columnDefinitions = canConfigureGlobalAlertPayload
    ? [...tableColumnDefinitions, deleteItemColumn]
    : tableColumnDefinitions;

  const enabled = canConfigureGlobalAlertPayload && !storing && !hasError(result) && !isLoading(result);

  return (
    <SettingsDetailPage>
      <Title title="Configure Global Custom Payload for Alerts" />
      <SubViewHeader>Configure Global Custom Payload</SubViewHeader>
      {!canConfigureGlobalAlertPayload && (
        <Message withIcon>You are not having the required permission to edit this custom payload.</Message>
      )}
      <form
        onSubmit={e => {
          e.preventDefault();

          setForm(form.setTouched(true, { recurse: true }));

          if (!form.hierarchyValid) {
            return false;
          }
          save({ fields: form.toJS().map(toServerItemModel) });
        }}
      >
        <ServerTablePresenter
          getRowIndex={getRowIndex}
          columnDefinitions={columnDefinitions}
          getRowProps={getRowProps}
          isSearchable={false}
          noDataMessage="No custom payload customized"
          rightHeader={
            canConfigureGlobalAlertPayload ? (
              <Button kind="action" onClick={addRow} icon="lib_openclose_add_circle_outline" disabled={!enabled}>
                Add Row
              </Button>
            ) : (
              <span />
            )
          }
          size="regular"
          result={mergeResultWithPayloadForm(form, result)}
          deleteRow={deleteRow}
          updateIn={updateIn}
          enabled={enabled}
        />

        {message ? (
          <Section>
            <Notification failure={error} loading={storing}>
              {error ? 'An error occurred, please try again.' : message}
            </Notification>
          </Section>
        ) : null}

        <SaveCancel
          form={{
            // TODO SaveCancel button needs to be tweaked like this or needs to be replaced later
            ...form,
            hierarchyValid: true
          }}
          loading={storing}
          hasCancelButton={false}
          saveEnabled={enabled && form.touched}
          message={message}
        />
      </form>
    </SettingsDetailPage>
  );
}

function getRowProps() {
  return {
    size: 'compact'
  };
}

const tableColumnDefinitions = [
  {
    id: 'key',
    width: '30',
    sortable: false,
    label: 'Key',
    getContent(item, { getRowIndex, updateIn, enabled }) {
      function onChange(paths, f) {
        updateIn([getRowIndex(item), ...paths], f);
      }

      const valueField = item.get('key');
      const value = valueField.value;

      return (
        <FormGroup withoutBottomMargin>
          <Input
            disabled={!enabled}
            className={locals.colName}
            value={value}
            hasError={!valueField?.valid && valueField?.touched}
            onChange={({ target }) => {
              return onChange(['key'], f => f.setValue(target.value).setTouched(true));
            }}
            maxLength={128}
            autoFocus
          />
          <TouchedMessages field={item.get('key')} />
        </FormGroup>
      );
    }
  },
  {
    id: 'type',
    width: '20',

    sortable: false,
    label: 'Value type',
    getContent(item, { getRowIndex, updateIn, enabled }) {
      const onChangeType = newType => {
        const newValue = defaultValueForType(newType);
        updateIn([getRowIndex(item)], formFields => {
          return formFields
            .updateIn(['type'], f => f.setValue(newType).setTouched(true))
            .updateIn(['value'], f => f.setValue(newValue).setTouched(true));
        });
      };

      return (
        <FormGroup withoutBottomMargin>
          {item.get('type').map(field => (
            <Select
              disabled={!enabled}
              className={locals.colName}
              value={field.value ?? defaultType}
              hasError={!field?.valid && field?.touched}
              onChange={({ target }) => onChangeType?.(target.value)}
            >
              {[
                { value: staticStringType, label: 'Static (String)' },
                { value: staticNumberType, label: 'Static (Number)' },
                { value: staticBooleanType, label: 'Static (Boolean)' },
                { value: dynamicType, label: 'Dynamic' }
              ].map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          ))}
        </FormGroup>
      );
    }
  },
  {
    id: 'value',
    width: '45',

    sortable: false,
    label: 'Value',
    getContent(itemForm, { getRowIndex, updateIn, enabled }) {
      function onChange(paths, f) {
        updateIn([getRowIndex(itemForm), ...paths], f);
      }

      const type = itemForm.get('type').value;
      const valueField = itemForm.get('value');
      const value = valueField.value;

      if (type === staticStringType) {
        return (
          <FormGroup withoutBottomMargin>
            <Input
              disabled={!enabled}
              className={locals.colName}
              value={value}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                return onChange(['value'], f => f.setValue(target.value).setTouched(true));
              }}
              maxLength={512}
            />
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }
      if (type === staticNumberType) {
        return (
          <FormGroup withoutBottomMargin>
            <Input
              disabled={!enabled}
              className={locals.colName}
              value={value}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                return onChange(['value'], f => f.setValue(target.value).setTouched(true));
              }}
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
            />
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }
      if (type === staticBooleanType) {
        return (
          <FormGroup withoutBottomMargin>
            <Select
              disabled={!enabled}
              className={locals.colName}
              value={value ?? false}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                onChange(['value'], f => f.setValue(target.value).setTouched(true));
              }}
            >
              <option value>true</option>
              <option value={false}>false</option>
            </Select>
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }

      if (type === dynamicType) {
        return (
          <FormGroup withoutBottomMargin className={locals.colName}>
            {valueField.map(field => {
              const value = field?.value;
              const storeIntoFormModel = payloadItem => {
                const formModel = toFormModel(payloadItem);
                onChange(['value'], f => f.setValue(formModel).setTouched(true));
              };
              return (
                <>
                  <TagBasedPayloadConfigurator
                    disabled={!enabled}
                    value={toViewModel(value)}
                    onChange={storeIntoFormModel}
                    tagFilterExpression={{}}
                  />
                  <TouchedMessages field={field} />
                </>
              );
            })}
          </FormGroup>
        );
      }

      return <span>Unknown type: {type} - it can not be edited.</span>;
    }
  }
];

const deleteItemColumn = {
  id: 'deleteRow',
  width: '5',
  sortable: false,
  getContent(itemForm, { deleteRow, enabled }) {
    return (
      <div className={locals.controls}>
        <Tooltip content="Delete Row" align="mousePosition">
          <SvgIcon
            type="lib_actions_delete"
            className={evaluateClassNames({
              [locals.delete]: true,
              [locals.disabled]: !enabled
            })}
            onClick={() => enabled && deleteRow(itemForm)}
          />
        </Tooltip>
      </div>
    );
  }
};
