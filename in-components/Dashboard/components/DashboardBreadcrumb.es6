import React from 'react';

import getPhysicalHierarchy from 'in-hoc/getPhysicalHierarchy';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {getDashboardLink} from 'in-stores/navigation';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './DashboardBreadcrumb.less';

const block = 'in-dashboard-breadcrumb';
const crumbElement = `${block}__crumb`;

const Crumb = connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId),
    snapshotLink: getDashboardLink(props.snapshotId)
  };
}, function Crumb({snapshot, selectedSnapshotId, snapshotLink}) {
  if (!snapshot) {
    return (
      <li className={crumbElement}>
        <LoadingIndicator type='light'
                          inline={true}
                          style={{
                            height: '13px'
                          }}/>
      </li>
    );
  }

  const label = getSingular(snapshot.get('plugin'));
  const icon = getIcon(snapshot);
  const tooltip = `${getSingular(snapshot.get('plugin'))}: ${getLabel(snapshot)}`;

  let classes = crumbElement;
  const isSelected = snapshot.get('id') === selectedSnapshotId;
  if (isSelected) {
    classes = `${classes} ${crumbElement}--selected`;
  }

  return (
    <Tooltip content={tooltip}
             align={'bottomMiddle'}>
      <li className={classes}>
        <a href={snapshotLink}
           title='Open dashboard for this entity.'
           className={`${crumbElement}-link`}>
          <img src={icon}
               alt='Icon for this type of entity.'
               className={`${crumbElement}-icon`}/>
          {label}
        </a>
      </li>
    </Tooltip>
  );
});


export default getPhysicalHierarchy(function DashboardBreadcrumb({physicalHierarchy, snapshotId}) {
  physicalHierarchy = physicalHierarchy.toArray();

  if (physicalHierarchy.length === 0) {
    physicalHierarchy.push(snapshotId);
  }

  physicalHierarchy.reverse();

  return (
    <ul className={block}>
      {physicalHierarchy.map((id, i) =>
        <div key={id}
             className={`${block}__crumb-wrapper`}>
          <Crumb key={id}
                 snapshotId={id}
                 selectedSnapshotId={snapshotId} />

          {i !== physicalHierarchy.length - 1 ?
            <Icon type='right'
                  className={`${block}__crumb-separator`}/>
          : null}
        </div>
      )}
    </ul>
  );
});
