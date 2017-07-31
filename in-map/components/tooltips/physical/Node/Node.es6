import React from 'react';

import LayerListing from 'in-map/components/tooltips/physical/Node/components/LayerListing';
import { getMostImportantEventAtFocusedMoment } from 'in-stores/events';
import createTooltip from 'in-map/components/tooltips/Tooltip';
import EventDescription from 'in-components/EventDescription';
import Content from 'in-components/Tooltips/Content';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/tooltips/physical/Node/Node.less';

const block = 'in-map-tooltip-node';

export default createTooltip(
  connectTo(
    props => {
      return {
        snapshot: getSnapshot(props.entity.id),
        mostImportantEvent: getMostImportantEventAtFocusedMoment(props.entity.id).startWith(null),
        layer: props.entity.layer.stream
      };
    },
    function Node({ snapshot, layer, mostImportantEvent }) {
      if (!snapshot) {
        return null;
      }

      return mostImportantEvent
        ? <EventDescription event={mostImportantEvent} showFullTextIfToLong={false} snapshotId={snapshot.get('id')} />
        : <Content className={`${block}__content`}>
            {getLabel(snapshot)}
            <LayerListing layer={layer} />
          </Content>;
    }
  )
);
