import CreatableSelect from 'react-select/lib/Creatable';
import React from 'react';

import { TAG_TYPES, getOperatorLabel } from 'in-analyze/applicationFilter';
import { evaluateClassNames } from 'in-services/util/classnames';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { joinClassNames } from 'in-services/util/classnames';
import { getTagCategories } from 'in-applications/tags';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input/Input';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-new-components/Button';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes/theme';

import locals from './AnalyzeFilterForm.mless';

export default function AnalyzeFilterForm({ children }) {
  return <div className={locals.editForm}>{children}</div>;
}

export function KeyListGroup({ field, children }) {
  return (
    <FormGroup>
      <ol className={locals.keyList}>{children}</ol>
      <TouchedMessages field={field} />
    </FormGroup>
  );
}

export function KeyPart({ children }) {
  return <li className={locals.key}>{children}</li>;
}

export function SelectBox({ options, id, value, onChange }) {
  return (
    <ComboBox
      id={id}
      value={value}
      onChange={e => onChange(e.value ? e : { value: '' })}
      autoComplete="off"
      options={options}
      clearable={false}
    />
  );
}

export function FieldSeperator({ children }) {
  return (
    <Pill className={locals.fieldSeperator} color={theme.lib.colors.N500}>
      {children}
    </Pill>
  );
}

export function ValueGroup({ className, field, children }) {
  return (
    <FormGroup className={joinClassNames(locals.valueFormGroup, className)}>
      {children}
      <TouchedMessages field={field} />
    </FormGroup>
  );
}

export function AutoCompletedSelect({ field, onChange, autoCompletedOptions }) {
  let isValueInsideOptions = false;
  if (field.value) {
    for (let i = 0; i < autoCompletedOptions.length; i++) {
      const option = autoCompletedOptions[i];
      if (option.value === field.value) {
        isValueInsideOptions = true;
        break;
      }
    }
  } else {
    isValueInsideOptions = true;
  }

  if (!isValueInsideOptions) {
    autoCompletedOptions = [{ label: field.value, value: field.value }].concat(autoCompletedOptions);
  }

  return (
    <CreatableSelect
      id="value"
      value={field.value}
      onChange={e => onChange('value', e ? e.value : '')}
      options={autoCompletedOptions}
      placeholder=""
      isClearable
      autoFocus
      searchable
    />
  );
}

export function FixedSelection({ value }) {
  return <Input className={locals.fixedValue} id={value} value={value} autoComplete="off" disabled />;
}

export function TagCategorySwitcher({ selectedCategory, setSelectedCategory }) {
  const categories = getTagCategories();
  return (
    <ul className={locals.categoryList}>
      <li>
        <Button
          className={evaluateClassNames({
            [locals.categoryButton]: true,
            [locals.activeCategoryButton]: !selectedCategory
          })}
          kind="secondary"
          onClick={selectedCategory ? () => setSelectedCategory(null) : null}
        >
          All
        </Button>
      </li>

      {categories.map(category => {
        const isActive = category === selectedCategory;
        return (
          <li key={category}>
            <Button
              className={evaluateClassNames({
                [locals.categoryButton]: true,
                [locals.activeCategoryButton]: isActive
              })}
              kind="secondary"
              onClick={isActive ? null : () => setSelectedCategory(category)}
            >
              {category.toLowerCase()}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export function NamedSection({ name, children }) {
  return (
    <div className={locals.namedSection}>
      <span className={locals.name}>{name}</span>
      <div className={locals.content}>{children}</div>
    </div>
  );
}

export function OperatorSelection({ field, onChange, node }) {
  const operators = TAG_TYPES[node.type].operators;
  if (operators.length === 1) {
    return (
      <input
        className={locals.fixedOperator}
        type="text"
        id="operator"
        value={getOperatorLabel(node.type, operators[0])}
        disabled
      />
    );
  }

  return (
    <select
      className={locals.operator}
      id="operator"
      value={field.value}
      onChange={e => onChange('operator', e.target.value)}
    >
      {operators.map(operator => (
        <option key={operator} value={operator}>
          {getOperatorLabel(node.type, operator)}
        </option>
      ))}
    </select>
  );
}
