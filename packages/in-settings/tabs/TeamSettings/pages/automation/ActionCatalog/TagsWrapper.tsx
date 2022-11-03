/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { SvgIcon } from '@instana/components';

// @ts-expect-error
import TagsTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsTable';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { Tag } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './TagsWrapper.mless';

interface AlertConfigCustomPayloadProps {
  form: MapForm;
  onChange: Function;
  setForm: (form: MapForm) => void;
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
              const tags = (tagsField as Field<Tag[]>)?.value;
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

export default function AlertConfigCustomPayload({ form, setForm, onChange }: AlertConfigCustomPayloadProps) {
  const tableColumnDefinitions = [keyColumnDefinition(form, onChange), deleteItemColumnDefinition];
  const tags = (form?.get('tags') as Field<Tag[]>).value;
  const data = {
    // Parent component would only render if 'result has no errors' or 'result not loading'. Passing loading and errors param accordingly.
    progress: {
      loading: false
    },
    errors: [],
    data: {
      items: tags ?? [],
      // Show all tags
      page: 1,
      pageSize: tags?.length ?? 0,
      totalHits: tags?.length ?? 0
    }
  };

  return <TagsTable columnDefinitions={tableColumnDefinitions} addRow={addRow} deleteRow={deleteRow} result={data} />;

  function deleteRow(id: string) {
    const rowIndex = (form?.get('tags') as Field<Tag[]>).value.reduce(
      (acc: number, item: Tag, i: number) => (item.id === id ? i : acc),
      -1
    );
    if (rowIndex >= 0) {
      setForm(
        form.updateIn(['tags'], f => {
          const castedF = f as Field<Tag[]>;
          const value = [...castedF.value];
          value.splice(rowIndex, 1);
          return castedF.setValue(value).setTouched(true);
        })
      );
    }
  }

  function addRow() {
    setForm(
      form.updateIn(['tags'], f => {
        const castedF = f as Field<Tag[]>;
        const value = castedF.value;
        return castedF.setValue([...value, { value: '', id: generateUniqueShortId() }]).setTouched(false);
      })
    );
  }
}
