/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useCallback } from 'react';
import classNames from 'classnames';

import { IconButton } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  menuContent$,
  toggleContent,
  closeCurrentMenu
} from 'in-map/components/MapOverlayControls/stores/menuContentStore';
import { view$, types } from 'in-infrastructure/perspectives/view';

import locals from './Control.mless';

export default function Control(props) {
  const { ariaLabel, onClick, type, createMenuContent, tooltipText, id, className } = props;

  const menuContent = useObservable(menuContent$, []);
  const menuId = id ?? type;
  const isActive = props.isActive || (menuContent && menuContent.id === menuId);

  useEffect(() => {
    return () => {
      view$.once(currentView => {
        if (!menuContent) return;

        const isGridView = menuContent.id === 'lib_views_grid';
        const isPhysicalOrContainer = currentView === types.physical || currentView === types.container;

        if (isGridView && isPhysicalOrContainer) return;

        if (menuContent.id === menuId) {
          closeCurrentMenu();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuContent]);

  const controlClassName = classNames(locals.inControl, className, {
    [locals.inControlActive]: isActive
  });

  const handleClick = useCallback(() => {
    onClick?.();

    if (createMenuContent) {
      toggleContent({
        id: menuId,
        content: createMenuContent()
      });
    }
  }, [onClick, createMenuContent, menuId]);

  return (
    <IconButton
      {...(id && { id })}
      className={controlClassName}
      isWrapperedByTooltip
      onClick={handleClick}
      color={themes.default.ids.color.option.white}
      type={type}
      aria-label={ariaLabel}
      iconDescription={tooltipText}
    />
  );
}
