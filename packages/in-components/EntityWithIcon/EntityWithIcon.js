/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import MultipleTechnologiesIcon from 'in-components/MultipleTechnologiesIcon';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { shorten } from 'in-services/util/string';

import locals from './EntityWithIcon.mless';

export default function EntityWithIcon({ label, tooltip, type, technologies, rootOrUnknown, length, icon, size }) {
  return (
    <div className={locals.wrapper}>
      {(type || technologies || icon) && (
        <MultipleTechnologiesIcon type={type} icon={icon} technologies={technologies} size={size} />
      )}
      <Tooltip content={tooltip ?? label} delay={500} overflowEllipsis>
        <span
          className={classNames({
            [locals.label]: true,
            [locals.rootOrUnknown]: rootOrUnknown
          })}
        >
          {shorten(label, length || 24)}
        </span>
      </Tooltip>
    </div>
  );
}

EntityWithIcon.propTypes = {
  icon: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  technologies: PropTypes.array,
  label: PropTypes.string,
  tooltip: PropTypes.string,
  rootOrUnknown: PropTypes.bool,
  length: PropTypes.number
};
