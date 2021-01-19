/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import React from 'react';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

// Sample usage:
//   <SnapshotLink snapshot={?snapshot} />
//   <SnapshotLink snapshotPreview={?snapshotPreview} />

export default connectTo(
  props => {
    if (props.snapshot) {
      const snapshot$ = getSnapshot(props.snapshotId);
      return {
        label: snapshot$.map(s => s != null && getLabel(s)),

        href: snapshot$.flatMap(snapshot => {
          if (!snapshot) {
            return alwaysNull;
          }
          return getModifiedUrlStream(params => {
            params.pathname = physicalDashboardPath;
            params.query.snapshotId = snapshot.get('id');
          });
        })
      };
    } else if (props.snapshotPreview) {
      return {
        label: just(props.snapshotPreview.label),

        href: getModifiedUrlStream(params => {
          params.pathname = physicalDashboardPath;
          params.query.snapshotId = props.snapshotPreview.id;
        })
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
