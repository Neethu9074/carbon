import forceLayout from 'in-new-components/ApplicationMap/misc/layouting/FruchtermannReingold';
import flowLayout from 'in-new-components/ApplicationMap/misc/layouting/Vizceral';

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
