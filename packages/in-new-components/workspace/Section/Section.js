import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Li } from 'in-new-components/lists/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Section.mless';

export default function Section({ className, title, icon, children, actions, firstLineAlignmentOffsetPx }) {
  let verticalPositionCorrection;
  const useAutomaticVerticalAlignment = firstLineAlignmentOffsetPx == null;
  if (!useAutomaticVerticalAlignment) {
    verticalPositionCorrection = {
      position: 'relative',
      top: `${firstLineAlignmentOffsetPx}px`
    };
  }

  return (
    <Li className={className} component="div" noAlternatingBg>
      <div
        className={classNames(locals.section, {
          [locals.automaticVerticalAlignment]: useAutomaticVerticalAlignment
        })}
      >
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
  title: PropTypes.node.isRequired,
  // To correct the vertical alignment of the title and actions to the first line of text found
  // within children. Prefer automatical vertical alignment if possible for your use case.
  // Automatic vertical alignment is the default.
  firstLineAlignmentOffsetPx: PropTypes.number,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  children: PropTypes.node.isRequired
};
