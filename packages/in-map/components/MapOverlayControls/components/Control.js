/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { IconButton } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  menuContent$,
  toggleContent,
  closeCurrentMenu
} from 'in-map/components/MapOverlayControls/stores/menuContentStore';
import { view$, types } from 'in-infrastructure/perspectives/view';
import Tooltip from 'in-components/Tooltip';

import 'in-map/components/MapOverlayControls/components/Control.less';

const block = 'in-control';

export default function Control(props) {
  const onClick = props.onClick;
  const type = props.type;
  const createMenuContent = props.createMenuContent;
  const id = props.id;
  const tooltipText = props.tooltipText;
  const className = props.className;
  const menuContent = useObservable(menuContent$, []);
  const isActive = props.isActive || (menuContent && menuContent.id === (id ? id : type));

  useEffect(() => {
    return () => {
      view$.once(currentView => {
        if (!menuContent) {
          return;
        }

        if (
          menuContent.id === 'lib_views_grid' &&
          (currentView === types.physical || currentView === types.container)
        ) {
          return;
        } else {
          if (menuContent.id === id || menuContent.id === type) {
            closeCurrentMenu();
          }
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuContent]);

  let controlClassName = block;
  if (isActive) {
    controlClassName += ` ${block}--active`;
  }
  if (className) {
    controlClassName += ` ${className}`;
  }

  return (
    <Tooltip content={tooltipText} align="topRight">
      <div
        className={controlClassName}
        onClick={() => {
          if (onClick) {
            onClick();
          }
          if (createMenuContent) {
            toggleContent(getMenuContent(id ? id : type, createMenuContent));
          }
        }}
      >
        <IconButton className={`${block}__icon`} color={themes.default.ids.color.option.white} type={type} />
      </div>
    </Tooltip>
  );
}

function getMenuContent(type, createMenuContent) {
  return {
    id: type,
    content: createMenuContent()
  };
}
