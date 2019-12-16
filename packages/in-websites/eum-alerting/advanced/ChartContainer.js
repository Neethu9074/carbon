import PropTypes from 'prop-types';
import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';

import locals from './ChartContainer.mless';

export default function ChartContainer({ withBorder, children, headline }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.container]: true,
        [locals.border]: withBorder
      })}
    >
      <h3 className={locals.headline}>{headline}</h3>
      {children}
    </div>
  );
}

ChartContainer.propTypes = {
  children: PropTypes.element.isRequired,
  headline: PropTypes.string.isRequired,
  withBorder: PropTypes.bool
};
