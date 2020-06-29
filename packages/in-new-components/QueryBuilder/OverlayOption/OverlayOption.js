import PropTypes from 'prop-types';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { Li } from 'in-new-components/lists/List/List';

import locals from './OverlayOption.mless';

export default function OverlayOption({ autoFocus, className, selectedValue, value, onChange, close, children, subList }) {
  return (
    <Li
      className={joinClassNames(locals.option, className)}
      noAlternatingBg
      autoFocus={autoFocus ?? selectedValue === value}
      subList={subList}
      onClick={() => {
        if (selectedValue !== value) {
          onChange(value);
        }
        close();
      }}
    >
      {children}
    </Li>
  );
}

OverlayOption.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  selectedValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  subList: PropTypes.array
};
