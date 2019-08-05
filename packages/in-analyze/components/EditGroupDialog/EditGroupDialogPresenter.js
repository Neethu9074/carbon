import CreatableSelect from 'react-select/lib/Creatable';
import React from 'react';

import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { emptyArray } from 'in-services/fixedObjects';
import FormGroup from 'in-components/form/FormGroup';
import Dialog from 'in-new-components/Dialog';
import Button from 'in-new-components/Button';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';

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
  help
}) {
  return (
    <Dialog title="Group" onClose={onClose} showOverflow>
      <form onSubmit={onSubmit} autoComplete="off">
        <p className={locals.help}>{help}</p>

        {form.get('tag').map(field => (
          <FormGroup>
            <Label htmlFor="filter-tag" hasError={!field.valid && field.touched}>
              Tag
            </Label>
            <ComboBox
              id="filter-tag"
              value={field.value || ''}
              options={tagSuggestions.map(s => ({
                value: s,
                label: s
              }))}
              onChange={e => onTagChange(e ? e.value : tagSuggestions[0])}
              autoFocus
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
                {keySuggestionsLoading && <Loading>Loading suggestions…</Loading>}
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

        <div className={locals.actions}>
          <Button type="submit" kind="primaryv2" disabled={form.touched && !form.hierarchyValid}>
            Save
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
      <SvgIcon type="spinner" size="xxs" spinning className={locals.loadingIcon} />
      {children}
    </span>
  );
}
