import { get } from 'lodash';
import React from 'react';

import { getMostImportantEventAtFocusedMoment } from 'in-stores/events';
import createTooltip from 'in-map/components/tooltips/Tooltip';
import EventDescription from 'in-events/components/EventDescription';
import Content from 'in-components/Tooltips/Content';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './Layer.mless';

export default createTooltip(
  connectTo(
    props => {
      return {
        snapshot: getSnapshot(props.entity.id),
        mostImportantEvent: getMostImportantEventAtFocusedMoment(props.entity.id).startWith(null)
      };
    },
    function Layer({ snapshot, mostImportantEvent, entity }) {
      if (!snapshot) {
        return null;
      }

      if (mostImportantEvent) {
        return (
          <EventDescription event={mostImportantEvent} showFullTextIfToLong={false} snapshotId={snapshot.get('id')} />
        );
      }

      const containerLabel = get(entity, ['metadata', 'container.label']);

      return (
        <Content>
          {getSingular(snapshot.get('plugin'))}: {getLabel(snapshot)}
          {containerLabel && <span className={locals.container}>Container: {containerLabel}</span>}
        </Content>
      );
    }
  )
);
