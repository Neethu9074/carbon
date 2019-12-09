import PropTypes from 'prop-types';
import React from 'react';

import locals from './ScrollStep.mless';

export default function ScrollStep({ title, children, id, hideDevider }) {
  return (
    <section id={id} className={locals.container}>
      <h2 className={locals.title}>{title}</h2>
      {children}
      {!hideDevider && <div className={locals.divider} />}
    </section>
  );
}

ScrollStep.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  hideDevider: PropTypes.bool
};
