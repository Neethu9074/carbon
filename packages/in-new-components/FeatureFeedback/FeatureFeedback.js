/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import Pill from 'in-new-components/Pill/Pill';
import Link from 'in-components/Link';

import locals from './FeatureFeedback.mless';

export default function FeatureFeedback({ href, text = 'This feature is in beta.', labelText = 'BETA', styles = {} }) {
  return (
    <div className={locals.betaMarker} style={styles}>
      <Pill kind="primary" className={locals.betaPill}>
        {labelText}
      </Pill>
      {text}
      <Link className={locals.betaLink} external href={href}>
        You can send us feedback
      </Link>
      .
    </div>
  );
}

FeatureFeedback.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string,
  labelText: PropTypes.string,
  styles: PropTypes.object
};
