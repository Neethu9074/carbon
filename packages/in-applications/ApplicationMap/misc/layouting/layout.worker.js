/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import forceLayout from 'in-applications/ApplicationMap/misc/layouting/FruchtermannReingold';
import flowLayout from 'in-applications/ApplicationMap/misc/layouting/Vizceral';

self.onmessage = function(e) {
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
