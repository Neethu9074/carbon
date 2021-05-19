/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Link } from '@instana/components';

import Pill from 'in-new-components/Pill/Pill';
import { t } from 'in-i18n';

import locals from './FeatureFeedback.mless';

export default function FeatureFeedback({
  href,
  labelText = t('in-new-components:featureFeedback.labelBETA'),
  styles = {}
}) {
  return (
    <div className={locals.betaMarker} style={styles}>
      <Pill kind="primary" className={locals.betaPill}>
        {labelText}
      </Pill>
      <Link className={locals.betaLink} external href={href}>
        {t('in-new-components:featureFeedback.linkLabelYouCanSendUsFeedback')}
      </Link>
    </div>
  );
}

FeatureFeedback.propTypes = {
  href: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  styles: PropTypes.object
};
