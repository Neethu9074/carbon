/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { pageLoadViewPathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';

export default [
  {
    // called Detail until we have more than one tab
    label: 'Detail',
    path: `${pageLoadViewPathFullyQualified}/summary`,
    component: Summary,
    hideTabLabelWhenAlone: true
  }
];
