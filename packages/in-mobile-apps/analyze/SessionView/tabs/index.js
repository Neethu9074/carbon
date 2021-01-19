/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { sessionViewPathFullyQualified } from 'in-mobile-apps/navigation/paths';

import Summary from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Summary';

export default [
  {
    // called Detail until we have more than one tab
    label: 'Detail',
    path: `${sessionViewPathFullyQualified}/summary`,
    component: Summary,
    hideTabLabelWhenAlone: true
  }
];
