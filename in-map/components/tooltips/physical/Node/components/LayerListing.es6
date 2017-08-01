import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getSingular, getPlural } from 'in-sdk/pluginName';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import './LayerListing.less';

const block = 'in-tooltip-layer-listing';

export default connectTo(
  props => {
    if (!props.layer || props.layer.size === 0) {
      return {};
    }

    const ids = [];
    props.layer.forEach((value, id) => ids.push(getSnapshot(id)));
    return {
      snapshots: combineLatest(ids)
    };
  },
  function LayerListing({ snapshots }) {
    if (!snapshots) {
      return null;
    }

    const aggregatedLayer = getAggregatedLayer(snapshots);

    return (
      <ul className={block}>
        {Object.keys(aggregatedLayer).sort().map(key =>
          <li key={key}>
            <span className={block + '__count'}>
              {aggregatedLayer[key]}
            </span>
            {aggregatedLayer[key] === 1 ? getSingular(key) : getPlural(key)}
          </li>
        )}
      </ul>
    );
  }
);

function getAggregatedLayer(snapshots) {
  const aggregatedLayer = {};

  snapshots.forEach(snappi => {
    const plugin = snappi.get('plugin');
    if (aggregatedLayer[plugin]) {
      aggregatedLayer[plugin]++;
    } else {
      aggregatedLayer[plugin] = 1;
    }
  });

  return aggregatedLayer;
}
