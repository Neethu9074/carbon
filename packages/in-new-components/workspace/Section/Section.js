import PropTypes from 'prop-types';
import React from 'react';

import { Li } from 'in-new-components/lists/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Section.mless';

export default function Section({ title, icon, children, actions, firstLineAlignmentOffsetPx = 0 }) {
  const verticalPositionCorrection = {
    position: 'relative',
    top: `${firstLineAlignmentOffsetPx}px`
  };

  return (
    <Li component="div" noAlternatingBg>
      <div className={locals.section}>
        <div className={locals.title} style={verticalPositionCorrection}>
          {icon && <SvgIcon type={icon} />}
          <span className={locals.titleText}>{title}</span>
        </div>

        <div className={locals.content}>{children}</div>

        {actions && (
          <div className={locals.actions} style={verticalPositionCorrection}>
            {actions}
          </div>
        )}
      </div>
    </Li>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  // To correct the vertical alignment of the title to the first line of text found
  // within children.
  firstLineAlignmentOffsetPx: PropTypes.number,
  icon: PropTypes.string.isRequired,
  actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  children: PropTypes.node.isRequired
};
