/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CreateListFormOpts, Item, MapForm } from 'formalistic';
import React from 'react';

import { PaginatedResult, Result } from '@instana/types';

import {
  deleteItemColumnDefinition,
  valueColumnDefinition,
  typeColumnDefinition,
  keyColumnDefinition
} from 'in-alerting/components/CustomPayload/customPayloadColumnDefinitions';
import { createNewFormEntry } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import CustomPayloadTable from 'in-alerting/components/CustomPayload/CustomPayloadTable';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { Nullish } from 'in-types';
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

interface AlertConfigCustomPayloadProps {
  form: MapForm<any>;
  setForm?: (form: MapForm<any>) => void;
  supportDynamicTypes: boolean;
  TagBasedPayloadConfigurator?: React.ReactNode;
  isTearSheet?: boolean;
}

export default function AlertConfigCustomPayload({
  form,
  setForm,
  supportDynamicTypes,
  TagBasedPayloadConfigurator,
  isTearSheet = false
}: AlertConfigCustomPayloadProps) {
  return (
    <CustomPayloadTable
      getRowIndex={getRowIndex}
      //@ts-expect-error columnDefinitions type mismatch
      columnDefinitions={supportDynamicTypes ? KeyTypeValue : KeyValue}
      isSearchable={false}
      addRow={addRow}
      deleteRow={deleteRow}
      updateIn={updateIn}
      isTearSheet={isTearSheet}
      result={
        {
          // Parent component would only render if 'result has no errors' or 'result not loading'. Passing loading and errors param accordingly.
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items: supportDynamicTypes
              ? form.get('customPayloadFields').items
              : getStaticPayload(form.get('customPayloadFields').items) ?? []
          }
        } as unknown as Result<PaginatedResult<Item>> | Nullish
      }
      customPayloadForm={form.get('customPayloadFields')}
      TagBasedPayloadConfigurator={supportDynamicTypes ? TagBasedPayloadConfigurator : null}
      leftHeader={
        isTearSheet ? (
          <AlertTypography
            variant={'heading-100'}
            color={'color900-navy'}
            content={t('in-alerting:components.customPayload.includeAdditionalCustomPayload')}
            noMargin
          />
        ) : (
          <div className={locals.leftHeader}>{t('in-alerting:components.customPayload.additionalCustomPayload')}</div>
        )
      }
    />
  );

  function getRowIndex(payloadField: Item) {
    return form
      .get('customPayloadFields')
      .reduce((acc: number, item: Item, i: number) => (item === payloadField ? i : acc), -1);
  }

  function updateIn(paths: (string | number)[], changeField: (item: Item) => Item) {
    if (!setForm) {
      return;
    }
    setForm(
      form.updateIn(['customPayloadFields', ...paths] as unknown as [number, string], f =>
        changeField(f).setTouched(true)
      )
    );
  }

  function deleteRow(payloadField: MapForm<any>) {
    const entryPosition = getRowIndex(payloadField);
    if (!setForm) {
      return;
    }
    if (entryPosition >= 0) {
      setForm(form.updateIn(['customPayloadFields'], f => f.remove(entryPosition).setTouched(true)));
    }
  }

  function addRow() {
    if (!setForm) {
      return;
    }
    setForm(form.updateIn(['customPayloadFields'], f => f.push(createNewFormEntry()).setTouched(true)));
  }
}

function getStaticPayload(formItem: MapForm<any>[]) {
  return formItem.filter((item: CreateListFormOpts<any>) => item.items.type.value == 'staticString');
}
