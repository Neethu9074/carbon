import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './EntityInformation.less';


const block = 'in-event-view-event-information';

export default connectTo(props => {
  return {
    snapshot: getSnapshot(props.event.getIn(['problem', 'snapshotId']), props.event.get('start'))
  };
},
function EntityInformation({snapshot}) {
  if (!snapshot) {
    return (
      <LoadingIndicator inline
                               type='dark'
                               style={{
                                 height: '16px'
                               }} />
    );
  }
  const entityType = getSingular(snapshot.get('plugin'));

  return (
    <div className={block}>
      <span className={`${block}__on`}>
        On:
      </span>

      <img src={getIcon(snapshot)}
           alt={`Icon for entities of type ${entityType}`}
           className={`${block}__entity-icon`} />

      <DashboardLink snapshotId={snapshot.get('id')}
                     calculateHierarchy>
        {getLabel(snapshot)}
      </DashboardLink>
    </div>
  );
});
