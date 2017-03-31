import React from 'react';

import HumanReadablePluginName from 'in-sdk/components/sidebar/HumanReadablePluginName';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SnapshotLabel from 'in-sdk/components/sidebar/SnapshotLabel';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getServiceInstances } from 'in-stores/snapshot';
import { emptySet } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      instances: getServiceInstances(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptySet)
    };
  },
  function ServiceInstancesList({ instances }) {
    if (instances == null || instances.size === 0) {
      return null;
    }

    const items = [];
    instances.forEach(instance => {
      const serviceId = instance.get('serviceId');
      if (serviceId) {
        items.push(
          <DescriptionItem
            title={<HumanReadablePluginName snapshotId={serviceId} fallback="Service" />}
            id={serviceId}
            key={serviceId}
            addSeparator
          >
            <SnapshotLink snapshotId={serviceId}>
              <SnapshotLabel snapshotId={serviceId} />
            </SnapshotLink>
          </DescriptionItem>
        );
      }

      const serviceInstanceId = instance.get('serviceInstanceId');
      items.push(
        <DescriptionItem
          title={<HumanReadablePluginName snapshotId={serviceInstanceId} fallback="Service Instance" />}
          id={serviceInstanceId}
          key={serviceInstanceId}
        >
          <SnapshotLink snapshotId={serviceInstanceId}>
            <SnapshotLabel snapshotId={serviceInstanceId} />
          </SnapshotLink>
        </DescriptionItem>
      );
    });

    return (
      <div>
        <Separator />

        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>
            Services
          </Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {items}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);
