/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import { SvgIcon } from '@instana/components';

import DummyServerTablePresenter, {
  DeleteRow
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/DummyServerTablePresenter';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { OnChange, SetForm } from 'in-settings/tabs/TeamSettings/pages/automation/useEntityForm';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './DummyServerTablePresenterConsumer.mless';

interface TagsTableProps {
  form: MapForm;
  onChange: OnChange<ActionFormEntity>;
  setForm: SetForm;
}

export interface Tag {
  id: string;
  value: string;
}

const getColumnDefinitions = ({ form, onChange }: Omit<TagsTableProps, 'setForm'>) => [
  {
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
  },
  {
    id: 'deleteRow',
    width: '5',
    sortable: false,
    label: '',
    getContent(item: Tag, { deleteRow }: { deleteRow: DeleteRow }) {
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-alerting:components.customPayload.deleteRow')}>
            <SvgIcon type="lib_actions_delete" className={locals.delete} onClick={() => deleteRow(item.id)} />
          </Tooltip>
        </div>
      );
    }
  }
];

export default function TagsTable({ form, setForm, onChange }: TagsTableProps) {
  const columnDefinitions = getColumnDefinitions({ form, onChange });
  const tags = (form.get('tags') as Field<Tag[]>).value;

  return (
    <DummyServerTablePresenter
      columnDefinitions={columnDefinitions}
      data={tags}
      form={form}
      formKey="tags"
      defaultRow={''}
      setForm={setForm}
      noDataMessage={t('in-settings:tabs.noTagsConfigured')}
    />
  );
}
