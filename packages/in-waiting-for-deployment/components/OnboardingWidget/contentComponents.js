import React from 'react';

import CopyToClipboardButton from 'in-waiting-for-deployment/components/OnboardingWidget/CopyButton';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { close } from 'in-components/DialogPresenter/store';
import CodeComponent from 'in-components/Code';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './content.mless';

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

export function CheckBox({ label, checked, setChecked }) {
  return <CheckboxFancy label={label} checked={checked} onChange={() => setChecked(!checked)} size="large" />;
}

export function SmallSpacer() {
  return <div className={locals.smallSpacer} />;
}

export function LargeSpacer() {
  return <div className={locals.largeSpacer} />;
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

export function YAML({ title, content }) {
  return <RichCode title={title} content={content} language="yaml" />;
}

export function JSON({ title, content }) {
  return <RichCode title={title} content={content} language="json" />;
}

export function RichCode({ title, content, language }) {
  title = title || `Configuration.${language}`;
  return (
    <Row>
      <Button
        icon="lib_views_popup"
        onClick={() => setActiveDialog(<CodeDialog title={title} content={content} language={language} />)}
      >
        {title || 'Show config'}
      </Button>
      <CopyToClipboardButton getText={() => content} />
    </Row>
  );
}

function CodeDialog({ title, content, language }) {
  return (
    <Dialog
      className={locals.dialog}
      title={title || 'Configuration'}
      renderCustomCloseBehaviour={() => (
        <div className={locals.dialogHeader}>
          <CopyToClipboardButton getText={() => content} />
          <SvgIcon className={locals.closeIcon} type="lib_openclose_cancel" size="l" onClick={close} />
        </div>
      )}
    >
      <CodeComponent code={content} showLineNumbers lang={language} />
    </Dialog>
  );
}

export function Bash({ lines }) {
  return <Script pre={['#!/bin/bash', '']} lines={lines} />;
}

export function Script({ pre = [], lines }) {
  return (
    <>
      <pre className={locals.codeWrapper}>
        <code className={locals.code}>{renderValueLines([...pre, ...lines])}</code>
      </pre>
      <CopyToClipboardButton getText={() => lines.join('\n')} />
    </>
  );
}

export function DownloadButton({ href }) {
  return (
    <Button href={href} target="_blank" rel="noopener noreferrer">
      Download
    </Button>
  );
}
