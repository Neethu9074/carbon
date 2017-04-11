import React from 'react';

import { sceneObjects } from 'in-map/stores/focusableSceneObjectsStore';
import { formatDateTime } from 'in-services/formatters/date';
import { focusedMoment$ } from 'in-stores/timeline';
import { focusId } from 'in-map/services/focus';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import './FocusButton.less';

const block = 'in-sidebar-map__focus-icon';

export default connectTo(
  {
    focusableSceneObjects: sceneObjects.stream.debounce(),
    focusedMoment: focusedMoment$
  },
  function FocusButton({ focusedMoment, snapshot, focusableSceneObjects }) {
    const snapshotId = snapshot.get('id');
    const to = snapshot.get('to');

    const entityExistsAtFocusedMoment = (focusedMoment == null && to == null) || // either live
      // or historic
      (focusedMoment != null && (to == null || to > focusedMoment));
    let classes = block;
    if (entityExistsAtFocusedMoment) {
      if (!focusableSceneObjects || !focusableSceneObjects[snapshotId]) {
        return null;
      }
      return (
        <Tooltip content="Center in map" align={'rightMiddle'}>
          <SvgIcon
            className={classes}
            type="focus"
            width={15}
            height={15}
            color="#6a8089"
            onClick={() => focusSnapshotId(snapshotId)}
          />
        </Tooltip>
      );
    }

    classes += ' ' + block + '--disabled';
    let tooltip = 'Entity does not exists at the focused point in time. The entity appeared ' +
      'first at ' +
      formatDateTime(snapshot.get('from'));

    if (to != null) {
      tooltip += ' and was last seen before ' + formatDateTime(to) + '.';
    } else {
      tooltip += '.';
    }

    return (
      <Tooltip content={wrapTooltipElement(tooltip)} align={'rightMiddle'}>
        <SvgIcon className={classes} type="focus" width={15} height={15} color="#6a8089" />
      </Tooltip>
    );
  }
);

function focusSnapshotId(id) {
  focusId(id);
}

function wrapTooltipElement(txt) {
  return (
    <span className={block + '__tooltip'}>
      {txt}
    </span>
  );
}
