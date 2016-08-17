import React from 'react';

import LayerListing from 'in-map/components/tooltips/physical/Node/components/LayerListing';
import {getMostImportantEventAtFocusedMoment} from 'in-stores/events';
import createTooltip from 'in-map/components/tooltips/Tooltip';
import EventDescription from 'in-components/EventDescription';
import Content from 'in-components/Tooltips/Content';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';


export default createTooltip(
  connectTo(props => {
    return {
      snapshot: getSnapshot(props.entity.id),
      mostImportantEvent: getMostImportantEventAtFocusedMoment(props.entity.id),
      layer: props.entity.layer.stream.map(_layer => Object.keys(_layer).map(key => _layer[key]))
    };
  },
  function Node({snapshot, layer, mostImportantEvent}) {
    if (!snapshot) {
      return null;
    }

    return mostImportantEvent
      ? (
        <EventDescription event={mostImportantEvent}
                          showFullTextIfToLong={false}
                          snapshotId={snapshot.get('id')}/>
      )
      : (
        <Content>
          {getLabel(snapshot)}
          {layer && layer.length > 0
            ? <LayerListing snapshotIds={layer.map(_layer => _layer.id)}/>
            : null}
        </Content>
      );
  }
));
