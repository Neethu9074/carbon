/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { SetStateAction } from 'react';
import { MapForm, Field } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';
import { SvgIcon } from '@instana/components';

import DummyServerTablePresenter from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/DummyServerTablePresenter';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { Tag } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './TagsTable.mless';

interface TagsTableProps {
  form: MapForm;
  onChange: Function;
  setForm: (form: MapForm) => SetStateAction<MapForm>;
}

const keyColumnDefinition = (form: MapForm, onChange: Function) => ({
  id: 'id',
  sortable: false,
  label: t('in-settings:tabs.tags'),
  getContent(item: Tag) {
    const tagsField = form.get('tags');
    return (
      <FormGroup>
        <HorizontalFlexWrapper className={locals.colName}>
          <Input
            className={locals.key}
            value={item.value}
            hasError={!tagsField?.valid && tagsField?.touched && item.value === ''}
            onChange={({ target }: any) => {
              const tags = (tagsField as Field<List<Tag>>)?.value;
              onChange(
                'tags',
                tags.map(tag =>
                  tag?.id === item.id
                    ? {
                        id: tag.id,
                        value: target.value
                      }
                    : tag
                )
              );
            }}
            maxLength={128}
          />
        </HorizontalFlexWrapper>
        {item.value === '' && <TouchedMessages field={tagsField} />}
      </FormGroup>
    );
  }
});

const deleteItemColumnDefinition = {
  id: 'deleteRow',
  width: '5',
  sortable: false,
  label: '',
  getContent(item: Tag, { deleteRow }: { deleteRow: Function }) {
    return (
      <div className={locals.controls}>
        <Tooltip content={t('in-alerting:components.customPayload.deleteRow')}>
          <SvgIcon type="lib_actions_delete" className={locals.delete} onClick={() => deleteRow(item.id)} />
        </Tooltip>
      </div>
    );
  }
};

export default function TagsTable({ form, setForm, onChange }: TagsTableProps) {
  const tableColumnDefinitions = [keyColumnDefinition(form, onChange), deleteItemColumnDefinition];
  const tags = (form?.get('tags') as Field<List<Tag>>)?.value?.toJS();

  return (
    <DummyServerTablePresenter<Tag>
      columnDefinitions={tableColumnDefinitions}
      addRow={addRow}
      deleteRow={deleteRow}
      data={tags}
      noDataMessage={t('in-settings:tabs.noTagsConfigured')}
    />
  );

  function deleteRow(id: string) {
    const rowIndex = form
      ?.get('tags')
      ?.toJS()
      .reduce((acc: number, item: Tag, i: number) => (item.id === id ? i : acc), -1);
    if (rowIndex >= 0) {
      setForm(
        form.updateIn(['tags'], f => {
          const castedF = f as Field<List<Tag>>;
          const value = castedF.value;
          return castedF.setValue(value.remove(rowIndex)).setTouched(true);
        })
      );
    }
  }

  function addRow() {
    setForm(
      form.updateIn(['tags'], f => {
        const castedF = f as Field<List<Tag>>;
        const value = castedF.value;
        return castedF.setValue(value.push({ value: '', id: generateUniqueShortId() })).setTouched(false);
      })
    );
  }
}
