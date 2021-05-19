/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  deleteItemColumnDefinition,
  valueColumnDefinition,
  keyColumnDefinition
} from 'in-alerting/components/CustomPayload/customPayloadColumnDefinitions';
import { createNewFormEntry } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import CustomPayloadTable from 'in-alerting/components/CustomPayload/CustomPayloadTable';

export default function AlertConfigCustomPayload({ form, setForm }) {
  const tableColumnDefinitions = [
    { ...keyColumnDefinition, width: '40' },
    { ...valueColumnDefinition, width: '55' }
  ];

  return (
    <CustomPayloadTable
      getRowIndex={getRowIndex}
      columnDefinitions={[...tableColumnDefinitions, deleteItemColumnDefinition]}
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
          items: form.get('customPayloadFields').items ?? []
        }
      }}
      customPayloadForm={form.get('customPayloadFields')}
    />
  );

  function getRowIndex(payloadField) {
    return form.get('customPayloadFields').reduce((acc, item, i) => (item === payloadField ? i : acc), -1);
  }

  function updateIn(paths, changeField) {
    setForm(form.updateIn(['customPayloadFields', ...paths], f => changeField(f).setTouched(true)).setTouched(true));
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
