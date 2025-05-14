/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, Item, MapForm, createField } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { IconButton, Select, Stack, Spacer } from '@instana/components';
import { DynamicFieldValue } from '@instana/types';

import {
  ViewModel,
  toFormModel,
  toViewModel
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import {
  defaultType,
  dynamicType,
  defaultValueForType,
  validatorForType,
  staticType
} from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { AdditionalContentPropsType } from 'in-alerting/components/CustomPayload/CustomPayloadTable';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/CustomPayload/CustomPayloadTable.mless';

export const deleteItemColumnDefinition = {
  id: 'deleteRow',
  width: '5',
  sortable: false,
  getContent(
    itemForm: MapForm<any>,
    { deleteRow, enabled }: { deleteRow: (itemForm: MapForm<any>) => void; enabled: boolean }
  ) {
    return (
      <Stack gap="disabled">
        <Tooltip content={t('in-alerting:components.customPayload.deleteRow')} delay={500}>
          <IconButton
            kind="primaryv2"
            type="lib_actions_delete"
            className={classNames({
              [locals.delete]: true,
              [locals.disabled]: !enabled
            })}
            onClick={() => enabled && deleteRow(itemForm)}
          />
        </Tooltip>
        <Spacer size="xsmall" />
      </Stack>
    );
  }
};

type ColumnDefinitionProps = Omit<AdditionalContentPropsType, 'TagBasedPayloadConfigurator'> & {
  TagBasedPayloadConfigurator: React.FunctionComponent<any>;
};

export const valueColumnDefinition = {
  id: 'value',
  width: '50',

  sortable: false,
  label: t('in-alerting:components.customPayload.value'),
  getContent(
    itemForm: MapForm<any>,
    { getRowIndex, updateIn, enabled, TagBasedPayloadConfigurator, suggestionsAlignedLeft }: ColumnDefinitionProps
  ) {
    function onChange(paths: string[], f: (item: Item) => Item) {
      updateIn([getRowIndex(itemForm), ...paths], f);
    }

    const type = itemForm.get('type').value;
    const valueField = itemForm.get('value');
    const value = valueField.value;

    if (type === staticType) {
      return (
        <FormGroup withoutBottomMargin className={locals.cpColumn}>
          <Stack gap="disabled">
            <Input
              disabled={!enabled}
              className={locals.colValue}
              value={value}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                onChange(['value'], (f: Item) => (f as Field<string>).setValue(target.value).setTouched(true));
              }}
              maxLength={512}
            />
            <ValidationError fieldValue={valueField} />
          </Stack>
        </FormGroup>
      );
    }

    if (type === dynamicType) {
      return (
        <FormGroup withoutBottomMargin className={locals.cpColumn}>
          <Stack gap="disabled">
            {valueField.map((field: Field<DynamicFieldValue>) => {
              const value = field?.value;
              const storeIntoFormModel = (payloadItem: ViewModel) => {
                const formModel = toFormModel(payloadItem);
                onChange(['value'], (f: Item) => (f as Field<DynamicFieldValue>).setValue(formModel).setTouched(true));
              };
              return (
                <div>
                  <TagBasedPayloadConfigurator
                    disabled={!enabled}
                    value={toViewModel(value)}
                    onChange={storeIntoFormModel}
                    suggestionsAlignedLeft={suggestionsAlignedLeft}
                    tagFilterExpression={EMPTY_EXPRESSION}
                  />
                  <ValidationError fieldValue={field} />
                </div>
              );
            })}
          </Stack>
        </FormGroup>
      );
    }

    return <span>{t('in-alerting:components.customPayload.unknownTypeTypeItCanNotBeEdited', { type: type })}</span>;
  }
};

export const keyColumnDefinition = {
  id: 'key',
  width: '20',
  sortable: false,
  label: t('in-alerting:components.customPayload.key'),
  getContent(item: MapForm<any>, { getRowIndex, updateIn, enabled }: AdditionalContentPropsType) {
    function onChange(paths: string[], f: (form: Item) => Item) {
      updateIn([getRowIndex(item), ...paths], f);
    }

    const valueField = item.get('key');
    const value = valueField.value;

    return (
      <FormGroup withoutBottomMargin className={locals.cpColumn}>
        <Stack gap="disabled">
          <Stack direction="horizontal" align="center">
            <span className={locals.prefix}>{t('in-alerting:components.customPayload.customWithColon')}</span>
            <Input
              disabled={!enabled}
              className={locals.key}
              value={value}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                onChange(['key'], (f: Item) => (f as Field<string>).setValue(target.value).setTouched(true));
              }}
              maxLength={128}
              autoFocus={Boolean(item.get('id').value)}
            />
          </Stack>
          <ValidationError fieldValue={item.get('key')} />
        </Stack>
      </FormGroup>
    );
  }
};

const staticLabel = t('in-alerting:components.customPayload.static');
const dynamicLabel = t('in-alerting:components.customPayload.dynamic');

type TypeColumnDefinitionProps = Omit<AdditionalContentPropsType, 'updateIn'> & {
  updateIn: (path: (string | number)[], updater: (form: MapForm<any>) => Item) => void;
};

export const typeColumnDefinition = {
  id: 'type',
  width: '20',
  sortable: false,
  label: t('in-alerting:components.customPayload.valueType'),
  getContent(item: MapForm<any>, { getRowIndex, updateIn, enabled }: TypeColumnDefinitionProps) {
    const onChangeType = (newType: string) => {
      const newValue = defaultValueForType(newType);
      const newValidator = validatorForType[newType];
      updateIn([getRowIndex(item)], formFields => {
        return formFields
          .updateIn(['type'], (f: Item) => (f as Field<string>).setValue(newType).setTouched(true))
          .updateIn(['value'], () =>
            createField({
              value: newValue,
              validator: newValidator
            })
          );
      });
    };

    return (
      <FormGroup withoutBottomMargin className={locals.cpColumn}>
        <Stack direction="vertical" align="start" distribution="stretch">
          {item.get('type').map((field: Field<string>) => {
            return (
              <Select
                wrapperClassName={locals.fullWidth}
                disabled={!enabled}
                value={field.value ?? defaultType}
                hasError={!field?.valid && field?.touched}
                onChange={({ target }) => {
                  onChangeType(target.value);
                }}
              >
                {[
                  { value: staticType, label: staticLabel },
                  { value: dynamicType, label: dynamicLabel }
                ].map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            );
          })}
          <Spacer size="xsmall" />
        </Stack>
      </FormGroup>
    );
  }
};

function ValidationError({ fieldValue }: { fieldValue?: Item }) {
  return (
    <div className={locals.errorDiv}>
      <TouchedMessages field={fieldValue} />
    </div>
  );
}
