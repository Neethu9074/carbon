import React, { useState, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

import { propTypeTimeConfig } from 'in-stores/time/config';

import locals from './MarkerLanesPresenter.mless';

export default function MarkerLanesPresenter({ timeConfig, children }) {
  const [labelVisible, setLabelVisible] = useState(false);
  const [labelAlignment, setLabelAligment] = useState('left');

  if (!children) return null;

  return (
    <div className={locals.markerLanes} onMouseLeave={() => setLabelVisible(false)}>
      <div className={locals.markerLanesContainer} onMouseEnter={() => setLabelVisible(true)}>
        {Children.map(children, child => {
          return cloneElement(child, {
            timeConfig,
            labelVisible,
            labelAlignment
          });
        })}
      </div>
      <div
        className={locals[labelAlignment]}
        onMouseEnter={() => setLabelAligment(labelAlignment === 'left' ? 'right' : 'left')}
      />
    </div>
  );
}

MarkerLanesPresenter.propTypes = {
  timeConfig: propTypeTimeConfig.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
};
