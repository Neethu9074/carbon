import React from 'react';

import { getCloseDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import theme from 'in-themes';

import locals from './DashboardBreadcrumb.mless';

const Crumb = connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function Crumb({ snapshot, snapshotId, selectedSnapshotId }) {
    if (!snapshot) {
      return (
        <li className={locals.crumbElement}>
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

    let classes = locals.crumbElement;
    const isSelected = snapshot.get('id') === selectedSnapshotId;
    if (isSelected) {
      classes = locals.crumbElementSelected;
    }

    return (
      <Tooltip content={tooltip} align={'bottomMiddle'}>
        <li className={classes}>
          <Link
            href$={getDashboardLink(snapshotId)}
            title="Open dashboard for this entity."
            className={locals.crumbElementLink}
          >
            <HealthyPluginIcon className={locals.crumbElementIcon} dimension={14} snapshot={snapshot} />
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
      <div className={locals.breadcrumbContainer}>
        <Button href$={getCloseDashboardLink()} kind="primary">
          Close
        </Button>
        <div>
          <SvgIcon
            className={locals.crumbSeperator}
            type="lib_arrow_expand_right"
            width={24}
            height={24}
            color={theme.lib.colors.N600Light}
          />
        </div>
        <ul className={locals.dashboardBreadcrumb}>
          {physicalHierarchy.map((id, i) => (
            <div key={id} className={locals.crumbWrapper}>
              <Crumb key={id} snapshotId={id} selectedSnapshotId={snapshotId} />

              {i !== physicalHierarchy.length - 1 ? (
                <div>
                  <SvgIcon
                    className={locals.crumbSeperator}
                    type="lib_arrow_expand_right"
                    width={24}
                    height={24}
                    color={theme.lib.colors.N600Light}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </ul>
      </div>
    );
  }
);
