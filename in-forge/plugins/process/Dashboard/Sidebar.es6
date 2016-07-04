import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import ProcessInfo from 'in-forge/plugins/process/ProcessInfo';
import ArgList from 'in-forge/plugins/process/ArgList';
import Collapsible from 'in-components/Collapsible';


export default function ProcessSidebar({snapshot}) {
  const args = snapshot.getIn(['data', 'args']);

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Process
        </Collapsible.Header>
        <Collapsible.Content>
          <ProcessInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {args && args.size > 0 ?
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>
            Arguments
          </Collapsible.Header>
          <Collapsible.Content>
            <ArgList snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        : null
      }
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

ProcessSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
