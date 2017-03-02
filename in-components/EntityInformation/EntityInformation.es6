import React from 'react';

import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import PluginIcon from 'in-components/PluginIcon';
import {always} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './EntityInformation.less';


export const loadingPlaceholder = {};
export const alwaysLoadingPlaceholder$ = always(loadingPlaceholder);

const block = 'in-event-view-event-information';

export default connectTo(props => {
  if (props.snapshotId) {
    return {
      snapshot: getSnapshot(props.snapshotId, props.time)
    };
  }
  return {};
},
function EntityInformation({snapshot, label, useSnapshotLink = false, kind = 'dark' }) {
  if (snapshot === loadingPlaceholder) {
    // This component is used too often within the same view, e.g. trace view with lots of
    // spans. Our loading indicator is too expensive for Chrome to render more than a few hundred
    // times. So show no loading indicator instead.
    return null;
  } else if (!snapshot) {
    return null;
  }

  return (
    <div className={block}>
      <div className={`${block}__flex-wrapper`}>
        <span className={`${block}__label`}>
          {label != undefined ? label : 'On:'}
        </span>

        <PluginIcon className={`${block}__entity-icon`}
                    color={kind === 'dark' ? '#000' : '#fff'}
                    snapshot={snapshot} />
      </div>
      <HierarchicalLink snapshotId={snapshot.get('id')}
                      className={`${block}__link`}
                      useSnapshotLink={useSnapshotLink}
                      kind={kind}
                      calculateHierarchy>
        {getLabel(snapshot)}
      </HierarchicalLink>
    </div>
  );
});
