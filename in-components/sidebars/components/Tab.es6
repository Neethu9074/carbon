import irpt from 'react-immutable-proptypes';
import React from 'react';

import {positionNeedsUpdate} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterYPositionStore';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import getSnapshot from 'in-hoc/getSnapshot';

import Tooltip from 'in-components/Tooltip';

import './Tab.less';


const block = 'in-sidebar-tab';
const rpt = React.PropTypes;

export default getSnapshot(SidebarTab);

function SidebarTab({snapshotId, isSelected, snapshot}) {
  if (!snapshot) {
    return null;
  }

  positionNeedsUpdate();

  const _className = isSelected ? block + ' ' + block + '__selected' : block;
  const tooltip = `${getSingular(snapshot.get('plugin'))}: ${getLabel(snapshot)}`;

  return (
    <Tooltip content={tooltip}
             align={'rightMiddle'}>
      <li className={_className}
          onClick={() => setSelectedSnapshotId(snapshotId)}>

        <img src={getIcon(snapshot)}
             alt='Snapshot icon'
             className={block + '__icon'}/>
      </li>
    </Tooltip>
  );
}

SidebarTab.propTypes = {
  snapshotId: rpt.string.isRequired,
  isSelected: rpt.bool.isRequired,
  snapshot: irpt.map
};
