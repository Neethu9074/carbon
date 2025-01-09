/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Hierarchy.less';

const block = 'in-expand-hierarchy';

export default connectTo(
  props => {
    return {
      snapshots: props.hierarchySnapshots
        ? always(props.hierarchySnapshots)
        : combineLatest(props.hierarchy.toArray().map(id => getSnapshot(id, props.timeConfig)))
    };
  },
  function Hierarchy({
    snapshots,
    useSnapshotLink,
    kind,
    linkClassName,
    pathname,
    timeConfig,
    onClose,
    isCveRedirect
  }) {
    if (!snapshots) {
      return null;
    }

    return (
      <ul className={block}>
        {snapshots.map(snapshot => {
          return (
            <li key={snapshot.get('id')} className={`${block}__item`}>
              <HierarchicalLink
                snapshot={snapshot}
                kind={kind}
                useSnapshotLink={useSnapshotLink}
                linkClassName={linkClassName}
                pathname={pathname}
                timeConfig={timeConfig}
                isCveRedirect={isCveRedirect}
                onClose={onClose}
              />
            </li>
          );
        })}
      </ul>
    );
  }
);
