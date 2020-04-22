import PropTypes from 'prop-types';
import React from 'react';

import locals from './SelectedBlueprintPresenter.mless';

export default function SelectedBlueprintPresenter({ title, description, children }) {
  return (
    <div className={locals.container}>
      <h2 className={locals.headline}>{title}</h2>
      <p className={locals.description}>{description}</p>
      {children}
    </div>
  );
}

SelectedBlueprintPresenter.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node
};
