import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  toggleContent,
  clearContent
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './ClickableList.less';

const block = 'in-clickable-list';

export const ClickableSnapshotListItem = connectTo(
  props => {
    return {
      href: getLinkToSnapshotInCurrentView(props.snapshotId)
    };
  },
  function ClickableSnapshotListItem({ href, children }) {
    return <ClickableListItem href={href}>{children}</ClickableListItem>;
  }
);

export function ClickableListItem({ onClick, href, children }) {
  if (__DEV__ && !onClick && !href) {
    throw new Error('Usage of clickable items without onClick and href. This is not the intended usage!');
  }

  onClick = onClick || stopPropagation;

  if (href) {
    return (
      <li className={`${block}__item`}>
        <a href={href} onClick={onClick} className={`${block}__link`}>
          {children}
        </a>
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

export const ClickableKeyValuePopupListItem = React.createClass({
  displayName: 'ClickableKeyValuePopupListItem',

  mixins: [PureRenderMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    data: React.PropTypes.object,
    children: React.PropTypes.any
  },

  componentWillUnmount() {
    clearContent();
  },

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
});
