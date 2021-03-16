/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import CreatableSelect from 'react-select/lib/Creatable';
import React from 'react';

import RadioGroup from 'in-analyze/components/RadioButtons/RadioGroup';
import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { entityTypes } from 'in-analyze/applicationFilter';
import { emptyArray } from 'in-services/fixedObjects';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './EditGroupDialogPresenter.mless';

export default function EditGroupDialogPresenter({
  onClose,
  form,
  onSubmit,
  tagSuggestions,
  onTagChange,
  keySuggestions,
  keySuggestionsLoading,
  onKeyChange,
  onEntityChange,
  help,
  tagName,
  tagEntity,
  sourceEntityAvailability,
  forAnalyzeCalls
}) {
  return (
    <Dialog title={t('in-analyze:components.editGroupDialog.group')} onClose={onClose} showOverflow>
      <form onSubmit={onSubmit} autoComplete="off">
        <Message small className={locals.help} title={help} />
        {form.get('tag').map(field => (
          <FormGroup>
            <Label htmlFor="filter-tag" hasError={!field.valid && field.touched}>
              {t('in-analyze:components.editGroupDialog.tag')}
            </Label>
            <ComboBox
              id="filter-tag"
              value={field.value || ''}
              options={tagSuggestions.map(s => ({
                value: s,
                label: s
              }))}
              onChange={e => onTagChange(e ? e.value : tagSuggestions[0])}
              clearable={false}
              openOnFocus
              searchable
              menuIsOpen
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {form.get('key') &&
          form.get('key').map(field => (
            <FormGroup>
              <Label htmlFor="filter-key" hasError={!field.valid && field.touched} className={locals.labelWithLoader}>
                Key
                {keySuggestionsLoading && (
                  <Loading>{t('in-analyze:components.editGroupDialog.loadingSuggestions')} </Loading>
                )}
              </Label>
              <CreatableSelect
                id="filter-key"
                className={locals.loadingSelectPlaceholderInput}
                value={field.value || ''}
                options={ensureCreatedOptionExists(keySuggestions || emptyArray, field.value).map(s => ({
                  value: s,
                  label: s
                }))}
                onChange={e => onKeyChange(e ? e.value : '')}
                placeholder=""
                isClearable
                openOnFocus
                searchable
                menuIsOpen
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}

        {forAnalyzeCalls &&
          form
            .get('entity')
            .map(field => (
              <RadioGroup
                disabled={
                  tagEntity === entityTypes.NOT_APPLICABLE ||
                  !sourceEntityAvailability ||
                  tagName.includes('beacon.') ||
                  tagName.startsWith('geo.')
                }
                value={field.value}
                onChange={e => onEntityChange(e.target.value)}
                tagName={tagName}
                sourceEntityAvailability={sourceEntityAvailability}
              />
            ))}

        <div className={locals.actions}>
          <Button type="submit" kind="primaryv2" disabled={form.touched && !form.hierarchyValid}>
            {t('in-analyze:components.editGroupDialog.save')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function ensureCreatedOptionExists(items, value) {
  if (isBlank(value) || items.indexOf(value) !== -1) {
    return items;
  }
  return items.concat(value).sort(compareIgnoreCase);
}

function Loading({ children }) {
  return (
    <span className={locals.loading}>
      <SvgIcon type="lib_actions_loading" size="xs" spinning className={locals.loadingIcon} />
      {children}
    </span>
  );
}
