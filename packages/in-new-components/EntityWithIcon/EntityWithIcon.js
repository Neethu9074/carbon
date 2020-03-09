import PropTypes from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { shorten } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityWithIcon.mless';

export default function EntityWithIcon({ label, icon, iconPath, rootOrUnknown, length }) {
  return (
    <div className={locals.wrapper}>
      {(icon || iconPath) && <SvgIcon className={locals.entityIcon} type={icon} iconPath={iconPath} />}
      <span
        className={evaluateClassNames({
          [locals.label]: true,
          [locals.rootOrUnknown]: rootOrUnknown
        })}
      >
        {shorten(label, length || 24)}
      </span>
    </div>
  );
}

EntityWithIcon.propTypes = {
  iconPath: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  rootOrUnknown: PropTypes.bool,
  length: PropTypes.number
};
