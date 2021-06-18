/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, SvgIcon } from '@instana/components';

import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import { TAG_TYPES, getOperatorLabel } from 'in-analyze/applicationFilter';
import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { emptyArray } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './KeyValueBarOverlayPresenter.mless';
import 'in-components/ComboBox/ComboBox.less';

export default function KeyValueBarOverlayPresenter({
  tagFilters,
  onRemoveTagFilter,
  tag,
  form,
  onSubmit,
  onKeyChange,
  keySuggestionsLoading,
  keySuggestions,
  onSecondLevelKeyChange,
  secondLevelKeySuggestionsLoading,
  secondLevelKeySuggestions,
  onValueChange,
  valueSuggestionsLoading,
  valueSuggestions,
  onOperatorChange
}) {
  const keyValueFilters = tag ? tagFilters.filter(f => f.name === tag) : tagFilters;
  const hasValue = form.containsKey('value');
  const hasSecondLevelKey = form.containsKey('secondLevelName');
  const columnWidth = hasSecondLevelKey ? 4 : 6;
  const applyButtonOffset = hasSecondLevelKey ? (hasValue ? 4 : 8) : hasValue ? 0 : 6;

  return (
    <BarOverlay extraWide={!hasSecondLevelKey} extraExtraWide={hasSecondLevelKey} allowOverflow>
      <form onSubmit={onSubmit} autoComplete="off">
        <ul className={locals.filterList}>
          {keyValueFilters.map((f, i) => {
            const [key, value, secondLevelKey] = tag
              ? f.stringValue.split('=', 2)
              : [f.name, f.value, f.secondLevelName];
            const operator = getOperatorLabel('KEY_VALUE_PAIR', f.operator || 'EQUALS');
            return (
              <li key={i} className={locals.filter}>
                <Tooltip content={`${key} ${operator} ${value}`}>
                  <span className={locals.filterLabel}>
                    <Segment>{key}</Segment>
                    {secondLevelKey && <Segment> : {secondLevelKey}</Segment>}
                    <Operator>{operator}</Operator>
                    <Segment>{value}</Segment>
                  </span>
                </Tooltip>
                <Tooltip content={t('in-analyze:filterBar.keyValueBarItem.tooltip')}>
                  <SvgIcon
                    type="lib_openclose_cancel"
                    size="xs"
                    className={locals.removeIcon}
                    onClick={() => onRemoveTagFilter(f)}
                  />
                </Tooltip>
              </li>
            );
          })}
        </ul>

        {keyValueFilters.length > 0 && <hr className={locals.separator} />}

        <Row>
          <Col xs={columnWidth}>
            {form.get('key').map(field => (
              <FormGroup withoutBottomMargin>
                <Label htmlFor="filter-key" hasError={!field.valid && field.touched} className={locals.labelWithLoader}>
                  {t('in-analyze:components.filterBar.key')}
                  {keySuggestionsLoading && (
                    <Loading>{t('in-analyze:components.filterBar.loadingSuggestions')}</Loading>
                  )}
                </Label>
                <CreatableComboBox
                  id="filter-key"
                  options={ensureCreatedOptionExists(keySuggestions || emptyArray, field.value).map(s => ({
                    value: s,
                    label: s
                  }))}
                  onChange={e => onKeyChange(e ? e.value : '')}
                  placeholder=""
                  openMenuOnFocus
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
          {hasSecondLevelKey && (
            <Col xs={columnWidth}>
              {form.get('secondLevelName').map(field => (
                <FormGroup withoutBottomMargin>
                  <Label
                    htmlFor="filter-second-level-key"
                    hasError={!field.valid && field.touched}
                    className={locals.labelWithLoader}
                  >
                    {t('in-analyze:components.filterBar.key')}
                    {secondLevelKeySuggestionsLoading && (
                      <Loading>{t('in-analyze:components.filterBar.loadingSuggestions')}</Loading>
                    )}
                  </Label>
                  <CreatableComboBox
                    id="filter-second-level-key"
                    options={ensureCreatedOptionExists(secondLevelKeySuggestions || emptyArray, field.value).map(s => ({
                      value: s,
                      label: s
                    }))}
                    onChange={e => onSecondLevelKeyChange(e ? e.value : '')}
                    placeholder=""
                    openMenuOnFocus
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}
            </Col>
          )}
          <Col xs={columnWidth}>
            {form.get('operator').map(field => (
              <FormGroup withoutBottomMargin>
                <Label htmlFor="filter-operator" hasError={!field.valid && field.touched}>
                  {t('in-analyze:components.filterBar.operator')}
                </Label>
                <Select
                  id="filter-operator"
                  value={field.value || 'EQUALS'}
                  onChange={onOperatorChange}
                  hasError={!field.valid && field.touched}
                >
                  {TAG_TYPES.KEY_VALUE_PAIR.operators.map(operator => (
                    <option key={operator} value={operator}>
                      {getOperatorLabel('KEY_VALUE_PAIR', operator)}
                    </option>
                  ))}
                </Select>
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        </Row>
        <Row>
          {hasValue && (
            <Col xs={columnWidth}>
              {form.get('value').map(field => (
                <FormGroup withoutBottomMargin>
                  <Label
                    htmlFor="filter-value"
                    hasError={!field.valid && field.touched}
                    className={locals.labelWithLoader}
                  >
                    {t('in-analyze:components.filterBar.value')}
                    {valueSuggestionsLoading && (
                      <Loading>{t('in-analyze:components.filterBar.loadingSuggestions')}</Loading>
                    )}
                  </Label>
                  <CreatableComboBox
                    id="filter-value"
                    options={ensureCreatedOptionExists(valueSuggestions || emptyArray, field.value).map(s => ({
                      value: s,
                      label: s
                    }))}
                    onChange={e => onValueChange(e ? e.value : '')}
                    placeholder=""
                    openMenuOnFocus
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}
            </Col>
          )}
          <Col xs={columnWidth} xsOffset={applyButtonOffset} className={locals.create}>
            <Button type="submit" kind="create" disabled={form.touched && !form.hierarchyValid}>
              {t('in-analyze:components.filterBar.addFilter')}
            </Button>
          </Col>
        </Row>
      </form>
    </BarOverlay>
  );
}

function ensureCreatedOptionExists(items, value) {
  if (isBlank(value) || items.indexOf(value) !== -1) {
    return items;
  }
  return items.concat(value).sort(compareIgnoreCase);
}

function Segment({ children }) {
  return <span className={locals.segment}>{children}</span>;
}

function Operator({ children }) {
  return <span className={locals.operator}>{children}</span>;
}

function Loading({ children }) {
  return (
    <span className={locals.loading}>
      <SvgIcon type="lib_actions_loading" size="xs" spinning className={locals.loadingIcon} />
      {children}
    </span>
  );
}
