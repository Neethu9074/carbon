/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import CreatableSelect from 'react-select/lib/Creatable';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { SvgIcon } from '@instana/components';

import { TAG_TYPES, getOperatorLabel } from 'in-analyze/applicationFilter';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input/Input';
import ComboBox from 'in-components/ComboBox';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

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

export function KeySelectionSection({ keys, value, onChange, messages, autoFocus }) {
  const options = keys.map(key => ({
    label: key,
    value: key
  }));

  return (
    <FormGroup className={locals.keyGroup}>
      <SelectBox
        id="key"
        value={value}
        onChange={e => onChange(get(findSubTreeByFullyQualifiedName(e?.value), ['fullyQualifiedName'], ''))}
        options={options}
        autoFocus={autoFocus}
      />
      {messages.map((message, i) => (
        <ValidationBlock key={i} className={locals.validationMessage}>
          {message.message}
        </ValidationBlock>
      ))}
    </FormGroup>
  );
}

export function CustomKeySection({ value, messages, onChange, node, tagSecondLevelNameSuggestionResult }) {
  if (!node || node.type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
    return null;
  }

  return (
    <Fragment>
      <FieldSeperator>:</FieldSeperator>
      {
        <FormGroup className={locals.customKeyGroup}>
          <AutoCompletedSelect
            id="secondLevelName"
            value={value}
            onChange={onChange}
            tagSuggestionResult={tagSecondLevelNameSuggestionResult}
          />
          {messages.map((message, i) => (
            <ValidationBlock key={i} className={locals.validationMessage}>
              {message.message}
            </ValidationBlock>
          ))}
        </FormGroup>
      }
    </Fragment>
  );
}

export function OperatorSelection({ value, onChange, node, disabledOperators }) {
  if (!node) {
    return <input className={locals.fixedOperator} type="text" id="operator" value="equals" disabled />;
  }

  const operators = TAG_TYPES[node.type].operators.filter(
    operator => !disabledOperators || !disabledOperators.includes(operator)
  );
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
    <select className={locals.operator} id="operator" value={value} onChange={e => onChange(e.target.value)}>
      {operators.map(operator => (
        <option key={operator} value={operator}>
          {getOperatorLabel(node.type, operator)}
        </option>
      ))}
    </select>
  );
}

export function ValueInput(props) {
  const messages = props.messages;
  return (
    <FormGroup className={locals.valueFormGroup}>
      <ValueInputByType {...props} />
      {messages.map((message, i) => (
        <ValidationBlock key={i} className={locals.validationMessage}>
          {message.message}
        </ValidationBlock>
      ))}
    </FormGroup>
  );
}

function ValueInputByType({ tagKey, value, onChange, tagSuggestionResult }) {
  const nodeInTree = findSubTreeByFullyQualifiedName(tagKey);
  const type = nodeInTree ? nodeInTree.type : null;

  if (type === TAG_TYPES.BOOLEAN.technicalName) {
    return (
      <SelectBox
        id="value"
        value={value}
        onChange={e => onChange(e.value)}
        options={[
          { label: t('in-analyze:dialogs.components.analyzeFilterForm.false'), value: 'false' },
          { label: t('in-analyze:dialogs.components.analyzeFilterForm.true'), value: 'true' }
        ]}
      />
    );
  }

  const isNumberInput = type === TAG_TYPES.NUMBER.technicalName ? true : false;
  if (isNumberInput) {
    return (
      <Input
        type="number"
        min={0}
        step="1"
        id="value"
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
        autoFocus
      />
    );
  }

  return (
    <AutoCompletedSelect value={value} onChange={value => onChange(value)} tagSuggestionResult={tagSuggestionResult} />
  );
}

export function SelectBox({ options, id, value, onChange, autoFocus }) {
  return (
    <ComboBox
      id={id}
      value={value}
      onChange={e => onChange(e && e.value ? e : { value: '' })}
      autoComplete="off"
      options={options}
      clearable={false}
      autoFocus={autoFocus}
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

export function AutoCompletedSelect({ value, onChange, tagSuggestionResult }) {
  if (!tagSuggestionResult) {
    return (
      <Input
        type="text"
        id="value"
        value={value}
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
    if (value) {
      for (let i = 0; i < autoCompletedOptions.length; i++) {
        const option = autoCompletedOptions[i];
        if (option.value === value) {
          isValueInsideOptions = true;
          break;
        }
      }
    } else {
      isValueInsideOptions = true;
    }

    if (!isValueInsideOptions) {
      autoCompletedOptions = [{ label: value, value }].concat(autoCompletedOptions);
    }

    return (
      <div className={locals.loadingSelectPlaceholder}>
        <CreatableSelect
          id="value"
          className={locals.loadingSelectPlaceholderInput}
          value={value}
          onChange={e => onChange(e ? e.value : '')}
          options={autoCompletedOptions}
          placeholder=""
          isClearable
          autoFocus
          openOnFocus
          searchable
          menuIsOpen
        />
        {get(tagSuggestionResult, ['progress', 'loading'], false) && (
          <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning />
        )}
        {get(tagSuggestionResult, ['errors', 'length']) > 0 && (
          <Tooltip themeStyle="light" align="bottomMiddle" content={t('in-analyze:dialogs.tooltip')}>
            <SvgIcon className={locals.errorIcon} type="lib_help_error_error_outline" />
          </Tooltip>
        )}
      </div>
    );
  }
}
