import React from 'react';

import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';
import clockSkewProblemsData from './clockSkewProblems.json';
import demoCaseData from './demoCase.json';

export default {
  title: 'Templates|website/PageLoadView',
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
