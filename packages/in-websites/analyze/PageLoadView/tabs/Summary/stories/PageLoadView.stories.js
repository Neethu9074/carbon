/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import clockSkewProblemsData from 'in-websites/analyze/PageLoadView/tabs/Summary/stories/clockSkewProblems.json';
import demoCaseData from 'in-websites/analyze/PageLoadView/tabs/Summary/stories/demoCase.json';
import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';

export default {
  parameters: {
    // TODO: repair this broken story, and remove this parameter again
    chromatic: { disable: true }
  },
  component: Summary
};

export function demoCase() {
  return <PageLoadViewStory beacons={demoCaseData} />;
}

export function clockSkewProblems() {
  return <PageLoadViewStory beacons={clockSkewProblemsData} />;
}

function PageLoadViewStory({ beacons }) {
  return <Summary beacons={beacons} />;
}
