/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import CreatableSelect from 'react-select/lib/Creatable';
import classNames from 'classnames';
import React from 'react';

import { getOperatorLabel, entityTypes } from 'in-analyze/applicationFilter';
import RadioGroup from 'in-analyze/components/RadioButtons/RadioGroup';
import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { emptyArray } from 'in-services/fixedObjects';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Typeahead from 'in-new-components/Typeahead';
import Message from 'in-new-components/Message';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import ComboBox from 'in-components/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './EditTagFilterDialogPresenter.mless';

export default function EditTagFilterDialogPresenter({
  onClose,
  editMode,
  form,
  onSubmit,
  selectedTagType,
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
  onEntityChange,
  onRemoveTagFilter,
  tagName,
  tagEntity,
  sourceEntityAvailability,
  forAnalyzeCalls,
  hiddenSourceDestination,
  categoryTitle
}) {
  return (
    <Dialog
      title={
        editMode
          ? t('in-analyze:editTagFilterDialog.dialogTitleEdit')
          : t('in-analyze:editTagFilterDialog.dialogTitleAdd', { filterCategory: categoryTitle || '' })
      }
      onClose={onClose}
      showOverflow
    >
      <form onSubmit={onSubmit} autoComplete="off">
        <Message small className={locals.help} title={t('in-analyze:editTagFilterDialog.messageTitle')} />

        {form.get('tag').map(field => (
          <FormGroup>
            <Label htmlFor="filter-tag" hasError={!field.valid && field.touched}>
              {t('in-analyze:components.editTagFilterDialog.tag')}
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
                  <Loading>{t('in-analyze:components.editTagFilterDialog.loadingSuggestions')}</Loading>
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

        {form.get('operator').map(field => (
          <FormGroup>
            <Label htmlFor="filter-operator" hasError={!field.valid && field.touched}>
              {t('in-analyze:components.editTagFilterDialog.operator')}
            </Label>
            <Select
              id="filter-operator"
              value={field.value}
              onChange={e => onOperatorChange(e.target.value)}
              hasError={!field.valid && field.touched}
            >
              {operatorSuggestions.map((tag, i) => (
                <option value={tag} key={`${tag}${i}`}>
                  {getOperatorLabel(selectedTagType, tag)}
                </option>
              ))}
            </Select>
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {form.get('value') &&
          form.get('value').map(field => (
            <FormGroup>
              <Label htmlFor="filter-value" hasError={!field.valid && field.touched} className={locals.labelWithLoader}>
                Value
                {valueSuggestionsLoading && (
                  <Loading>{t('in-analyze:components.editTagFilterDialog.loadingSuggestions')}</Loading>
                )}
              </Label>
              {(selectedTagType === 'STRING' || selectedTagType === 'KEY_VALUE_PAIR') && (
                <Typeahead
                  options={valueSuggestions || emptyArray}
                  resultsToShow={100}
                  value={field.value}
                  placeholder={t('in-analyze:editTagFilterDialog.placeholder')}
                  onChange={e => onValueChange(e.value.trim())}
                />
              )}
              {selectedTagType === 'BOOLEAN' && (
                <Select
                  id="filter-value"
                  value={field.value}
                  onChange={e => onValueChange(e.target.value)}
                  hasError={!field.valid && field.touched}
                >
                  <option value="true">{t('in-analyze:components.editTagFilterDialog.true')}</option>
                  <option value="false">{t('in-analyze:components.editTagFilterDialog.false')}</option>
                </Select>
              )}
              {selectedTagType === 'NUMBER' && (
                <Input
                  type="number"
                  id="filter-value"
                  value={field.value}
                  min="0"
                  onChange={e => onValueChange(e.target.value)}
                  hasError={!field.valid && field.touched}
                />
              )}
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        {forAnalyzeCalls &&
          !hiddenSourceDestination &&
          form
            .get('entity')
            .map(field => (
              <RadioGroup
                disabled={
                  tagEntity === entityTypes.NOT_APPLICABLE || !sourceEntityAvailability || tagName.startsWith('geo.')
                }
                value={field.value}
                onChange={e => onEntityChange(e.target.value)}
                tagName={tagName}
                sourceEntityAvailability={sourceEntityAvailability}
              />
            ))}
        <div
          className={classNames({
            [locals.actions]: true,
            [locals.onlyOneAction]: !editMode
          })}
        >
          {editMode && (
            <Button type="button" kind="danger" onClick={onRemoveTagFilter}>
              {t('in-analyze:components.editTagFilterDialog.removeFilter')}
            </Button>
          )}

          <Button
            type="submit"
            kind={editMode ? 'primaryv2' : 'create'}
            disabled={form.touched && !form.hierarchyValid}
          >
            {editMode ? t('in-analyze:editTagFilterDialog.saveFilter') : t('in-analyze:editTagFilterDialog.addFilter')}
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
