/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

/* Sample usage:
 *   <SnapshotLink snapshot={?snapshot} />
 *   <SnapshotLink snapshotPreview={?snapshotPreview} />
 * this is only used in a pretty old code base - the in-integration landing page
 * testing was not fully possible, because that page is currently broken (for a long time)
 *
 * In future, this code might be dropped and replaced by other SnapshotLink component...
 */
export default connectTo(
  props => {
    const { location, createHref } = useNavigation();
    if (props.snapshot) {
      const snapshot$ = getSnapshot(props.snapshotId);

      return {
        label: snapshot$.map(s => s != null && getLabel(s)),

        href: snapshot$.flatMap(snapshot => {
          const snapshotLocation = {
            ...location,
            pathname: physicalDashboardPath,
            query: { snapshotId: snapshot.get('id') }
          };
          if (!snapshot) {
            return alwaysNull;
          }
          return createHref(snapshotLocation);
        })
      };
    } else if (props.snapshotPreview) {
      const snapshotLocation = {
        ...location,
        pathname: physicalDashboardPath,
        query: { snapshotId: props.snapshotPreview.id }
      };
      return {
        label: just(props.snapshotPreview.label),

        href: createHref(snapshotLocation)
      };
    }
    return {};
  },
  function SnapshotLink({ label, href }) {
    if (!label || !href) {
      return null;
    }

    return <a href={href}>{label}</a>;
  }
);
