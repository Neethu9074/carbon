import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {formatDateTime} from 'in-services/formatters/date';
import {setFocusedMoment} from 'in-stores/timeline';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './EntityInformation.less';


const block = 'in-event-view-event-information';

export default connectTo(props => {
  const snapshotId = props.event.getIn(['problem', 'snapshotId']);
  return {
    historicalSnapshot: getSnapshot(snapshotId, props.event.get('start')),
    snapshot: getSnapshot(snapshotId)
  };
},
function EntityInformation({historicalSnapshot, snapshot, event}) {
  if (!historicalSnapshot) {
    return (
      <LoadingIndicator inline={true}
                               type='dark'
                               style={{
                                 height: '16px'
                               }} />
    );
  }
  const entityType = getSingular(historicalSnapshot.get('plugin'));

  return (
    <div className={block}>
      <span className={`${block}__on`}>
        On:
      </span>

      <img src={getIcon(historicalSnapshot)}
           alt={`Icon for entities of type ${entityType}`}
           className={`${block}__entity-icon`}/>

      {snapshot
        ? <DashboardLink snapshotId={historicalSnapshot.get('id')}>
            {getLabel(historicalSnapshot)}
          </DashboardLink>
        : <span>
            Offline, last seen at&nbsp;
            <DashboardLink snapshotId={historicalSnapshot.get('id')}
                           onClick={() => {
                             setFocusedMoment(event.get('start') + 1);
                           }}>
              {formatDateTime(event.get('start'))}
            </DashboardLink>
          </span>
      }
    </div>
  );
});
