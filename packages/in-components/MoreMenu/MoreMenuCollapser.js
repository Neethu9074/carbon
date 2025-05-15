/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

export default function MoreMenuCollapserWrapper(props) {
  const numItemsUntilCreatingMenu = props.numItemsUntilCreatingMenu || 2;
  const buttonItems = props.items.slice().splice(0, numItemsUntilCreatingMenu);
  const menuItems = props.items.slice(numItemsUntilCreatingMenu);
  const { size = 'normal' } = props;

  return (
    <>
      {buttonItems.map((item, i) => (
        <ComponentResolver key={i} {...props} {...item} Renderer={Button} />
      ))}
      {menuItems.length > 0 && (
        <MoreMenu kind="secondaryDarker" size={size}>
          {menuItems.map((item, i) => (
            <ComponentResolver key={i} {...props} {...item} Renderer={MoreMenuButton} />
          ))}
        </MoreMenu>
      )}
    </>
  );
}

const ComponentResolver = connectTo(props => (props.getObservables ? props.getObservables(props) : {}))(
  function MoreMenuCollapser(props) {
    const {
      Renderer,
      label,
      props: componentProps,
      render,
      icon,
      href$,
      href,
      onClick,
      getTooltip,
      isDisabled,
      closeMenu
    } = props;
    if (render) {
      return render({ ...props, ...componentProps });
    }

    const button = (
      <Renderer
        size="compact"
        kind="secondary"
        icon={icon}
        onClick={
          onClick
            ? () => {
                onClick(props);
                closeMenu?.();
              }
            : undefined
        }
        href$={href$}
        href={href}
        disabled={isDisabled && isDisabled(props)}
        requireTitle
        title={label}
      >
        {label}
      </Renderer>
    );
    if (getTooltip) {
      return <Tooltip content={getTooltip(props)}>{button}</Tooltip>;
    }
    return button;
  }
);

MoreMenuCollapserWrapper.propTypes = {
  size: PropTypes.string,
  numItemsUntilCreatingMenu: PropTypes.number,
  items: PropTypes.array
};
