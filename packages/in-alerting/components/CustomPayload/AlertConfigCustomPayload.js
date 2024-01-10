/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  deleteItemColumnDefinition,
  valueColumnDefinition,
  typeColumnDefinition,
  keyColumnDefinition
} from 'in-alerting/components/CustomPayload/customPayloadColumnDefinitions';
import { createNewFormEntry } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import CustomPayloadTable from 'in-alerting/components/CustomPayload/CustomPayloadTable';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload.mless';

const KeyValue = [
  { ...keyColumnDefinition, width: '40' },
  { ...valueColumnDefinition, width: '55' },
  { ...deleteItemColumnDefinition, width: '5' }
];

const KeyTypeValue = [
  { ...keyColumnDefinition, width: '25' },
  { ...typeColumnDefinition, width: '20' },
  { ...valueColumnDefinition, width: '50' },
  { ...deleteItemColumnDefinition, width: '5' }
];

export default function AlertConfigCustomPayload({ form, setForm, supportDynamicTypes, TagBasedPayloadConfigurator }) {
  return (
    <CustomPayloadTable
      getRowIndex={getRowIndex}
      columnDefinitions={supportDynamicTypes ? KeyTypeValue : KeyValue}
      isSearchable={false}
      addRow={addRow}
      deleteRow={deleteRow}
      updateIn={updateIn}
      result={{
        // Parent component would only render if 'result has no errors' or 'result not loading'. Passing loading and errors param accordingly.
        progress: {
          loading: false
        },
        errors: [],
        data: {
          //this is for enabling edit option only for static payloads in Infra SA, as dynamic is not yet supported  in UI
          //normal case, this could be just -  items:form.get('customPayloadFields').items ?? []
          items: supportDynamicTypes
            ? form.get('customPayloadFields').items
            : getStaticPayload(form.get('customPayloadFields').items) ?? []
        }
      }}
      customPayloadForm={form.get('customPayloadFields')}
      TagBasedPayloadConfigurator={supportDynamicTypes ? TagBasedPayloadConfigurator : null}
      leftHeader={
        <div className={locals.leftHeader}>{t('in-alerting:components.customPayload.additionalCustomPayload')}</div>
      }
    />
  );

  function getRowIndex(payloadField) {
    return form.get('customPayloadFields').reduce((acc, item, i) => (item === payloadField ? i : acc), -1);
  }

  function updateIn(paths, changeField) {
    setForm(form.updateIn(['customPayloadFields', ...paths], f => changeField(f).setTouched(true)));
  }

  function deleteRow(payloadField) {
    const entryPosition = getRowIndex(payloadField);

    if (entryPosition >= 0) {
      setForm(form.updateIn(['customPayloadFields'], f => f.remove(entryPosition).setTouched(true)));
    }
  }

  function addRow() {
    setForm(form.updateIn(['customPayloadFields'], f => f.push(createNewFormEntry()).setTouched(true)));
  }
}

function getStaticPayload(formItem) {
  return formItem.filter(item => item.items.type.value == 'staticString');
}
