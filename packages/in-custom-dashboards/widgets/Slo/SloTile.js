import PropTypes from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { joinClassNames } from 'in-services/util/classnames';
import WithActiveTheme from 'in-themes/WithActiveTheme';

import locals from './SloTile.mless';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';

export default function SloTile({
  title,
  value,
  color,
  actions,
  renderValue,
  valuesClassName,
  unit,

  targetInfo,
  targetValue,

  useMaxAvailableHeight = true
}) {
  if (renderValue) {
    return (
      <Wrapper useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
        <div className={locals.title}>{title}</div>

        <div style={{ color: color }} className={locals.value}>
          <span className={valuesClassName}>{renderValue ? renderValue(value) : value}</span>
        </div>

        <div className={locals.targetInfo}>
          {targetInfo && <span>{targetInfo}</span>}
          {targetValue && <span className={locals.leftspace}>{targetValue}</span>}
          {unit && <span className={locals.leftspace}>{unit}</span>}
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
      <div className={locals.title}>{title}</div>

      <div className={locals.value} style={{ color: color }}>
        <span>{value ?? valueMissingPlaceholder}</span>
        {value && unit && <span className={joinClassNames(locals.unit, locals.leftspace)}>{unit}</span>}
      </div>

      <div className={locals.targetInfo}>
        <span>{targetInfo ?? valueMissingPlaceholder}</span>
        {targetValue && <span className={locals.leftspace}>{targetValue}</span>}
        {targetValue && unit && <span className={locals.leftspace}>{unit}</span>}
      </div>
    </Wrapper>
  );
}

SloTile.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
  unit: PropTypes.string,
  actions: PropTypes.node,
  renderValue: PropTypes.func,
  targetInfo: PropTypes.string,
  targetValue: PropTypes.any,
  valuesClassName: PropTypes.string,
  color: PropTypes.string,
  useMaxAvailableHeight: PropTypes.bool
};

function Wrapper({ children, useMaxAvailableHeight, actions }) {
  return (
    <WithActiveTheme>
      {theme => (
        <div
          className={evaluateClassNames({
            [locals.wrapper]: true,
            [locals[theme]]: true,
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
