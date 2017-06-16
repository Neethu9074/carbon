import rpt from 'prop-types';
import React from 'react';

import { getSingular, getPlural } from 'in-sdk/pluginName';
import getSnapshots from 'in-hoc/getSnapshots';

import './LayerListing.less';

const block = 'in-tooltip-layer-listing';

export default getSnapshots(
  class extends React.PureComponent {
    static displayName = 'layer listing';

    static propTypes = {
      snapshots: rpt.array
    };

    render() {
      const snapshots = this.props.snapshots;
      if (!snapshots) {
        return null;
      }

      const aggregatedLayer = this.getAggregatedLayer(snapshots);

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

    getAggregatedLayer = snapshots => {
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
    };
  }
);
