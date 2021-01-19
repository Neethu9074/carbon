/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { on } from '@instana/observables';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';

import { containsIgnoreCase } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import keyCodes from 'in-components/keyCodes';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ChartContextMenu.mless';

export default function ChartContextMenu({
  immediatelyOpenContextMenu,
  showContextMenu,
  setShowContextMenu,
  onContextMenuClosed,
  bucketWidth,
  leftAligned,
  menuItems,
  style
}) {
  useEffect(() => {
    let onMouseDownSubscription = onContextMenuClosed && on(window, 'mousedown').subscribe(e => onMouseDown(e));
    let keyDownSubscription = onContextMenuClosed && on(window, 'keydown').subscribe(e => onKeyDown(e));
    return () => {
      if (onMouseDownSubscription) {
        onMouseDownSubscription.dispose();
        onMouseDownSubscription = null;
      }
      if (keyDownSubscription) {
        keyDownSubscription.dispose();
        keyDownSubscription = null;
      }
    };
  });

  const onMouseDown = e => {
    const targetClassName = e?.target?.className;
    if (
      onContextMenuClosed &&
      typeof targetClassName === 'string' &&
      !containsIgnoreCase(targetClassName, locals.contextMenu) &&
      !containsIgnoreCase(targetClassName, locals.button) &&
      !containsIgnoreCase(targetClassName, locals.contextMenuActionsButtonsWrapper)
    ) {
      onContextMenuClosed();
    }
  };

  const onKeyDown = e => {
    if (onContextMenuClosed && e.keyCode === keyCodes.escape) {
      onContextMenuClosed();
    }
  };

  const contextMenuButtons = [...menuItems].filter(Boolean).map(config => {
    if (config.onClick) {
      const originalOnClick = config.onClick;
      config.onClick = e => {
        setShowContextMenu(false);
        if (originalOnClick) {
          originalOnClick(e);
        }
      };
    }
    return config;
  });

  const renderButtons = contextMenuButtons => {
    if (contextMenuButtons.length === 0) {
      return null;
    }

    if (contextMenuButtons.length === 1) {
      return <IconButton {...contextMenuButtons[0]} />;
    }

    if (contextMenuButtons.length === 2) {
      return (
        <>
          <IconButton {...contextMenuButtons[0]} />
          <IconButton {...contextMenuButtons[1]} />
        </>
      );
    }

    return (
      <>
        <IconButton {...contextMenuButtons[0]} />
        <IconButton icon="lib_menu_more_horizontal" onClick={toggleContextMenu} />
      </>
    );
  };

  const toggleContextMenu = () => {
    setShowContextMenu(!showContextMenu);
  };

  const buttonProps = {
    className: locals.button,
    kind: 'secondary',
    size: 'compact'
  };

  return (
    <div className={locals.contextMenuActionsButtonsWrapper} style={style}>
      {!immediatelyOpenContextMenu && renderButtons(contextMenuButtons)}
      {showContextMenu && (
        <div
          className={classNames({
            [locals.contextMenu]: true,
            [locals.rightAligned]: !leftAligned
          })}
          style={{
            marginLeft: leftAligned ? 2 : 0,
            marginRight: leftAligned ? 0 : bucketWidth + 2
          }}
        >
          {contextMenuButtons.slice(immediatelyOpenContextMenu ? 0 : 1).map((buttonConfig, index) => (
            <Button
              key={index}
              {...buttonProps}
              icon={buttonConfig.icon}
              href$={buttonConfig.getHref$ && buttonConfig.getHref$()}
              onClick={buttonConfig.onClick}
            >
              {buttonConfig.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function IconButton({ label, icon, getHref$, onClick }) {
  // The <div> element between the Tooltip and the Button components makes sure that the mouse event listeners
  // added by the Tooltip element won't get lost when the Button component changes its root element.
  return (
    <Tooltip content={label ? label : null}>
      <div className={locals.buttonWrapper}>
        <Button
          className={locals.contextMenuOpenButton}
          href$={getHref$ && getHref$()}
          onClick={onClick}
          kind="secondary"
          // margin added by the buttonWrapper
          noAutoMargin
        >
          <SvgIcon className={locals.contextMenuOpenButtonIcon} type={icon} />
        </Button>
      </div>
    </Tooltip>
  );
}

ChartContextMenu.propTypes = {
  immediatelyOpenContextMenu: rpt.bool,
  showContextMenu: rpt.bool,
  setShowContextMenu: rpt.func.isRequired,
  onContextMenuClosed: rpt.func,
  bucketWidth: rpt.number,
  leftAligned: rpt.bool,
  menuItems: rpt.arrayOf(
    rpt.shape({
      name: rpt.string.isRequired,
      icon: rpt.string.isRequired,
      label: rpt.string.isRequired,
      onClick: rpt.func,
      getHref$: rpt.func
    })
  ).isRequired,
  style: rpt.object
};
