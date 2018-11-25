import React from 'react';

import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import { TAG_TYPES, getOperatorLabel } from 'in-analyze/applicationFilter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './KeyValueBarOverlayPresenter.mless';

export default function KeyValueBarOverlayPresenter({
  tagFilters,
  onRemoveTagFilter,
  tag,
  form,
  onSubmit,
  onKeyChange,
  keySuggestionsLoading,
  onValueChange,
  valueSuggestionsLoading,
  onOperatorChange
}) {
  const keyValueFilters = tagFilters.filter(f => f.name === tag);

  return (
    <BarOverlay extraWide>
      <form onSubmit={onSubmit}>
        <ul className={locals.filterList}>
          {keyValueFilters.map((f, i) => {
            const [key, value] = f.stringValue.split('=', 2);
            const operator = getOperatorLabel('KEY_VALUE_PAIR', f.operator || 'EQUALS');
            return (
              <li key={i} className={locals.filter}>
                <Tooltip content={`${key} ${operator} ${value}`}>
                  <span className={locals.filterLabel}>
                    <Segment>{key}</Segment> <Operator>{operator}</Operator> <Segment>{value}</Segment>
                  </span>
                </Tooltip>
                <Tooltip content="Remove filter">
                  <SvgIcon
                    type="lib_openclose_cancel"
                    width={16}
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
          <Col xs={6}>
            {form.get('key').map(field => (
              <FormGroup withoutBottomMargin>
                <Label htmlFor="filter-key" hasError={!field.valid && field.touched} className={locals.labelWithLoader}>
                  Key
                  {keySuggestionsLoading && <Loading>Loading suggestions…</Loading>}
                </Label>
                <Input
                  id="filter-key"
                  value={field.value || ''}
                  onChange={onKeyChange}
                  hasError={!field.valid && field.touched}
                  autoFocus
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
          <Col xs={6}>
            {form.get('value').map(field => (
              <FormGroup withoutBottomMargin>
                <Label
                  htmlFor="filter-value"
                  hasError={!field.valid && field.touched}
                  className={locals.labelWithLoader}
                >
                  Value
                  {valueSuggestionsLoading && <Loading>Loading suggestions…</Loading>}
                </Label>
                <Input
                  id="filter-value"
                  value={field.value || ''}
                  onChange={onValueChange}
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            {form.get('operator').map(field => (
              <FormGroup withoutBottomMargin>
                <Label htmlFor="filter-operator" hasError={!field.valid && field.touched}>
                  Operator
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
          <Col xs={6} className={locals.create}>
            <Button type="submit" kind="create" disabled={form.touched && !form.hierarchyValid}>
              Add Filter
            </Button>
          </Col>
        </Row>
      </form>
    </BarOverlay>
  );
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
      <SvgIcon type="spinner" width={10} spinning className={locals.loadingIcon} />
      {children}
    </span>
  );
}
