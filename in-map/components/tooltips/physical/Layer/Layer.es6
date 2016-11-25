import React from 'react';

import {getMostImportantEventAtFocusedMoment} from 'in-stores/events';
import createTooltip from 'in-map/components/tooltips/Tooltip';
import EventDescription from 'in-components/EventDescription';
import Content from 'in-components/Tooltips/Content';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';


export default createTooltip(
  connectTo(props => {
    return {
      snapshot: getSnapshot(props.entity.id),
      mostImportantEvent: getMostImportantEventAtFocusedMoment(props.entity.id)
    };
  },
  function Layer({snapshot, mostImportantEvent}) {
    if (!snapshot) {
      return null;
    }

    return mostImportantEvent
      ? (
        <EventDescription event={mostImportantEvent}
                          showFullTextIfToLong={false}
                          snapshotId={snapshot.get('id')} />
      )
      : (
        <Content>
          {getSingular(snapshot.get('plugin'))} : {getLabel(snapshot)}
        </Content>
      );
  }
));
