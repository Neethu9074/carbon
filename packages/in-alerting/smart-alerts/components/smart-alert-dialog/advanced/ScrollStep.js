/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ScrollStep.mless';

export default function ScrollStep({ id, children }) {
  return (
    <section id={id} className={locals.container}>
      {children}
    </section>
  );
}

ScrollStep.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string
};
