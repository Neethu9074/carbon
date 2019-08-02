import PropTypes from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './ProblemIndicator.mless';

export default function ProblemIndicator({ kind = 'danger', title, children }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals[kind]]: locals[kind]
      })}
    >
      <div className={locals.header}>
        <div className={locals.icon}>!</div>

        <h1 className={locals.title}>{title}</h1>
      </div>

      {children && <div className={locals.description}>{children}</div>}
    </div>
  );
}

export const kinds = ['danger', 'warning'];

ProblemIndicator.propTypes = {
  kind: PropTypes.oneOf(kinds).isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.any
};
