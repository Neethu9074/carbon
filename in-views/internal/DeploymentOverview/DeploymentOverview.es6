/* eslint-disable no-console */

import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import {overview$} from 'in-views/internal/DeploymentOverview/store';
import connectTo from 'in-hoc/connectTo';

const block = 'in-instana-deployment-overview';

export default connectTo({
  overview: overview$
}, function DeploymentOverview({overview}) {
  console.log(overview);
  return (
    <FullscreenOverlayView className={block}>
      yoho!
    </FullscreenOverlayView>
  );
});
