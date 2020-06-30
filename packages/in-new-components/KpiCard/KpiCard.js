import PropTypes from 'prop-types';
import React from 'react';

import { decimalSeparator, thousandsSeparator } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { evaluateClassNames } from 'in-services/util/classnames';
import { joinClassNames } from 'in-services/util/classnames';
import WithActiveTheme from 'in-themes/WithActiveTheme';

import locals from './KpiCard.mless';

const valueSplitRegExp = new RegExp(`^([0-9\\${decimalSeparator}\\${thousandsSeparator}]+)(.*)$`);

export default function KpiCard({
  title,
  value,
  actions,
  companionValue,
  raw = false,
  renderValue,
  valuesClassName,
  borderless = false,
  color,
  useMaxAvailableHeight = true
}) {
  if (raw || renderValue) {
    return (
      <Wrapper borderless={borderless} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
        <div className={locals.title}>{title}</div>
        <span className={joinClassNames(locals.minor, valuesClassName)}>
          {renderValue ? renderValue(value) : value}
        </span>
        {companionValue && <span className={locals.companion}>{companionValue}</span>}
      </Wrapper>
    );
  }

  let major = valueMissingPlaceholder;
  let minor = null;

  if (value != null) {
    const match = String(value).match(valueSplitRegExp);
    if (!match) {
      major = value;
    } else {
      major = match[1];
      minor = match[2];
    }
  }

  return (
    <Wrapper borderless={borderless} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
      <div className={locals.title}>{title}</div>
      <span className={locals.major} style={{ color: color }}>
        {major}
      </span>
      {minor && <span className={locals.minor}>{minor}</span>}
      {companionValue && <span className={locals.companion}>{companionValue}</span>}
    </Wrapper>
  );
}

KpiCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
  actions: PropTypes.node,
  companionValue: PropTypes.any,
  raw: PropTypes.bool,
  renderValue: PropTypes.func,
  valuesClassName: PropTypes.string,
  borderless: PropTypes.bool,
  color: PropTypes.string,
  useMaxAvailableHeight: PropTypes.bool
};

function Wrapper({ children, borderless, useMaxAvailableHeight, actions }) {
  return (
    <WithActiveTheme>
      {theme => (
        <div
          className={evaluateClassNames({
            [locals.wrapper]: true,
            [locals[theme]]: true,
            [locals.borderless]: borderless,
            [locals.useMaxAvailableHeight]: useMaxAvailableHeight
          })}
        >
          {children}

          {actions && <div className={locals.actions}>{actions}</div>}
        </div>
      )}
    </WithActiveTheme>
  );
}
