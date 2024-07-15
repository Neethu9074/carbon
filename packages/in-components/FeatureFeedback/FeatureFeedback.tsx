/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { CSSProperties } from 'react';

import { Link, Pill } from '@instana/components';

import { t } from 'in-i18n';

import locals from './FeatureFeedback.mless';

interface FeatureFeedbackProps {
  href: string;
  labelText?: string;
  styles?: CSSProperties;
}

export default function FeatureFeedback({
  href,
  labelText = t('in-components:featureFeedback.labelPublicPreview'),
  styles = {}
}: FeatureFeedbackProps) {
  return (
    <div className={locals.betaMarker} style={styles}>
      <Pill type="blue" className={locals.betaPill}>
        {labelText}
      </Pill>
      <Link className={locals.betaLink} external href={href}>
        {t('in-components:featureFeedback.linkLabelYouCanSendUsFeedback')}
      </Link>
    </div>
  );
}
