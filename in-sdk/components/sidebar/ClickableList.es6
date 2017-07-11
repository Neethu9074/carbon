import rpt from 'prop-types';
import React from 'react';

import {
  toggleContent,
  clearContent
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
import Link from 'in-components/Link';

import './ClickableList.less';

const block = 'in-clickable-list';

export function ClickableSnapshotListItem({ snapshotId, children }) {
  return (
    <ClickableListItem href$={getLinkToSnapshotInCurrentView(snapshotId)}>
      {children}
    </ClickableListItem>
  );
}

function ClickableListItem({ onClick, href$, children }) {
  onClick = onClick || stopPropagation;

  if (href$) {
    return (
      <li className={`${block}__item`}>
        <Link href$={href$} onClick={onClick} className={`${block}__link`}>
          {children}
        </Link>
      </li>
    );
  }

  return (
    <li onClick={onClick} className={`${block}__item`}>
      {children}
    </li>
  );
}

export function ClickableList({ children }) {
  return (
    <ul className={block}>
      {children}
    </ul>
  );
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
