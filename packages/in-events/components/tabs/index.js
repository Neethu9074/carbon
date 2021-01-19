/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import Summary from 'in-events/components/tabs/Summary/Summary';
import { eventsPath } from 'in-events/navigation/paths';

export default [
  {
    label: 'Summary',
    path: eventsPath,
    component: Summary,
    hideTabLabelWhenAlone: true
  }
];
