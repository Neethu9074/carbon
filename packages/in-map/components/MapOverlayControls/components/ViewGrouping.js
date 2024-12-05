/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';
import { Button } from '@instana/components';

import {
  availableGroupings,
  defaultGrouping,
  humanReadableDescriptions,
  viewGroupingShort$
} from 'in-infrastructure/perspectives/viewGrouping';
import {
  containerPath,
  physicalPath,
  useGetLinkToCurrentViewWithViewGrouping
} from 'in-stores/navigation/paths/mainPaths';
import CustomContainerGroupingDialog from 'in-map/components/MapOverlayControls/components/CustomContainerGroupingDialog';
import CustomHostGroupingDialog from 'in-map/components/MapOverlayControls/components/CustomHostGroupingDialog';
import MapButtonGroup from 'in-map/components/MapOverlayControls/components/MapButtonGroup';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import { MAP_GROUPING_CHANGED, track } from 'in-services/tracking/tracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { types, view$ } from 'in-infrastructure/perspectives';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './ViewGrouping.less';

const block = 'in-controls-view-grouping';

export default function ViewGrouping() {
  return (
    <Control
      createMenuContent={() => <ViewGroupingMenu />}
      tooltipText={t('in-map:configurePerspectiveAndGrouping')}
      type="lib_views_grid"
    />
  );
}

function ViewGroupingMenu() {
  const { matchLocation, createHrefToPath } = useNavigation();

  return (
    <div className={block}>
      <div className={`${block}__left`}>
        <h3 className={`${block}__heading`}>{t('in-map:perspective')}</h3>
        <MapButtonGroup>
          <Button
            kind={matchLocation(physicalPath) ? 'primaryv2' : 'info'}
            size="compact"
            href={createHrefToPath(physicalPath)}
            darkTheme
          >
            {t('in-map:host')}
          </Button>
          <Button
            kind={matchLocation(containerPath) ? 'primaryv2' : 'info'}
            size="compact"
            href={createHrefToPath(containerPath)}
            darkTheme
          >
            {t('in-map:container')}
          </Button>
        </MapButtonGroup>
      </div>
      <MenuContent />
    </div>
  );
}

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
        <h3 className={`${block}__heading`}>{t('in-map:grouping')}</h3>
        <MapButtonGroup>
          {availableGroupings.map(grouping => (
            <GroupingButton view={view} grouping={grouping} activeGrouping={activeGrouping} key={grouping} />
          ))}
        </MapButtonGroup>
        <br />
        <Button
          kind={activeGrouping.indexOf('custom-') === 0 ? 'primaryv2' : 'info'}
          darkTheme
          size="compact"
          onClick={() => {
            const dialog = view === 'CONTAINER' ? <CustomContainerGroupingDialog /> : <CustomHostGroupingDialog />;
            addActiveDialog(dialog);
          }}
          className={`${block}__custom-buttoncarbon`}
        >
          {humanReadableDescriptions[view === 'CONTAINER' ? 'custom_container' : 'custom_physical']}
        </Button>
      </div>
    );
  }
);

function GroupingButton({ grouping, activeGrouping, view }) {
  const href = useGetLinkToCurrentViewWithViewGrouping(view === types.container ? 'vg-c' : 'vg-i', grouping);

  return (
    <Button
      kind={activeGrouping === grouping ? 'primaryv2' : 'info'}
      size="compact"
      href={href}
      darkTheme
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
