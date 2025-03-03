/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect, useRef } from 'react';
import rpt from 'prop-types';

import {
  keyCodes,
  Pill,
  Ul,
  Li,
  LiHorizontalIndicator,
  LiLoadingSkeleton,
  SearchInput,
  Button
} from '@instana/components';
import { themes } from '@instana/design-tokens';

import { isLandingPage as isCustomDashboardLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import { isLandingPage as isCockpitLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/cockpit';
import { viewPathFullyQualified, dashboardIdUrlParameter } from 'in-custom-dashboards/navigation/url';
import { isNotBlank, compareIgnoreCase, containsIgnoreCase } from 'in-services/util/string';
import { getActiveConfiguration$ } from 'in-client/js/LandingPage/activeConfigration';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { playwithEnabled } from 'in-services/featureFlags';
import { useCockpitLink } from 'in-plg/navigation/paths';
import Lettering from 'in-components/Lettering';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './DashboardSwitcherOverlayPresenter.mless';

const { isArrowUp, isArrowDown, isArrowLeft, isReturn, isTab } = keyCodes;

const SEARCH_INPUT_INDEX = -1;

export default connectTo({
  activeLandingPageConfiguration: getActiveConfiguration$()
})(DashboardSwitcherOverlayPresenter);

function DashboardSwitcherOverlayPresenter({
  customDashboards,
  isLoadingMore,
  onCreateNewDashboard,
  close,
  activeLandingPageConfiguration
}) {
  const [query, setQuery] = useState('');
  const [itemsRefs, setItemsRefs] = useState();
  const [cursor, setCursor] = useState(SEARCH_INPUT_INDEX);
  const searchInputRef = useRef();
  const createDashboardButtonRef = useRef();

  const moveToItem = itemIndex => {
    if (!itemsRefs.current[itemIndex]) {
      return;
    }

    itemsRefs?.current[itemIndex]?.querySelector('a').focus();
  };

  const handleOnArrowUp = event => {
    stopPropagationAndPreventDefault(event);

    const isUp = isArrowUp(event);

    if (isUp) {
      const totalItems = itemsRefs.current.length - 1;
      moveToItem(totalItems);
      setCursor(totalItems);
      return;
    }
  };

  const handleOnArrowDown = event => {
    stopPropagationAndPreventDefault(event);

    const isDown = isArrowDown(event);

    if (isDown) {
      moveToItem(0);
      setCursor(prevState => prevState + 1);
      return;
    }
  };

  const handleButtonKeyDown = event => {
    const isLeft = isArrowLeft(event);
    const isEnter = isReturn(event);
    const isTabPressed = isTab(event);

    handleOnArrowDown(event);
    handleOnArrowUp(event);

    if (isEnter) {
      createDashboardButtonRef.current.click();
    }

    if (isTabPressed) {
      moveToItem(0);
    }

    if (isLeft) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className={locals.overlay}>
      <Ul>
        <Li className={locals.actions}>
          <SearchInput
            inputRef={searchInputRef}
            placeholder={t('in-custom-dashboards:dashboardSwitcher.dashboardSwitcherOverlayPresenter.search')}
            query={query}
            onChange={q => {
              setQuery(q);
              setCursor(SEARCH_INPUT_INDEX);
            }}
            onArrowUp={handleOnArrowUp}
            onArrowDown={handleOnArrowDown}
            autoFocus
          />

          <Button
            ref={createDashboardButtonRef}
            disabled={playwithEnabled}
            kind="action"
            icon="lib_openclose_add_circle_outline"
            className={locals.addDashboard}
            onKeyDown={handleButtonKeyDown}
            onClick={() => {
              onCreateNewDashboard();
              close();
            }}
          >
            {t('in-custom-dashboards:dashboardSwitcher.dashboardSwitcherOverlayPresenter.createDashboard')}
          </Button>
        </Li>
        <DashboardList
          searchInputRef={searchInputRef}
          customDashboards={playwithEnabled ? [] : customDashboards}
          query={query}
          cursor={cursor}
          moveToItem={moveToItem}
          getItemsRefs={setItemsRefs}
          setCursor={setCursor}
          activeLandingPageConfiguration={activeLandingPageConfiguration}
        />
        {isLoadingMore && <LiHorizontalIndicator progress={indeterminateProgress} />}
        {isLoadingMore && <LiLoadingSkeleton />}
      </Ul>
    </div>
  );
}

DashboardSwitcherOverlayPresenter.propTypes = {
  // Loaded via connectTo
  activeLandingPageConfiguration: rpt.any,

  isLoadingMore: rpt.bool,
  onCreateNewDashboard: rpt.func.isRequired,
  close: rpt.func.isRequired,
  customDashboards: rpt.arrayOf(
    rpt.shape({
      id: rpt.string.isRequired,
      title: rpt.string.isRequired
    })
  )
};

function DashboardList({
  customDashboards,
  query,
  activeLandingPageConfiguration,
  getItemsRefs,
  searchInputRef,
  cursor,
  setCursor,
  moveToItem
}) {
  const cockpitLink = useCockpitLink();
  const itemsRefs = React.useRef([]);
  const { location, createHref } = useNavigation();
  const dashboardListLocation = { ...location, pathname: viewPathFullyQualified };

  function customNavigation(id) {
    setOrDeleteMatrixKey(dashboardListLocation, dashboardIdUrlParameter.path, dashboardIdUrlParameter.name, id);
    return createHref(dashboardListLocation);
  }

  let items = (customDashboards || [])
    .map(({ id, title }) => ({
      id,
      title,
      isDefault: isCustomDashboardLandingPage(activeLandingPageConfiguration?.pageKey, id),
      href: customNavigation(id)
    }))
    .sort((a, b) => compareIgnoreCase(a.title, b.title));

  // This should always be the first item in the list.
  items.unshift({
    id: 'standard-system-overview',
    title: 'Instana',
    isDefault: isCockpitLandingPage(activeLandingPageConfiguration?.pageKey),
    titleElement: (
      <>
        <Lettering className={locals.lettering} />
        <Pill color={themes.default.ids.color.option.purple['500']} className={locals.leftMargin}>
          {t('in-custom-dashboards:dashboardSwitcher.dashboardSwitcherOverlayPresenter.builtIn')}
        </Pill>
      </>
    ),
    href: cockpitLink
  });

  if (isNotBlank(query)) {
    items = items.filter(({ title }) => containsIgnoreCase(title, query));
  }

  // Updates itemsRefs after filtering
  useEffect(() => {
    itemsRefs.current = itemsRefs.current.slice(0, items.length);
  }, [items]);

  useEffect(() => {
    if (cursor === SEARCH_INPUT_INDEX) {
      searchInputRef.current.focus();
      return;
    }

    moveToItem(cursor);
  }, [cursor, moveToItem, searchInputRef]);

  // Send itemsRefs to parent component
  useEffect(() => {
    getItemsRefs(itemsRefs);
  }, [getItemsRefs, itemsRefs]);

  const handleOnKeyDown = event => {
    stopPropagationAndPreventDefault(event);

    const isUp = isArrowUp(event);
    const isDown = isArrowDown(event);
    const isEnter = isReturn(event);
    const totalItems = items.length - 1;

    if (isEnter) {
      const linkElement = itemsRefs?.current[cursor]?.querySelector('a');
      linkElement?.click();
    }

    if (isUp || isDown) {
      setCursor(prevCursor => setCursorIndex(isDown, prevCursor, totalItems));
    }
  };

  return (
    <>
      {items.map(({ id, title, titleElement, href, href$, isDefault }, index) => (
        <Li
          id={id}
          key={id}
          href={href}
          href$={href$}
          noAlternatingBg
          onKeyDown={handleOnKeyDown}
          ref={element => itemsRefs.current.splice(index, 1, element)}
          tabIndex={0}
        >
          <div className={locals.itemContent}>
            {titleElement || title}
            {isDefault && (
              <Pill color={themes.default.ids.color.option.blue['500']} className={locals.leftMargin}>
                {t('in-custom-dashboards:dashboardSwitcher.dashboardSwitcherOverlayPresenter.default')}
              </Pill>
            )}
          </div>
        </Li>
      ))}
    </>
  );
}

function setCursorIndex(isDown, prevCursor, totalItems) {
  if (isDown) {
    if (prevCursor < totalItems) {
      return prevCursor + 1;
    }
    return SEARCH_INPUT_INDEX;
  }

  if (prevCursor > SEARCH_INPUT_INDEX) {
    return prevCursor - 1;
  }

  return totalItems;
}
