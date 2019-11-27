import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';
import { get } from 'lodash';

import CopyButton from 'in-waiting-for-deployment/components/OnboardingWidget/CopyButton';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { close } from 'in-components/DialogPresenter/store';
import InputComponent from 'in-components/form/Input';
import CodeComponent from 'in-components/Code';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './content.mless';

export function toURLstring(str) {
  return encodeURIComponent(str);
}

export function getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain) {
  return `https://${butlerDomain}/assets/agent/${tenant}/${tenantUnit}?agentKey=${toURLstring(
    agentKey
  )}&type=${toURLstring(option)}`;
}

function renderValueLines(lines) {
  let result = [];
  lines.forEach(
    (item, i) => (result = i === lines.length - 1 ? result.concat(item) : result.concat(item, <br key={i} />))
  );
  return <>{result}</>;
}

export function Description({ lines }) {
  return <p className={locals.description}>{renderValueLines(lines)}</p>;
}

export function DropDown({ value, options, onChange }) {
  return (
    <Select
      className={locals.dropDown}
      value={value.key || value}
      onChange={e => onChange(e.target.value)}
      autoComplete="off"
    >
      {options.map(option => (
        <option key={option.key || option} value={option.key || option}>
          {option.label || option}
        </option>
      ))}
    </Select>
  );
}

export function Input({ value, onChange, placeholder, hasError }) {
  return (
    <InputComponent
      className={locals.input}
      type="text"
      id="value"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      hasError={hasError}
      autoComplete="off"
    />
  );
}

export function CheckBox({ label, checked, setChecked }) {
  return (
    <CheckboxFancy
      wrapperClassName={locals.checkbox}
      label={label}
      checked={checked}
      onChange={() => setChecked(!checked)}
      size="large"
    />
  );
}

export function Spacer() {
  return <div className={locals.spacer} />;
}

export function HelpBox({ title, children }) {
  return (
    <div className={locals.helpBox}>
      {title && <p className={locals.helpBoxTitle}>{title}</p>}
      {children}
    </div>
  );
}

export function Listing({ items }) {
  return (
    <ul className={locals.list}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function TextWithLink({ text, linkText, href }) {
  return (
    <span className={locals.textWithLink}>
      {`${text} `}
      <Link href={href} external>
        {linkText || href}
      </Link>
    </span>
  );
}

export function Row({ children }) {
  return (
    <div className={locals.row}>
      {React.Children.map(children, child => (
        <span className={locals.rowItem}>{child}</span>
      ))}
    </div>
  );
}

export function YAML(props) {
  return <RichCode {...props} language="yaml" />;
}

export function JSON(props) {
  return <RichCode {...props} language="json" />;
}

export function RichCode(props) {
  const { content, disabledErrorMessage, language } = props;
  const title = props.title || `Configuration.${language}`;
  const button = (
    <Button
      kind="secondary"
      icon="lib_views_popup"
      onClick={() => setActiveDialog(<CodeDialog {...props} />)}
      disabled={!!disabledErrorMessage}
    >
      {title || 'Show config'}
    </Button>
  );
  return (
    <Row>
      {disabledErrorMessage ? (
        <Tooltip themeStyle="light" content={props.disabledErrorMessage}>
          {button}
        </Tooltip>
      ) : (
        button
      )}
      <CopyToClipboardButton getText={() => content} disabledErrorMessage={disabledErrorMessage} />
    </Row>
  );
}

function CodeDialog({ title, content, language, disabledErrorMessage }) {
  return (
    <Dialog
      className={locals.dialog}
      title={title || 'Configuration'}
      renderCustomCloseBehaviour={() => (
        <div className={locals.dialogHeader}>
          <CopyToClipboardButton getText={() => content} disabledErrorMessage={disabledErrorMessage} />
          <SvgIcon className={locals.closeIcon} type="lib_openclose_cancel" size="l" onClick={close} />
        </div>
      )}
    >
      <CodeComponent code={content} showLineNumbers lang={language} />
    </Dialog>
  );
}

export function DownloadButton({ href }) {
  return (
    <Button target="_blank" href={href}>
      Download
    </Button>
  );
}

export function Bash(props) {
  return <Script {...props} pre={['#!/bin/bash', '']} />;
}

export function Script({ pre = [], lines, disabledErrorMessage }) {
  return (
    <div className={locals.script}>
      <pre className={locals.codeWrapper}>
        <code className={locals.code}>{renderValueLines([...pre, ...lines])}</code>
      </pre>
      <CopyToClipboardButton getText={() => lines.join('\n')} disabledErrorMessage={disabledErrorMessage} />
    </div>
  );
}

function CopyToClipboardButton(props) {
  if (props.disabledErrorMessage) {
    return (
      <Tooltip themeStyle="light" content={props.disabledErrorMessage}>
        <CopyButton {...props} disabled />
      </Tooltip>
    );
  }
  return <CopyButton {...props} />;
}

export function ValidatedInputFields({ fields, renderContent }) {
  const [form, setForm] = useState(createForm(fields));

  const props = {};
  function update(key) {
    return newValue => setForm(form.updateIn([key], f => f.setValue(newValue).setTouched(true)));
  }

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const onChange = update(field.name);
    const formField = form.get(field.name);
    props[field.name] = formField.value;
    props[`${field.name}ValidationMessage`] = get(formField, ['messages', 0, 'message']);
    props[`${field.name}Input`] = (
      <>
        <Input
          key={field.name}
          value={formField.value}
          onChange={onChange}
          placeholder={field.placeholder}
          hasError={!formField.valid && formField.touched}
        />
      </>
    );
  }
  return renderContent(props);
}

function createForm(fields) {
  function createValidation(field) {
    return str => {
      const error = notBlankValidator(str);
      if (error && error.length > 0) {
        return error;
      }
      const validate = field.validate;
      if (validate && !validate.validator(str)) {
        return [
          {
            severity: 'error',
            message: validate.validationMessage
          }
        ];
      }
      return null;
    };
  }

  let form = createMapForm();
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    form = form.put(
      field.name,
      createField({
        value: '',
        validator: createValidation(field)
      })
    );
  }

  return form;
}
