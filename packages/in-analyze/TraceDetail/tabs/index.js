/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import Summary from 'in-analyze/TraceDetail/tabs/Summary/Summary';

export default [
  {
    // called Detail until we have more than one tab
    label: 'Detail',
    path: `${traceDetailFullyQualified}/tree`,
    component: Summary,
    hideTabLabelWhenAlone: true
  }
];
