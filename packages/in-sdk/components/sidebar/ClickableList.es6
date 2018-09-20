import rpt from 'prop-types';
import React from 'react';

import {
  toggleContent,
  clearContent
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ClickableList.mless';

export const ClickableSnapshotListItem = connectTo(({ children, snapshotId }) => ({
  snapshot: children != null ? undefined : getSnapshot(snapshotId)
}))(function ClickableSnapshotListItem({ snapshotId, snapshot, children, withIcon = false }) {
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
          <Tooltip content={getSingular(snapshot.get('plugin'))}>
            <PluginIcon className={locals.pluginIcon} snapshot={snapshot} />
          </Tooltip>
        )}
        {getLabel(snapshot)}
      </div>
    );
  }

  return <ClickableListItem href$={getLinkToSnapshotInCurrentView(snapshotId)}>{content}</ClickableListItem>;
});

export function ClickableListItem({ onClick, href$, children }) {
  onClick = onClick || stopPropagation;

  if (href$) {
    return (
      <li className={locals.item}>
        <Link href$={href$} onClick={onClick} className={locals.link}>
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

export class ClickableKeyValuePopupListItem extends React.PureComponent {
  static displayName = 'ClickableKeyValuePopupListItem';

  static propTypes = {
    title: rpt.string.isRequired,
    data: rpt.object,
    children: rpt.any
  };

  componentWillUnmount() {
    clearContent();
  }

  render() {
    const data = this.props.data;
    if (data == null || data.size === 0) {
      return null;
    }

    return (
      <ClickableListItem onClick={() => toggleContent({ title: this.props.title, data })}>
        {this.props.children}
      </ClickableListItem>
    );
  }
}
