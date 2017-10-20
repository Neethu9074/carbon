import React from 'react';
import { combineLatest } from 'reactive-observables';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getProcessCompanions } from 'in-stores/snapshot/graph';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      companions: getProcessCompanions(props.snapshotId)
        .flatMap(companionIds => {
          const companions$ = companionIds.toArray().map(snapshotId => getSnapshot(snapshotId));
          return combineLatest(companions$, false);
        })
        .map(companions => companions.filter(m => !!m))
    };
  },
  function PhpSnapshot({ companions, initiallyOpen }) {
    if (!companions || companions.length === 0) {
      return null;
    }

    return (
      <div>
        {companions.map(companion => (
          <div key={companion.get('id')}>
            <Separator />

            <Collapsible initiallyOpen={initiallyOpen}>
              <Collapsible.Header>PHP</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  <DescriptionItem title="Version">{companion.getIn(['data', 'version'])}</DescriptionItem>
                  <DescriptionItem title="Server API">{companion.getIn(['data', 'serverApi'])}</DescriptionItem>
                  <DescriptionItem title="Zend Thread Safety">{companion.getIn(['data', 'zts'])}</DescriptionItem>
                  <DescriptionItem title="Main Ini File">{companion.getIn(['data', 'iniDir'])}</DescriptionItem>
                  <DescriptionItem title="Ini Files Directory">{companion.getIn(['data', 'iniDir'])}</DescriptionItem>
                  <DescriptionItem title="Additional Ini Files Parsed">
                    {stripIniDir(companion.getIn(['data', 'iniFilesParsed']), companion.getIn(['data', 'iniDir']))}
                  </DescriptionItem>
                  <DescriptionItem title="Extensions Directory">
                    {companion.getIn(['data', 'extensionsDir'])}
                  </DescriptionItem>
                  <DescriptionItem title="Instana Tracing Extension Version">
                    {companion.getIn(['data', 'instanaVersion'])}
                  </DescriptionItem>
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          </div>
        ))}
      </div>
    );
  }
);

function stripIniDir(iniFilesParsed, iniDir) {
  if (iniFilesParsed != null && iniDir != null) {
    return iniFilesParsed
      .split(',')
      .map(function(iniFile) {
        return iniFile.replace(iniDir + '/', '');
      })
      .join(', ');
  }
  return iniFilesParsed;
}
