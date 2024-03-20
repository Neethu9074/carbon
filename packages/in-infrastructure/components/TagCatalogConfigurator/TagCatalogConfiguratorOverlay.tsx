/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, ListForm, createField, createListForm } from 'formalistic';
import React, { useEffect, useState, useMemo } from 'react';

import TagCatalogConfiguratorOverlayPresenter from 'in-infrastructure/components/TagCatalogConfigurator/TagCatalogConfiguratorOverlayPresenter';
import { Tracking } from 'in-infrastructure/components/TagCatalogConfigurator/Tracking';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { t } from 'in-i18n';

interface TagCatalogConfiguratorOverlayProps {
  readonly onChange: (tags: string[]) => void;
  readonly values: string[];
  readonly maximumNumberOfTags?: number;
  readonly tracking?: Tracking;
  readonly tagCatalog: EnrichedTagCatalog;
}

export default function TagCatalogConfiguratorOverlay({
  onChange: onChangeExternal,
  values,
  maximumNumberOfTags = 5,
  tracking,
  tagCatalog
}: TagCatalogConfiguratorOverlayProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialForm = useMemo(() => getInitialForm(values, maximumNumberOfTags), [maximumNumberOfTags]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialForm !== form) {
      onChangeExternal(form.toJS());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (form.size === 0 && values.length !== 0) {
      setForm(getInitialForm(values, maximumNumberOfTags));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
  return (
    <TagCatalogConfiguratorOverlayPresenter
      form={form}
      onChange={onChange}
      maximumNumberOfTags={maximumNumberOfTags}
      onSwap={onSwap}
      onAddItem={onAddItem}
      onRemoveItem={onRemoveItem}
      shouldTriggerWindowResize
      tagCatalog={tagCatalog}
    />
  );

  function onRemoveItem(tag: string, index: number) {
    tracking?.onTagRemoved?.(tag);
    onChange(form => form.remove(index).setTouched(false));
  }

  function onAddItem(tag: string) {
    onChange(form => form.push(getTagItem(tag)).setTouched(false));
    tracking?.onTagAdded?.(tag);
  }

  function onSwap(sourceIndex: number, destinationIndex: number) {
    onChange(form => {
      const tag = form.get(sourceIndex);
      return tag ? form.remove(sourceIndex).insert(destinationIndex, tag) : form;
    });
  }

  function onChange(fn: (form: ListForm<Field<string>[]>) => ListForm<Field<string>[]>) {
    setForm(fn(form));
  }

  function getInitialForm(values: string[], maximumNumberOfTags: number) {
    return createListForm({
      validator: tags => {
        if (tags.length > maximumNumberOfTags) {
          return [
            {
              severity: 'error',
              message: t('in-infrastructure:tagConfigurator.messagePleaseSelectAtMostTags', {
                maximumNumberOfTags: maximumNumberOfTags
              })
            }
          ];
        }
        return null;
      },

      items: values.map(tag => getTagItem(tag))
    });
  }

  function getTagItem(tag: string) {
    return createField({
      value: tag || '',
      validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
    });
  }
}
