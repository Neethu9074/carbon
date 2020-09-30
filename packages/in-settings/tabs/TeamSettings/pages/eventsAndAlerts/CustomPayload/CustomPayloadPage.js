import { createListForm } from 'formalistic';
import React, { useState } from 'react';
import { createLogger } from 'instalog';

import {
  defaultType,
  staticBooleanType,
  staticNumberType,
  staticStringType,
  dynamicType,
  hardCodedDynamicValues,
  createFormFieldForField,
  mergeResultWithPayloadForm,
  toServerItemModel,
  enrichedWithUniqId
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/form';
import {
  useSaveToServerHandler,
  initialState
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/useSaveToServerHandler';
import {
  getGlobalCustomPayloadAsResultObservable,
  saveGlobalCustomPayload
} from 'in-settings/tabs/TeamSettings/api/customPayload';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import FormInputField from 'in-custom-dashboards/widgets/Slo/components/FormInputField';
import FormDropDown from 'in-custom-dashboards/widgets/Slo/components/FormDropDown';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { evaluateClassNames } from 'in-services/util/classnames';
import { isLoading, hasError } from 'in-services/util/result';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import { pendingResult } from 'in-services/fixedObjects';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import useObservable from 'in-hooks/useObservable';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Title from 'in-components/Title';

import locals from './CustomPayloadForm.mless';

const logger = createLogger('customPayloadConfig');

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
    setForm(form.updateIn(paths, f => changeField(f)).setTouched(true));
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

  const enabled = !storing && !hasError(result) && !isLoading(result); // LATER: TODO: add hasRule(xxx) check, needs to be defined

  return (
    <SettingsDetailPage>
      <Title title="Configure Global Custom Payload for Alerts" />
      <SubViewHeader>Configure Custom Payload</SubViewHeader>
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
          onRowChange={updateIn}
          getRowIndex={getRowIndex}
          columnDefinitions={columnDefinitions}
          getRowProps={getRowProps}
          isSearchable={false}
          noDataMessage="No custom payload customized"
          rightHeader={
            <Button kind="action" onClick={addRow} icon="lib_openclose_add_circle_outline" disabled={!enabled}>
              Add Row
            </Button>
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
              {message}
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

const columnDefinitions = [
  {
    id: 'key',
    width: '20',
    sortable: false,
    label: 'Key',
    getContent(item, { getRowIndex, updateIn }) {
      function onChange(paths, f) {
        updateIn([getRowIndex(item), ...paths], f);
      }

      return (
        <FormGroup withoutBottomMargin>
          <FormInputField className={locals.colName} form={item} fieldName="key" onChange={onChange} autoFocus />
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
    getContent(item, { getRowIndex, updateIn }) {
      const onChangeType = newType => {
        const defaults = {
          [staticBooleanType]: true,
          [staticNumberType]: 42,
          [dynamicType]: hardCodedDynamicValues[0]
        };
        const newValue = defaults[newType] ?? '';
        updateIn([getRowIndex(item)], formFields => {
          return formFields
            .updateIn(['type'], f => f.setValue(newType).setTouched(true))
            .updateIn(['value'], f => f.setValue(newValue).setTouched(true));
        });
      };

      return (
        <FormGroup withoutBottomMargin>
          {item.get('type').map(field => (
            <FormDropDown
              className={locals.colName}
              value={field.value ?? defaultType}
              hasError={!field?.valid && field?.touched}
              onChange={({ target }) => onChangeType?.(target.value)}
              options={[
                { value: staticStringType, label: 'Static (String)' },
                { value: staticNumberType, label: 'Static (Number)' },
                { value: staticBooleanType, label: 'Static (Boolean)' },
                { value: dynamicType, label: 'Dynamic' }
              ]}
            />
          ))}
        </FormGroup>
      );
    }
  },
  {
    id: 'value',
    width: '30',

    sortable: false,
    label: 'Value',
    getContent(itemForm, { getRowIndex, updateIn }) {
      function onChange(paths, f) {
        updateIn([getRowIndex(itemForm), ...paths], f);
      }

      const type = itemForm.get('type').value;
      const valueField = itemForm.get('value');
      const value = valueField.value;

      if (type === staticStringType) {
        return (
          <FormGroup withoutBottomMargin>
            <FormInputField className={locals.colName} form={itemForm} fieldName="value" onChange={onChange} />
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }
      if (type === staticNumberType) {
        return (
          <FormGroup withoutBottomMargin>
            <FormInputField
              className={locals.colName}
              form={itemForm}
              fieldName="value"
              onChange={onChange}
              type="number"
            />
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }
      if (type === staticBooleanType) {
        return (
          <FormGroup withoutBottomMargin>
            <FormDropDown
              className={locals.colName}
              value={value ?? ''}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                onChange(['value'], f => f.setValue(target.value).setTouched(true));
              }}
              options={[
                { value: true, label: 'true', id: 'true' },
                { value: false, label: 'false', id: 'false' }
              ]}
            />
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }

      // in a next step, this list might already be pre-configured
      const valuesList = hardCodedDynamicValues.map(v => ({ ...v, value: JSON.stringify(v.value) }));
      const valueJson = JSON.stringify(value ?? '');

      if (!value || 0 > valuesList.find(v => v.value === valueJson)) {
        const syntheticUnknownEntry = {
          value: valueJson,
          label: `unknown value: ${valueJson}`
        };
        valuesList.push(syntheticUnknownEntry);
      }

      if (type === dynamicType) {
        return (
          <FormGroup withoutBottomMargin>
            {valueField.map(field => {
              return (
                <FormDropDown
                  className={locals.colName}
                  value={valueJson}
                  hasError={!field.valid && field.touched}
                  onChange={({ target }) => {
                    onChange(['value'], f => f.setValue(JSON.parse(target.value)).setTouched(true));
                  }}
                  options={valuesList}
                />
              );
            })}
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }

      return <span>Unknown type: {type} - it can not be edited.</span>;
    }
  },
  {
    id: 'deleteRow',
    width: '1',
    sortable: false,
    getContent(itemForm, { deleteRow, enabled }) {
      return (
        <div className={locals.controls}>
          <Tooltip content="Delete Row">
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
  }
];

function createForm(payloadFields) {
  let fields = createListForm();
  payloadFields.forEach(payloadField => {
    fields = fields.push(createFormFieldForField(payloadField));
  });
  if (!payloadFields.length) {
    // minimal empty entry, when nothing was specified yet
    fields = fields.push(createNewFormEntry());
  }
  return fields;
}

function createNewFormEntry() {
  return createFormFieldForField(enrichedWithUniqId({}));
}
