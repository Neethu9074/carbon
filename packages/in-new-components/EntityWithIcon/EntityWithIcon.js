import PropTypes from 'prop-types';
import React from 'react';

import MultipleTechnologiesIcon from 'in-new-components/MultipleTechnologiesIcon';
import { evaluateClassNames } from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { shorten } from 'in-services/util/string';

import locals from './EntityWithIcon.mless';

export default function EntityWithIcon({ label, type, technologies, rootOrUnknown, length, iconSize, icon }) {
  return (
    <div className={locals.wrapper}>
      {(type || technologies || icon) && (
        <MultipleTechnologiesIcon type={type} icon={icon} technologies={technologies} iconSize={iconSize} />
      )}
      <Tooltip content={label} delay={500}>
        <span
          className={evaluateClassNames({
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
  technologies: PropTypes.array,
  label: PropTypes.string,
  rootOrUnknown: PropTypes.bool,
  length: PropTypes.number,
  iconSize: PropTypes.string
};
