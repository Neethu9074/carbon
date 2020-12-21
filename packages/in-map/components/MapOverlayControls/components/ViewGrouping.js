import { combineLatest } from '@instana/observables';
import React from 'react';

import {
  availableGroupings,
  viewGroupingShort$,
  defaultGrouping,
  humanReadableDescriptions
} from 'in-stores/view/viewGrouping';
import {
  getLinkToCurrentViewWithViewGrouping,
  physicalPath,
  containerPath
} from 'in-stores/navigation/paths/mainPaths';
import CustomContainerGroupingDialog from 'in-map/components/MapOverlayControls/components/CustomContainerGroupingDialog';
import CustomHostGroupingDialog from 'in-map/components/MapOverlayControls/components/CustomHostGroupingDialog';
import { track, MAP_GROUPING_CHANGED } from 'in-services/tracking/tracking';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getView } from 'in-stores/navigation/navigation';
import MapButtonGroup from 'in-map/components/MapOverlayControls/components/MapButtonGroup';
import { view$, types } from 'in-stores/view';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ViewGrouping.less';

const block = 'in-controls-view-grouping';

export default function ViewGrouping() {
  return (
    <Control
      createMenuContent={() => <ViewGroupingMenu />}
      tooltipText="Configure perspective and grouping"
      type="lib_views_grid"
    />
  );
}

const ViewGroupingMenu = connectTo(
  {
    view: view$
  },
  function ViewGroupingMenu({ view }) {
    return (
      <div className={block}>
        <div className={`${block}__left`}>
          <h3 className={`${block}__heading`}>Perspective</h3>
          <MapButtonGroup>
            <Button
              kind={view === types.physical ? 'primaryv2' : 'info'}
              size="compact"
              href$={getView(physicalPath)}
              className={`${block}__button`}
            >
              Host
            </Button>
            <Button
              kind={view === types.container ? 'primaryv2' : 'info'}
              size="compact"
              href$={getView(containerPath)}
              className={`${block}__button`}
            >
              Container
            </Button>
          </MapButtonGroup>
        </div>
        <MenuContent />
      </div>
    );
  }
);

const availableGroupings$ = view$.map(view => {
  const groupings = availableGroupings[view].slice(0);
  groupings.sort((a, b) => humanReadableDescriptions[a].localeCompare(humanReadableDescriptions[b]));
  return groupings;
});
const activeGrouping$ = combineLatest([view$, viewGroupingShort$]).map(
  ([view, viewGrouping]) => viewGrouping || defaultGrouping[view]
);

const MenuContent = connectTo(
  {
    availableGroupings: availableGroupings$,
    activeGrouping: activeGrouping$,
    view: view$
  },
  function MenuContent({ activeGrouping, availableGroupings, view }) {
    if (availableGroupings == null || availableGroupings.length === 0) {
      return null;
    }
    return (
      <div className={`${block}__right`}>
        <h3 className={`${block}__heading`}>Grouping</h3>
        <MapButtonGroup>
          {availableGroupings.map(grouping => (
            <GroupingButton view={view} grouping={grouping} activeGrouping={activeGrouping} key={grouping} />
          ))}
        </MapButtonGroup>
        <br />
        <Button
          kind={activeGrouping.indexOf('custom-') === 0 ? 'primaryv2' : 'info'}
          size="compact"
          onClick={() => {
            const dialog = view === 'CONTAINER' ? <CustomContainerGroupingDialog /> : <CustomHostGroupingDialog />;
            addActiveDialog(dialog);
          }}
          className={`${block}__custom-button`}
        >
          {humanReadableDescriptions[view === 'CONTAINER' ? 'custom_container' : 'custom_physical']}
        </Button>
      </div>
    );
  }
);

const GroupingButton = connectTo(
  props => {
    return {
      href: getLinkToCurrentViewWithViewGrouping(props.view === types.container ? 'vg-c' : 'vg-i', props.grouping)
    };
  },
  function GroupingButton({ href, grouping, activeGrouping }) {
    return (
      <Button
        kind={activeGrouping === grouping ? 'primaryv2' : 'info'}
        size="compact"
        href={href}
        className={`${block}__button`}
        onClick={() => {
          if (activeGrouping !== grouping) {
            track(MAP_GROUPING_CHANGED);
          }
        }}
      >
        {humanReadableDescriptions[grouping]}
      </Button>
    );
  }
);
