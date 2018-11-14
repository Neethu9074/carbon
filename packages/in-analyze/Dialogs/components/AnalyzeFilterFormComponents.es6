import CreatableSelect from 'react-select/lib/Creatable';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { TAG_TYPES, getOperatorLabel } from 'in-analyze/applicationFilter';
import ValidationBlock from 'in-components/form/ValidationBlock';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input/Input';
import ComboBox from 'in-components/ComboBox';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes/theme';

import locals from './AnalyzeFilterFormComponents.mless';

export function FlexWrapper({ children }) {
  return <div className={locals.flexWrapper}>{children}</div>;
}

export function HelpText({ children }) {
  return <p className={locals.helpText}>{children}</p>;
}

export function NamedSection({ name, children }) {
  return (
    <div className={locals.namedSection}>
      <span className={locals.namedSectionName}>{name}</span>
      <div className={locals.namedSectionContent}>{children}</div>
    </div>
  );
}

export function KeySelectionSection(props) {
  const { field, onChange, messages, keys } = props;
  const options = keys.map(key => ({
    label: key,
    value: key
  }));

  return (
    <FormGroup className={locals.keyGroup}>
      <SelectBox
        id="key"
        value={field.value}
        onChange={e => onChange(get(findSubTreeByFullyQualifiedName(e.value), ['fullyQualifiedName'], ''))}
        options={options}
      />
      {messages.filter(message => message.field === 'name').map((message, i) => (
        <ValidationBlock key={i} className={locals.validationMessage}>
          {message.message}
        </ValidationBlock>
      ))}
    </FormGroup>
  );
}

export function CustomKeySection({ form, onChange, node, tagSecondLevelNameSuggestionResult }) {
  if (!node || node.type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    return null;
  }

  return (
    <Fragment>
      <FieldSeperator>:</FieldSeperator>
      {form.get('nameForm').map(subForm =>
        subForm.value.get('secondLevelName').map(field => (
          <FormGroup className={locals.customKeyGroup}>
            <AutoCompletedSelect
              id="secondLevelName"
              field={field}
              onChange={onChange}
              tagSuggestionResult={tagSecondLevelNameSuggestionResult}
            />
            <TouchedMessages field={subForm} className={locals.validationMessage} />
          </FormGroup>
        ))
      )}
    </Fragment>
  );
}

export function OperatorSelection({ field, onChange, node, withExtendedOperators }) {
  if (!node) {
    return <input className={locals.fixedOperator} type="text" id="operator" value="equals" disabled />;
  }

  const operators = withExtendedOperators
    ? TAG_TYPES[node.type].operators.concat(TAG_TYPES[node.type].extendedOperators)
    : TAG_TYPES[node.type].operators;
  if (operators.length === 1) {
    return (
      <input
        className={locals.fixedOperator}
        type="text"
        id="operator"
        autoComplete="off"
        value={getOperatorLabel(node.type, operators[0])}
        disabled
      />
    );
  }

  return (
    <select className={locals.operator} id="operator" value={field.value} onChange={e => onChange(e.target.value)}>
      {operators.map(operator => (
        <option key={operator} value={operator}>
          {getOperatorLabel(node.type, operator)}
        </option>
      ))}
    </select>
  );
}

export function SelectBox({ options, id, value, onChange }) {
  return (
    <ComboBox
      id={id}
      value={value}
      onChange={e => onChange(e && e.value ? e : { value: '' })}
      autoComplete="off"
      options={options}
      clearable={false}
      autoFocus
      openOnFocus
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

export function AutoCompletedSelect({ field, onChange, tagSuggestionResult }) {
  if (!tagSuggestionResult) {
    return (
      <Input
        type="text"
        id="value"
        value={field.value}
        autoComplete="off"
        onChange={e => onChange(e ? e.target.value : '')}
      />
    );
  } else {
    let autoCompletedOptions = get(tagSuggestionResult, ['data', 'suggestions'], []).map(suggestion => ({
      value: suggestion,
      label: suggestion
    }));

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
      <div className={locals.loadingSelectPlaceholder}>
        <CreatableSelect
          id="value"
          className={locals.loadingSelectPlaceholderInput}
          value={field.value}
          onChange={e => onChange(e ? e.value : '')}
          options={autoCompletedOptions}
          placeholder=""
          isClearable
          autoFocus
          searchable
          menuIsOpen
        />
        {get(tagSuggestionResult, ['progress', 'loading'], false) && (
          <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning width={24} height={24} />
        )}
        {get(tagSuggestionResult, ['errors', 'length']) > 0 && (
          <Tooltip
            themeStyle="light"
            align="bottomMiddle"
            content="Suggestions currently not available, please type in the value"
          >
            <SvgIcon className={locals.errorIcon} type="lib_help_error_error_outline" width={24} height={24} />
          </Tooltip>
        )}
      </div>
    );
  }
}
