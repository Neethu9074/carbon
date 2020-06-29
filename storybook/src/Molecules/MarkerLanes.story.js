import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import ReleaseMarkerLanePresenter from 'in-components/Chart/markerLanes/ReleaseMarkerLane/ReleaseMarkerLanePresenter';
import BigHeaderDialogWithSlideInView from 'in-new-components/BigHeaderDialog/BigHeaderDialogWithSlideInView';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';

export default {
  title: 'Molecules|MarkerLanes',
  component: BigHeaderDialogWithSlideInView,
  decorator: { text, action }
};

const styles = {
  paddingTop: '100px'
};
const Center = ({ children }) => <div style={styles}>{children}</div>;

const timeConfig = { windowSize: 1000 * 60 * 60, to: null };

export const MarkerLanes = () => {
  function getReleases(timeConfig) {
    const randomEvents = [];
    const numEvents = 8;
    for (let i = 0; i < numEvents; i++) {
      randomEvents[i] = {
        start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * Math.random(),
        name: `Release: ${i}`
      };
    }
    return randomEvents;
  }

  return (
    <Center>
      <MarkerLanesPresenter timeConfig={timeConfig}>
        <ReleaseMarkerLanePresenter releases={getReleases(timeConfig)} />
      </MarkerLanesPresenter>
    </Center>
  );
};
