import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getSnapshotFromPhysicalHierarchyByPlugin } from 'in-stores/snapshot';
import FillerStatsRow, { STATS } from 'in-internal/FillerStats/FillerStatsRow';
import { emptyArray } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';
import Button from 'in-new-components/Button';

export default connectTo(
  {
    timeConfig: timeConfig$,
    us: getSearchResult(`entity.zone:*US* entity.label:*filler* entity.selfType:dropwizard`),
    eu: getSearchResult(`entity.zone:*EU* entity.label:*filler* entity.selfType:dropwizard`)
  },
  class FillerStats extends React.Component {
    state = {
      region: null
    };

    render() {
      const { eu, us, timeConfig } = this.props;
      const { region } = this.state;

      let snapshots = [];
      if (region == 'EU') {
        snapshots = eu;
      }
      if (region == 'US') {
        snapshots = us;
      }

      return (
        <div>
          <h2>Select a region to load the filler stats</h2>
          <Button onClick={() => this.handleButtonClick('EU')}>EU</Button>
          <Button onClick={() => this.handleButtonClick('US')}>US</Button>
          <div>
            Region;snapshotId;label;
            {STATS.map(stat => `${stat.label} (avg)`).join(';')};
            {STATS.map(stat => `${stat.label} (top)`).join(';')};
          </div>

          {snapshots
            .slice(0, 3)
            .map(snapshot => (
              <FillerStatsRow
                key={snapshot.id}
                region={region}
                snapshotId={snapshot.id}
                snapshotLabel={snapshot.label}
                timeConfig={timeConfig}
              />
            ))}
        </div>
      );
    }

    handleButtonClick(region) {
      this.setState({ region });
    }
  }
);

function getSearchResult(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query,
        view: 'TABLE',
        timeConfig
      })
        .flatMap(getSnapshots, timeConfig)
        .flatMap(dropwizardSnapshots => {
          return combineLatest(
            dropwizardSnapshots.map(dropwizardSnapshot =>
              getSnapshotFromPhysicalHierarchyByPlugin(dropwizardSnapshot.get('id'), 'docker').map(dockerSnapshot => ({
                dropwizardSnapshot,
                dockerSnapshot
              }))
            )
          ).map(results => {
            return results.map(result => {
              return {
                id: result.dropwizardSnapshot.get('id'),
                label: result.dockerSnapshot.getIn(['data', 'Nomad', 'jobName'])
              };
            });
          });
        })
    )
    .startWith(emptyArray);
}
