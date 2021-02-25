/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { getPluginName } from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ClickableList.mless';

export const ClickableSnapshotListItem = connectTo(({ children, snapshotId }) => ({
  snapshot: children != null ? undefined : getSnapshot(snapshotId)
}))(function ClickableSnapshotListItem({ snapshotId, snapshot, children, withIcon = false, onClick }) {
  let content = children;
  if (!content) {
    if (!snapshot) {
      return null;
    }

    if (!withIcon) {
      content = getLabel(snapshot);
    }

    content = (
      <div className={locals.labelWithIcon}>
        {withIcon && (
          <Tooltip content={getPluginName(snapshot.get('plugin'), 1)}>
            <PluginIcon className={locals.pluginIcon} snapshot={snapshot} />
          </Tooltip>
        )}
        {getLabel(snapshot)}
      </div>
    );
  }

  return (
    <ClickableListItem href$={getLinkToSnapshotInCurrentView(snapshotId)} onClick={onClick}>
      {content}
    </ClickableListItem>
  );
});

export function ClickableListItem({ onClick, href$, children }) {
  onClick = onClick || stopPropagation;

  if (href$) {
    return (
      <li className={locals.item}>
        <Link className={locals.link} href$={href$} onClick={onClick}>
          {children}
        </Link>
      </li>
    );
  }

  return (
    <li onClick={onClick} className={locals.item}>
      {children}
    </li>
  );
}

export function ClickableList({ children }) {
  return <ul className={locals.list}>{children}</ul>;
}

function stopPropagation(e) {
  e.stopPropagation();
}
