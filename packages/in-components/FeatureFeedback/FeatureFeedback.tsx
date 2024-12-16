/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { CSSProperties } from 'react';

import { Link, PreviewPill } from '@instana/components';

import { t } from 'in-i18n';

import locals from './FeatureFeedback.mless';

interface FeatureFeedbackProps {
  href: string;
  styles?: CSSProperties;
}

export default function FeatureFeedback({ href, styles = {} }: FeatureFeedbackProps) {
  return (
    <div className={locals.betaMarker} style={styles}>
      <PreviewPill />
      <Link external href={href}>
        {t('in-components:featureFeedback.linkLabelYouCanSendUsFeedback')}
      </Link>
    </div>
  );
}
