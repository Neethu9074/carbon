/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Td, Tr } from '@instana/legacy';

import ResultForTimeSelectionIndicator from 'in-components/ResultForTimeSelectionIndicator';

import locals from './HighlightedTimeframeMarkerRow.mless';

export default function HighlightedTimeframeMarkerRow({ cols }) {
  return (
    <Tr className={locals.row} size="compact">
      <Td colSpan={cols}>
        <ResultForTimeSelectionIndicator entityName="events" />
      </Td>
    </Tr>
  );
}
