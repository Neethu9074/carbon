/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error import flowLayout from 'in-applications/ApplicationMap/misc/layouting/Vizceral';
import flowLayout from 'in-applications/ApplicationMap/misc/layouting/Vizceral';
import forceLayout from 'in-applications/ApplicationMap/misc/layouting/FruchtermannReingold';

self.onmessage = function (e) {
  const [layouter, props] = e.data;

  let layouterImpl = forceLayout;
  if (layouter === 'flow') {
    layouterImpl = flowLayout;
  }
  layouterImpl.applyLayout(props);

  var workerResult = {
    usedLayouter: layouter,
    data: props
  };

  self.postMessage(workerResult);
};
