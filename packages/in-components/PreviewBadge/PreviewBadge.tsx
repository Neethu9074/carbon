/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Pill } from '@instana/components';

import { t } from 'in-i18n';

interface PreviewBadgeProps {
  /**
   * Used to specify a custom class name if needed. Use only if necessary!
   */
  className?: string;
  /**
   * Flag to switch to a private preview label, instead of a public preview label
   */
  privatePreview?: boolean;
}

/**
 * @deprecated please use `PreviewPill` from `@instana/components`
 *
 * @todo remove, when every usage is moved to `@instana/components`
 *
 * PreviewBadge is used to display a public or private preview pill to any existing feature
 * @param {string} className - Optional custom class name for badge, avoid using if possible
 * @param {boolean} privatePreview - Optional flag to switch between public or private preview labelling
 * @returns {JSX.Element} A public or private preview pill depending on the privatePreview prop
 * @example
 * //Example usage of PreviewBadge for public preview
 * <PreviewBadge />
 *
 * //Example usage of PreviewBadge for private preview
 * <PreviewBadge privatePreview />
 */
export default function PreviewBadge({ className, privatePreview }: PreviewBadgeProps) {
  return (
    <Pill kind="primary" type="blue" className={className}>
      {privatePreview
        ? t('in-components:featureFeedback.labelPrivatePreview')
        : t('in-components:featureFeedback.labelPublicPreview')}
    </Pill>
  );
}
