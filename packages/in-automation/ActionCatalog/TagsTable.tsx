/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field } from 'formalistic';
import React, { ChangeEvent } from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { ActionFormEntity } from 'in-automation/ActionCatalog/Action';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './ServerTablePresenterWrapperConsumer.mless';

interface TagsTableProps {
  form: MapForm<any>;
  onChange: OnEntityChange<ActionFormEntity>;
  setForm: SetFormFunction;
  isEditable?: boolean;
}

export interface Tag {
  id: string;
  value: string;
}

const getColumnDefinitions = ({
  form,
  onChange,
  isNotEditable
}: Omit<TagsTableProps, 'setForm'> & { isNotEditable: boolean }) => [
  {
    id: 'id',
    sortable: false,
    label: t('in-automation:tags'),
    getContent(item: Tag) {
      const tagsField = form.get('tags');
      return (
        <>
          <HorizontalFlexWrapper className={locals.colName}>
            <Input
              className={locals.key}
              value={item.value}
              disabled={isNotEditable}
              hasError={!tagsField?.valid && tagsField?.touched && item.value === ''}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
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
        </>
      );
    }
  }
];

export default function TagsTable({ form, setForm, onChange, isEditable = true }: TagsTableProps) {
  const isNotEditable = !isEditable;
  const columnDefinitions = getColumnDefinitions({ form, onChange, isNotEditable });
  const tags = (form.get('tags') as Field<Tag[]>).value;

  return (
    <ServerTablePresenterWrapper
      columnDefinitions={columnDefinitions}
      data={tags}
      form={form}
      formKey="tags"
      defaultRow={''}
      setForm={setForm}
      isEditable={isEditable}
      noDataMessage={t('in-automation:noTagsConfigured')}
    />
  );
}
