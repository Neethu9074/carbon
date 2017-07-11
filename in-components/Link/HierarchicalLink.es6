import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getDashboardLink, getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
import HealthyPluginIcon from 'in-components/HealthyPluginIcon';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { joinClassNames } from 'in-services/util/classnames';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import Hierarchy from 'in-components/Link/Hierarchy';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './HierarchicalLink.less';

const block = 'in-hierarchical-link';

export default connectTo(
  props => {
    const snapshotId = props.snapshot.get('id');
    const observables = {
      href: props.useSnapshotLink ? getLinkToSnapshotInCurrentView(snapshotId) : getDashboardLink(snapshotId),
      hierarchy: props.calculateHierarchy ? getPhysicalHierarchy(snapshotId, false) : alwaysNull
    };
    if (props.useSnapshotFromHierarchyCallback) {
      observables.hierarchySnapshots = observables.hierarchy.flatMap(hierarchy =>
        combineLatest(hierarchy.toArray().map(id => getSnapshot(id)))
      );
    }
    return observables;
  },
  class extends React.Component {
    static displayName = 'HierarchicalLink';

    state = {
      isExpanded: false
    };

    render() {
      const {
        useSnapshotFromHierarchyCallback,
        getLabel,
        hierarchySnapshots,
        hierarchy,
        className,
        href,
        kind
      } = this.props;
      const isExpanded = this.state.isExpanded;
      const linkClassName = `${block} ${block}${kind === 'dark' ? '__dark' : '__light'}`;
      let { snapshot } = this.props;
      if (useSnapshotFromHierarchyCallback) {
        snapshot = useSnapshotFromHierarchyCallback(snapshot, hierarchySnapshots);
      }
      const label = getSnapshotLabel(snapshot);

      getLabel;
      const link = (
        <Link href={href} onClick={stopPropagation} className={joinClassNames(linkClassName, className)}>
          <HealthyPluginIcon
            className={`${block}__plugin-icon`}
            snapshot={snapshot}
            fallbackColor={kind === 'dark' ? '#000' : '#fff'}
            dimension={12}
          />
          {getLabel ? getLabel(label) : label}
        </Link>
      );

      if (!hierarchy || hierarchy.size === 0) {
        return link;
      }

      return (
        <div className={`${block}__link-wrapper`}>
          <SvgIcon
            className={`${block}__info-icon ${block}__info-icon--${kind}`}
            onClick={this.onClick}
            type={isExpanded ? 'timeline_close' : 'timeline_open'}
            width={12}
            height={12}
          />
          {isExpanded
            ? <Hierarchy
                hierarchy={hierarchy}
                kind={kind}
                hierarchySnapshots={hierarchySnapshots}
                useSnapshotLink={this.props.useSnapshotLink}
              />
            : link}
        </div>
      );
    }

    onClick = e => {
      stopPropagation(e);
      this.setState({ isExpanded: !this.state.isExpanded });

      if (this.props.onClick) {
        this.props.onClick();
      }
    };
  }
);

function stopPropagation(e) {
  e.stopPropagation();
}
