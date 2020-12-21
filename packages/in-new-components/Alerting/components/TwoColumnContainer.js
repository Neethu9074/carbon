import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import { warning } from 'in-new-components/Message/types';
import Message from 'in-new-components/Message';

import locals from './TwoColumnContainer.mless';

export default function TwoColumnContainer({
  mainContent,
  secondaryContent,
  mainContentHeadline,
  moveMainAreaRight,
  removePaddingSecondaryArea,
  warnMessage
}) {
  return (
    <div
      className={classNames({
        [locals.container]: true,
        [locals.mainAreaLeft]: moveMainAreaRight
      })}
    >
      <div className={locals.mainArea}>
        <h3 className={locals.headline}>{mainContentHeadline}</h3>
        {warnMessage && <Message type={warning}>{warnMessage}</Message>}
        <div className={locals.mainAreaContent}>{mainContent}</div>
      </div>
      <div
        className={classNames({
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
  secondaryContent: PropTypes.node.isRequired,
  warnMessage: PropTypes.node
};
