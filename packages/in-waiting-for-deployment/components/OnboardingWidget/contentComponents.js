/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, composeValidators } from 'formalistic';
import React, { useState } from 'react';
import { get } from 'lodash';

import { Button, Link, Spacer as SpacerComponent, SpacerSizes } from '@instana/components';

import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { notBlankValidator } from 'in-services/validators/string';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { close } from 'in-components/DialogPresenter/store';
import InputComponent from 'in-components/form/Input';
import Dialog from 'in-components/Dialog/Dialog';
import CodeComponent from 'in-components/Code';
import Select from 'in-components/form/Select';
import Tooltip from 'in-components/Tooltip';
import { region } from 'in-services/config';
import { t } from 'in-i18n';

import locals from './content.mless';

export function toURLstring(str) {
  return encodeURIComponent(str);
}

export function getAgentDownloadURL(tenant, tenantUnit, agentKey, option, butlerDomain) {
  return `https://${butlerDomain}/assets/agent/${tenant}/${tenantUnit}?agentKey=${toURLstring(
    agentKey
  )}&type=${toURLstring(option)}${region ? `&region=${toURLstring(region)}` : ''}`;
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

export function Input({ id, value, onChange, placeholder, hasError }) {
  return (
    <InputComponent
      className={locals.input}
      type="text"
      id={id}
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
  return <SpacerComponent vertical={SpacerSizes.xsmall} />;
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

export function YAMLFile(props) {
  return <RichCode {...props} language="yaml" />;
}

export function JSONFile(props) {
  return <RichCode {...props} language="json" />;
}

function RichCode(props) {
  const [downloadLink, setDownloadlink] = useState(null);
  const { content, disabledErrorMessage, language } = props;
  const title = props.title || `Configuration.${language}`;
  const button = (
    <Button
      kind="secondary"
      icon="lib_actions_copy"
      onClick={() => addActiveDialog(<CodeDialog {...props} />)}
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
      <CopyToClipboardButtonInternal getText={() => content} disabledErrorMessage={disabledErrorMessage} />
      <a ref={link => setDownloadlink(link)} onClick={e => e.stopPropagation()}>
        <Button
          icon="lib_actions_download"
          disabled={!!disabledErrorMessage}
          onClick={e => {
            e.stopPropagation();
            if (!downloadLink) {
              return;
            }

            downloadLink.setAttribute('href', `data:text/${language};charset=utf-8,${encodeURIComponent(content)}`);
            downloadLink.setAttribute('download', `configuration.${language}`);
          }}
        >
          {t('in-waiting-for-deployment:download')}
        </Button>
      </a>
    </Row>
  );
}

function CodeDialog({ title, content, language, disabledErrorMessage }) {
  return (
    <Dialog
      className={locals.dialog}
      title={title || 'Configuration'}
      onClose={close}
      renderCustomCloseBehaviour={() => (
        <CopyToClipboardButtonInternal getText={() => content} disabledErrorMessage={disabledErrorMessage} />
      )}
    >
      <CodeComponent code={content} showLineNumbers lang={language} />
    </Dialog>
  );
}

export function DownloadButton({ href, title = t('in-waiting-for-deployment:download') }) {
  return (
    <Button target="_blank" href={href} icon="lib_actions_download">
      {title}
    </Button>
  );
}

export function Bash({ lines }) {
  return <Script lines={['#!/bin/bash', ''].concat(lines)} />;
}

export function Cmd({ lines }) {
  return <Script lines={['@ECHO OFF', ''].concat(lines)} />;
}

export function PowershellEC2({ lines }) {
  return <Script lines={['<powershell>'].concat(lines).concat(['</powershell>'])} />;
}

export function Dockerfile({ lines }) {
  return <Script pre={['# Dockerfile', '']} lines={lines} />;
}

export function Script({ pre = [], post = [], lines, disabledErrorMessage }) {
  return (
    <div className={locals.script}>
      <pre className={locals.codeWrapper}>
        <code className={locals.code}>{renderValueLines([...pre, ...lines, ...post])}</code>
      </pre>
      <CopyToClipboardButtonInternal getText={() => lines.join('\n')} disabledErrorMessage={disabledErrorMessage} />
    </div>
  );
}

function CopyToClipboardButtonInternal(props) {
  if (props.disabledErrorMessage) {
    return (
      <Tooltip themeStyle="light" content={props.disabledErrorMessage}>
        <CopyToClipboardButton {...props} disabled />
      </Tooltip>
    );
  }
  return <CopyToClipboardButton {...props} />;
}

export function ValidatedInputFields({ fields, renderContent }) {
  const [form, setForm] = useState(() => createForm(fields));

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
          id={field.name}
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
  let form = createMapForm();
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    form = form.put(
      field.name,
      createField({
        value: '',
        validator: composeValidators(notBlankValidator, field.validate)
      })
    );
  }

  return form;
}
