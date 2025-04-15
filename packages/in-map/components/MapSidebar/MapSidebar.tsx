/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';
import classNames from 'classnames';

import { fromPromise, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { keyCodes } from '@instana/components';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs migration
import { selectedSnapshot$, setSelectedSnapshotId, SnapshotData } from 'in-stores/snapshot';
// @ts-expect-error needs migration
import SidebarBreadcrumb from 'in-map/components/MapSidebar/components/SidebarBreadcrumb';
// @ts-expect-error needs migration
import MapSidebarHeader from 'in-map/components/MapSidebar/components/MapSidebarHeader';
// @ts-expect-error needs migration
import SidebarContent from 'in-map/components/MapSidebar/components/SidebarContent';
// @ts-expect-error needs migration
import { getForgeComponent } from 'in-sdk/getForgeComponent';
import { isUsageInfoPopupEnabled, playwithEnabled } from 'in-services/featureFlags';
// @ts-expect-error needs migration
import connectTo from 'in-hoc/connectTo';
import { timeConfig$ } from 'in-stores/time/config';
import { t } from 'in-i18n';

import locals from './MapSidebar.mless';

interface MapSidebarProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

export default connectTo(
  {
    snapshot: selectedSnapshot$,
    timeConfig: timeConfig$
  },
  function MapSidebar({ snapshot, timeConfig }: MapSidebarProps) {
    const SidebarImpl = useObservable(getSidebarImpl, [snapshot?.get('plugin')]);

    if (!snapshot || !SidebarImpl) return null;

    return <MapSidebarContent snapshot={snapshot} timeConfig={timeConfig} SidebarImpl={SidebarImpl} />;
  }
);

interface MapSidebarContentProps {
  snapshot: SnapshotData;
  SidebarImpl: React.ElementType | unknown;
  timeConfig: TimeConfig;
}

function MapSidebarContent({ SidebarImpl, snapshot, timeConfig }: MapSidebarContentProps) {
  const { isTab, isEscape } = keyCodes;
  const containerRef = useRef<HTMLDivElement>(null);
  const snapshotId = snapshot.get('id');

  // the goal of this script is to:
  // 1. Close the modal when the users presses the Tab key on the last focusable element
  // 2. Close the modal when the user presses the Escape key
  // 3. Move the focus back to the opening tag when the modal closes
  // 4. Close the modal for the edge case when the user goes backwards and lands on the first focusable element
  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (!containerRef.current || (!isTab(e) && !isEscape(e))) return;

    const tagToFocusOnOnExit = document.getElementById(snapshotId);

    const handleExit = () => {
      setSelectedSnapshotId(null);
      tagToFocusOnOnExit?.focus();
      e.preventDefault();
    };

    if (isEscape(e)) {
      handleExit();
      return;
    }

    const allAccordionElements = containerRef.current.querySelectorAll('button.cds--accordion__heading');
    const expandedAccordionElements = containerRef.current.querySelectorAll(
      'button.cds--accordion__heading[aria-expanded="true"]'
    );
    const allLinkElements = containerRef.current.querySelectorAll('a[href]');
    const firstFocusableLink = allLinkElements[0];
    const lastFocusableLink = allLinkElements[allLinkElements.length - 1];
    const lastAccordion = allAccordionElements[allAccordionElements.length - 1];
    const lastExpandedAccordion = expandedAccordionElements[expandedAccordionElements.length - 1];
    const isLastAccordionExpanded = lastAccordion === lastExpandedAccordion;
    const lastFocusableElement = isLastAccordionExpanded ? lastFocusableLink : lastAccordion;

    if (
      (!e.shiftKey && document.activeElement === lastFocusableElement) ||
      (e.shiftKey && document.activeElement === firstFocusableLink)
    ) {
      handleExit();
    }
  };

  return (
    <section
      className={locals.carbonMapSidebar}
      ref={containerRef}
      onKeyDown={keyDownHandler}
      aria-label={t('in-map:accessibility.details')}
    >
      <MapSidebarHeader snapshot={snapshot} timeConfig={timeConfig} />
      <SidebarBreadcrumb snapshotId={snapshot.get('id')} />
      <div
        className={classNames({
          [locals.scrollWrapper]: true,
          [locals.scrollWrapperBanner]: isUsageInfoPopupEnabled || playwithEnabled,
          [locals.scrollWrapperNoBanner]: !isUsageInfoPopupEnabled
        })}
      >
        <SidebarContent snapshot={snapshot} ForgeDetailsComponent={SidebarImpl} />
      </div>
    </section>
  );
}

function getSidebarImpl([plugin]: [string | undefined]): Observable<unknown> | undefined {
  return plugin ? fromPromise(getForgeComponent(`./${plugin}/Sidebar/Details`)) : undefined;
}
