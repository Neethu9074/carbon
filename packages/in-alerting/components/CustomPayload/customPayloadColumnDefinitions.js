/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import {
  toFormModel,
  toViewModel,
  createTagBasedPayloadConfigurator
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import {
  defaultType,
  dynamicType,
  defaultValueForType,
  validatorForType,
  staticType
} from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { getCustomPayloadTagCatalog } from 'in-settings/tabs/TeamSettings/api/customPayload';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { successObservableFactory } from 'in-services/util/result';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/CustomPayload/CustomPayloadTable.mless';

export const deleteItemColumnDefinition = {
  id: 'deleteRow',
  width: '5',
  sortable: false,
  getContent(itemForm, { deleteRow, enabled }) {
    return (
      <div className={locals.controls}>
        <Tooltip content={t('in-alerting:components.customPayload.deleteRow')}>
          <SvgIcon
            type="lib_actions_delete"
            className={classNames({
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

export const valueColumnDefinition = {
  id: 'value',
  width: '45',

  sortable: false,
  label: t('in-alerting:components.customPayload.value'),
  getContent(itemForm, { getRowIndex, updateIn, enabled, trackChange }) {
    function onChange(paths, f) {
      updateIn([getRowIndex(itemForm), ...paths], f);
    }

    const type = itemForm.get('type').value;
    const valueField = itemForm.get('value');
    const value = valueField.value;

    if (type === staticType) {
      return (
        <FormGroup withoutBottomMargin>
          <Input
            disabled={!enabled}
            className={locals.colValue}
            value={value}
            hasError={!valueField?.valid && valueField?.touched}
            onChange={({ target }) => {
              onChange(['value'], f => f.setValue(target.value).setTouched(true));
            }}
            maxLength={512}
          />
          <TouchedMessages field={valueField} />
        </FormGroup>
      );
    }

    if (type === dynamicType) {
      return (
        <FormGroup withoutBottomMargin className={locals.colValue}>
          {valueField.map(field => {
            const value = field?.value;
            const storeIntoFormModel = payloadItem => {
              const formModel = toFormModel(payloadItem);
              onChange(['value'], f => f.setValue(formModel).setTouched(true));
              trackChange({ dynamicValue: formModel.tagName });
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

    return <span>{t('in-alerting:components.customPayload.unknownTypeTypeItCanNotBeEdited', { type: type })}</span>;
  }
};

export const keyColumnDefinition = {
  id: 'key',
  width: '30',
  sortable: false,
  label: t('in-alerting:components.customPayload.key'),
  getContent(item, { getRowIndex, updateIn, enabled }) {
    function onChange(paths, f) {
      updateIn([getRowIndex(item), ...paths], f);
    }

    const valueField = item.get('key');
    const value = valueField.value;

    return (
      <FormGroup withoutBottomMargin>
        <HorizontalFlexWrapper className={locals.colName}>
          <span className={locals.prefix}>{t('in-alerting:components.customPayload.customWithColon')}</span>
          <Input
            disabled={!enabled}
            className={locals.key}
            value={value}
            hasError={!valueField?.valid && valueField?.touched}
            onChange={({ target }) => {
              onChange(['key'], f => f.setValue(target.value).setTouched(true));
            }}
            maxLength={128}
            autoFocus={Boolean(item.get('id').value)}
          />
        </HorizontalFlexWrapper>
        <TouchedMessages field={item.get('key')} />
      </FormGroup>
    );
  }
};

export const typeColumnDefinition = {
  id: 'type',
  width: '20',

  sortable: false,
  label: t('in-alerting:components.customPayload.valueType'),
  getContent(item, { getRowIndex, updateIn, enabled, trackChange }) {
    const onChangeType = newType => {
      const newValue = defaultValueForType(newType);
      const newValidator = validatorForType[newType];
      updateIn([getRowIndex(item)], formFields => {
        return formFields
          .updateIn(['type'], f => f.setValue(newType).setTouched(true))
          .updateIn(['value'], () =>
            createField({
              value: newValue,
              validator: newValidator
            })
          );
      });
    };

    return (
      <FormGroup withoutBottomMargin>
        {item.get('type').map(field => (
          <Select
            disabled={!enabled}
            className={locals.colType}
            value={field.value ?? defaultType}
            hasError={!field?.valid && field?.touched}
            onChange={({ target }) => {
              onChangeType(target.value);
              trackChange({ type: target.value, oldType: field.value });
            }}
          >
            {[
              { value: staticType, label: t('in-alerting:components.customPayload.static') },
              { value: dynamicType, label: t('in-alerting:components.customPayload.dynamic') }
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
};

const { TagBasedPayloadConfigurator } = createTagBasedPayloadConfigurator({
  getTagCatalog: getCustomPayloadTagCatalog,
  getSuggestions: successObservableFactory({
    suggestions: []
  })
});
