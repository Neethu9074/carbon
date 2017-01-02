import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
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
function EntityInformation({snapshot, label}) {
  if (snapshot === loadingPlaceholder) {
    return (
      <LoadingIndicator inline
                        type='dark'
                        style={{
                          height: '16px'
                        }} />
    );
  } else if (!snapshot) {
    return null;
  }

  return (
    <div className={block}>
      <div className={`${block}__flex-wrapper`}>
        <span className={`${block}__label`}>
          {label ? label : 'On:'}
        </span>

        <PluginIcon className={`${block}__entity-icon`}
                    color='#000'
                    snapshot={snapshot} />
      </div>
      <DashboardLink snapshotId={snapshot.get('id')}
                     className={`${block}__link`}
                     calculateHierarchy>
        {getLabel(snapshot)}
      </DashboardLink>
    </div>
  );
});
