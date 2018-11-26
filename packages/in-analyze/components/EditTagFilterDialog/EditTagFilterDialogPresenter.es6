import CreatableSelect from 'react-select/lib/Creatable';
import React from 'react';

import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { evaluateClassNames } from 'in-services/util/classnames';
import { emptyArray } from 'in-services/fixedObjects';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Dialog from 'in-new-components/Dialog';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EditTagFilterDialogPresenter.mless';

export default function EditTagFilterDialogPresenter({
  onClose,
  editMode,
  form,
  onSubmit,
  // selectedTagType,
  tagSuggestions,
  onTagChange,
  operatorSuggestions,
  onOperatorChange,
  keySuggestions,
  keySuggestionsLoading,
  onKeyChange,
  valueSuggestions,
  valueSuggestionsLoading,
  onValueChange,
  onRemoveTagFilter
}) {
  return (
    <Dialog title={editMode ? 'Edit Filter' : 'Add Filter'} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <p className={locals.help}>Select a tag by which your calls should be filtered. Tags are case-sensitive.</p>

        {form.get('tag').map(field => (
          <FormGroup>
            <Label htmlFor="filter-tag" hasError={!field.valid && field.touched}>
              Tag
            </Label>
            <Select
              id="filter-tag"
              value={field.value}
              onChange={e => onTagChange(e.target.value)}
              autoFocus
              hasError={!field.valid && field.touched}
            >
              {tagSuggestions.map(tag => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </Select>
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

        {form.get('operator').map(field => (
          <FormGroup>
            <Label htmlFor="filter-operator" hasError={!field.valid && field.touched}>
              Operator
            </Label>
            <Select
              id="filter-operator"
              value={field.value}
              onChange={e => onOperatorChange(e.target.value)}
              hasError={!field.valid && field.touched}
            >
              {operatorSuggestions.map(tag => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </Select>
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {form.get('value').map(field => (
          <FormGroup>
            <Label htmlFor="filter-value" hasError={!field.valid && field.touched} className={locals.labelWithLoader}>
              Value
              {valueSuggestionsLoading && <Loading>Loading suggestions…</Loading>}
            </Label>
            <CreatableSelect
              id="filter-value"
              className={locals.loadingSelectPlaceholderInput}
              value={field.value || ''}
              options={ensureCreatedOptionExists(valueSuggestions || emptyArray, field.value).map(s => ({
                value: s,
                label: s
              }))}
              onChange={e => onValueChange(e ? e.value : '')}
              placeholder=""
              isClearable
              openOnFocus
              searchable
              menuIsOpen
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        <div
          className={evaluateClassNames({
            [locals.actions]: true,
            [locals.onlyOneAction]: !editMode
          })}
        >
          {editMode && (
            <Button type="button" kind="danger" onClick={onRemoveTagFilter}>
              Remove Filter
            </Button>
          )}

          <Button
            type="submit"
            kind={editMode ? 'create' : 'primaryv2'}
            disabled={form.touched && !form.hierarchyValid}
          >
            {editMode ? 'Save Filter' : 'Add Filter'}
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
      <SvgIcon type="spinner" width={10} spinning className={locals.loadingIcon} />
      {children}
    </span>
  );
}
