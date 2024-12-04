/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, Typography, Spacer } from '@instana/components';

import type {
  LearnMoreLinkProps,
  SubHeadingProps
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';

import locals from 'in-websites/trackingSnippet/AutoPageTransitionDetection/AutoPageTransitionDetection.mless';

// LearnMoreLink component for displaying a help paragraph with an embedded translated link.
export const LearnMoreLink = ({ label, linkText, url }: LearnMoreLinkProps) => (
  <>
    <Spacer vertical="xxsmall" />
    <div className={locals.displayFlex}>
      <Typography variant="body-small" component="p" noMargin align="inherit">
        {label}
      </Typography>
      <Spacer horizontal="xxsmall" />
      <Link href={url} external linkIconType={'lib_views_external_link'} className={locals.learnMoreLink}>
        {linkText}
      </Link>
    </div>
  </>
);

export const SubHeading = ({ text }: SubHeadingProps) => <Typography variant="heading-02">{text}</Typography>;

export const SubHeadingHelpText = ({ text }: SubHeadingProps) => (
  <Typography variant="body-01" component="p" noMargin align="inherit">
    {text}
  </Typography>
);
