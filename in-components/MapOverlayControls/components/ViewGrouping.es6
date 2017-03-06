import {combineLatest} from 'reactive-observables';
import React from 'react';

import {availableGroupings, viewGroupingShort$, defaultGrouping, humanReadableDescriptions} from 'in-stores/view/viewGrouping';
import {physicalViewLink$, containerViewLink$} from 'in-stores/navigation/navigation';
import {getLinkToCurrentViewWithViewGrouping} from 'in-stores/navigation/view';
import Control from 'in-components/MapOverlayControls/components/Control';
import ButtonGroup from 'in-components/ButtonGroup';
import {view$, types} from 'in-stores/view';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-components/MapOverlayControls/components/ViewGrouping.less';


const block = 'in-controls-view-grouping';

export default function ViewGrouping() {
  return (
    <Control createMenuContent={() => <ViewGroupingMenu />}
             tooltipText='Configure perspective and grouping'
             type='grouping' />
  );
}

const ViewGroupingMenu = connectTo({
  view: view$,
  physicalViewLink: physicalViewLink$,
  containerViewLink: containerViewLink$
},
function ViewGroupingMenu({view, physicalViewLink, containerViewLink}) {
  return (
    <div className={block}>
      <div className={`${block}__left`}>
        <h3 className={`${block}__heading`}>
          Perspective
        </h3>
        <ButtonGroup>
          <Button kind={view === types.physical ? 'primary' : 'secondary'}
                  size='sm'
                  href={physicalViewLink}
                  className={`${block}__button`}>
            Host
          </Button>
          <Button kind={view === types.container ? 'primary' : 'secondary'}
                  size='sm'
                  href={containerViewLink}
                  className={`${block}__button`}>
            Container
          </Button>
        </ButtonGroup>
      </div>
      <MenuContent />
    </div>
  );
});

const availableGroupings$ = view$
  .map(view => {
    const groupings = availableGroupings[view].slice(0);
    groupings.sort((a, b) => humanReadableDescriptions[a].localeCompare(humanReadableDescriptions[b]));
    return groupings;
  });
const activeGrouping$ = combineLatest([view$, viewGroupingShort$])
  .map(([view, viewGrouping]) => viewGrouping || defaultGrouping[view]);

const MenuContent = connectTo({
  availableGroupings: availableGroupings$,
  activeGrouping: activeGrouping$
},
function MenuContent({activeGrouping, availableGroupings}) {
  if (availableGroupings == null || availableGroupings.length === 0) {
    return null;
  }
  return (
    <div className={`${block}__right`}>
      <h3 className={`${block}__heading`}>
        Grouping
      </h3>
      <ButtonGroup>
        {availableGroupings.map(grouping =>
          <GroupingButton grouping={grouping}
                          activeGrouping={activeGrouping}
                          key={grouping} />
        )}
      </ButtonGroup>
    </div>
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
            href={href}
            className={`${block}__button`}>
      {humanReadableDescriptions[grouping]}
    </Button>
  );
});
