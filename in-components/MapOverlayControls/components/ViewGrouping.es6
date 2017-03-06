import {combineLatest} from 'reactive-observables';
import React from 'react';

import {availableGroupings, viewGroupingShort$, defaultGrouping, humanReadableDescriptions} from 'in-stores/view/viewGrouping';
import {getLinkToCurrentViewWithViewGrouping} from 'in-stores/navigation/view';
import Control from 'in-components/MapOverlayControls/components/Control';
import ButtonGroup from 'in-components/ButtonGroup';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import {view$} from 'in-stores/view';

const availableGroupings$ = view$
  .map(view => {
    const groupings = availableGroupings[view].slice(0);
    groupings.sort((a, b) => humanReadableDescriptions[a].localeCompare(humanReadableDescriptions[b]));
    return groupings;
  });
const activeGrouping$ = combineLatest([view$, viewGroupingShort$])
  .map(([view, viewGrouping]) => viewGrouping || defaultGrouping[view]);

export default connectTo({
  availableGroupings: availableGroupings$
}, function ViewGrouping({availableGroupings}) {
  if (availableGroupings == null || availableGroupings.length === 0) {
    return null;
  }

  return (
    <Control createMenuContent={() => <MenuContent />}
             tooltipText='Configure grouping'
             type='grouping' />
  );
});

const MenuContent = connectTo({
  availableGroupings: availableGroupings$,
  activeGrouping: activeGrouping$
}, function MenuContent({activeGrouping, availableGroupings}) {
  if (availableGroupings == null) {
    return null;
  }
  return (
    <ButtonGroup>
      {availableGroupings.map(grouping =>
        <GroupingButton grouping={grouping}
                        activeGrouping={activeGrouping}
                        key={grouping} />
      )}
    </ButtonGroup>
  );
});

const GroupingButton = connectTo(props => {
  return {
    href: getLinkToCurrentViewWithViewGrouping(props.grouping)
  };
}, function GroupingButton({href, grouping, activeGrouping}) {
  return (
    <Button kind={activeGrouping === grouping ? 'primary' : 'secondary'}
            size='sm'
            href={href}>
      {humanReadableDescriptions[grouping]}
    </Button>
  );
});
