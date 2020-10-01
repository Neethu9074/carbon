import React from 'react';

import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';
import clockSkewProblemsData from './clockSkewProblems.json';
import demoCaseData from './demoCase.json';

export default {
  title: 'Templates|website/PageLoadView',
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
