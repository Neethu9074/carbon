import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import Collapsible from 'in-components/Collapsible';

import JiraInfo from '../JiraInfo';


export default function JiraSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>JIRA</Collapsible.Header>
        <Collapsible.Content>
          <JiraInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

JiraSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
