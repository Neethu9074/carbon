import PropTypes from 'prop-types';
import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';

import locals from './TwoColumnContainer.mless';

export default function TwoColumnContainer({
  mainContent,
  secondaryContent,
  mainContentHeadline,
  moveMainAreaRight,
  removePaddingSecondaryArea
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.container]: true,
        [locals.mainAreaLeft]: moveMainAreaRight
      })}
    >
      <div className={locals.mainArea}>
        <h3 className={locals.headline}>{mainContentHeadline}</h3>
        <div className={locals.mainAreaContent}>{mainContent}</div>
      </div>
      <div
        className={evaluateClassNames({
          [locals.secondaryArea]: true,
          [locals.removePadding]: removePaddingSecondaryArea,
          [locals.borderRight]: moveMainAreaRight
        })}
      >
        {secondaryContent}
      </div>
    </div>
  );
}

TwoColumnContainer.propTypes = {
  mainContent: PropTypes.node.isRequired,
  mainContentHeadline: PropTypes.string.isRequired,
  moveMainAreaRight: PropTypes.bool,
  removePaddingSecondaryArea: PropTypes.bool,
  secondaryContent: PropTypes.node.isRequired
};
