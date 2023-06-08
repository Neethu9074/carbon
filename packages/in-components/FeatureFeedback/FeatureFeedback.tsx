/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { CSSProperties } from 'react';

import { Link } from '@instana/legacy';

import Pill from 'in-components/Pill/Pill';
import { t } from 'in-i18n';

import locals from './FeatureFeedback.mless';

interface FeatureFeedbackProps {
  href: string;
  labelText?: string;
  styles?: CSSProperties;
}

export default function FeatureFeedback({
  href,
  labelText = t('in-components:featureFeedback.labelBETA'),
  styles = {}
}: FeatureFeedbackProps) {
  return (
    <div className={locals.betaMarker} style={styles}>
      <Pill kind="primary" className={locals.betaPill}>
        {labelText}
      </Pill>
      <Link className={locals.betaLink} external href={href}>
        {t('in-components:featureFeedback.linkLabelYouCanSendUsFeedback')}
      </Link>
    </div>
  );
}
