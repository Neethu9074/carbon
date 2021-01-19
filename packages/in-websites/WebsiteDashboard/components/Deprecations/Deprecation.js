/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard';
import { viewDeprecationDetails } from 'in-websites/tracker';
import Pill from 'in-new-components/Pill';

import locals from './Deprecation.mless';

export default function Deprecation({ title, preview, children, supportedUntil }) {
  return (
    <ExpandableCard
      title={title}
      preview={preview}
      expansionTracker={viewDeprecationDetails}
      header={supportedUntil && <Pill color="#fa0">Support ends {supportedUntil}</Pill>}
      openByDefault={!supportedUntil}
    >
      <div className={locals.content}>{children}</div>
    </ExpandableCard>
  );
}
