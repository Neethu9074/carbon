/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import locals from './SectionLabelWithSubtext.mless';

export default function SectionLabelWithSubtext({ subtext, children }) {
  return (
    <>
      {children}
      <span className={locals.subtext}>{subtext}</span>
    </>
  );
}
SectionLabelWithSubtext.propTypes = {
  children: PropTypes.node.isRequired,
  subtext: PropTypes.node.isRequired
};
