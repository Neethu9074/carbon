import CreatableSelect from 'react-select/lib/Creatable';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FilterConnector from 'in-analyze/Filter/FilterConnector';
import { joinClassNames } from 'in-services/util/classnames';
import { getTagCategories } from 'in-applications/tags';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input/Input';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-new-components/Button';

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
      className={locals.selectBox}
      id={id}
      value={value}
      onChange={e => onChange(e.value ? e : { value: '' })}
      autoComplete="off"
      hasValue={false}
      options={options}
      clearable={false}
    />
  );
}

export function FieldSeperator({ children }) {
  return <FilterConnector className={locals.fieldSeperator}>{children}</FilterConnector>;
}

export function ValueGroup({ className, field, children }) {
  return (
    <FormGroup className={joinClassNames(locals.valueFormGroup, className)}>
      {children}
      <TouchedMessages field={field} />
    </FormGroup>
  );
}

export function AutoCompletedSelect({ field, onValueChanged, autoCompletedOptions }) {
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
      onChange={e => onValueChanged(e ? e.value : '')}
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
