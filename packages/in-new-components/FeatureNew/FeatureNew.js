/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Pill from 'in-new-components/Pill/Pill';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './FeatureNew.mless';

export default function FeatureNew({ href, text }) {
  return (
    <div className={locals.newMarker}>
      <Pill kind="primary" className={locals.newPill}>
        {t('in-new-components:featureNew.labelNEW')}
      </Pill>
      <Link className={locals.newLink} external href={href}>
        {text}
      </Link>
    </div>
  );
}

FeatureNew.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};
