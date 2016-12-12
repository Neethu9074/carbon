import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {always} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
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

  const entityType = getSingular(snapshot.get('plugin'));
  return (
    <div className={block}>
      <span className={`${block}__label`}>
        {label ? label : 'On:'}
      </span>

      <img src={getIcon(snapshot)}
           alt={`Icon depicting ${entityType}`}
           className={`${block}__entity-icon`} />

      <DashboardLink snapshotId={snapshot.get('id')}
                     className={`${block}__link`}
                     calculateHierarchy>
        {getLabel(snapshot)}
      </DashboardLink>
    </div>
  );
});
