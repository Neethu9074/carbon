import React from 'react';

import HealthyPluginIcon from 'in-components/HealthyPluginIcon';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { getDashboardLink } from 'in-stores/navigation';
import { emptyList } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './DashboardBreadcrumb.less';

const block = 'in-dashboard-breadcrumb';
const crumbElement = `${block}__crumb`;

const Crumb = connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function Crumb({ snapshot, snapshotId, selectedSnapshotId }) {
    if (!snapshot) {
      return (
        <li className={crumbElement}>
          <LoadingIndicator
            type="light"
            inline
            style={{
              height: '13px'
            }}
          />
        </li>
      );
    }

    const label = getSingular(snapshot.get('plugin'));
    const tooltip = `${label}: ${getLabel(snapshot)}`;

    let classes = crumbElement;
    const isSelected = snapshot.get('id') === selectedSnapshotId;
    if (isSelected) {
      classes = `${classes} ${crumbElement}--selected`;
    }

    return (
      <Tooltip content={tooltip} align={'bottomMiddle'}>
        <li className={classes}>
          <Link
            href$={getDashboardLink(snapshotId)}
            title="Open dashboard for this entity."
            className={`${crumbElement}-link`}
          >
            <HealthyPluginIcon className={`${crumbElement}-icon`} dimension={14} snapshot={snapshot} />
            {label}
          </Link>
        </li>
      </Tooltip>
    );
  }
);

export default connectTo(
  props => {
    return {
      physicalHierarchy: getPhysicalHierarchy(props.snapshotId).startWith(emptyList)
    };
  },
  function DashboardBreadcrumb({ physicalHierarchy, snapshotId }) {
    if (!physicalHierarchy) {
      return null;
    }

    physicalHierarchy = physicalHierarchy.toArray();
    if (physicalHierarchy.length === 0) {
      physicalHierarchy.push(snapshotId);
    }

    physicalHierarchy.reverse();

    return (
      <ul className={block}>
        {physicalHierarchy.map((id, i) =>
          <div key={id} className={`${block}__crumb-wrapper`}>
            <Crumb key={id} snapshotId={id} selectedSnapshotId={snapshotId} />

            {i !== physicalHierarchy.length - 1
              ? <div>
                  <SvgIcon
                    className={`${block}__crumb-separator`}
                    type="chevron_right"
                    width={8}
                    height={8}
                    color="#D5DFE4"
                  />
                </div>
              : null}
          </div>
        )}
      </ul>
    );
  }
);
