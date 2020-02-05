import React from 'react';

import StackGroup from 'in-new-components/Stack/components/StackGroup';
import ScrollHints from 'in-components/ScrollHints';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import tabList from 'in-new-components/Stack/tabs';

import locals from './StackPane.mless';

export default function StackPane({ groups, tab, activeTabIndex }) {
  return (
    <ScrollHints className={locals.pane} contentChangeMarker={groups.length}>
      {groups.length ? (
        groups.map(group => <StackGroup key={`${group.relationship}.${group.type}`} group={group} tab={tab} />)
      ) : (
        <EmptyPane activeTabIndex={activeTabIndex} />
      )}
    </ScrollHints>
  );
}

const EmptyPane = ({ activeTabIndex }) => {
  const { icon, emptyMessage } = tabList[activeTabIndex];

  return (
    <div className={locals.emptyPane}>
      <SvgIcon type={icon} size="xxl" />
      <span className={locals.emptyMessage}>{emptyMessage}</span>
    </div>
  );
};
