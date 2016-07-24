import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import List from 'in-components/List';

import JVMInfo from '../JVMInfo';


export default function JvmRuntimeSidebar({snapshot}) {
  const args = snapshot.getIn(['data', 'jvm.args']);

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Java</Collapsible.Header>
        <Collapsible.Content>
          <JVMInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {args ?
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>JVM Arguments</Collapsible.Header>
          <Collapsible.Content>
            <List>
              {args.map((arg, i) =>
                <List.Item key={i}>{arg}</List.Item>
              ).toArray()}
            </List>
          </Collapsible.Content>
        </Collapsible>
      : null}
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

JvmRuntimeSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
