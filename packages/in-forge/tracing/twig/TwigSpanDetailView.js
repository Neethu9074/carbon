/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SymfonySpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Template Name">{span.getIn(['data', 'twig', 'name'])}</Di>
        <Di title="Template Path">{span.getIn(['data', 'twig', 'path'])}</Di>
        <Di title="Subtemplate Count">{span.getIn(['data', 'twig', 'subtemplate_count'])}</Di>
      </Dl>
    </div>
  );
}
