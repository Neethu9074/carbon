/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';
import classNames from 'classnames';

import { SvgIcon, IconButton } from '@instana/components';
import { light } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from './Dialog.mless';

export interface Props {
  icon?: string;
  onIconClick?: () => void;
  onClose?: () => void;
  closeTooltip?: string;
  title: string | ReactElement;
  renderCustomCloseBehaviour?: () => ReactElement | undefined;
  addScrollShadow?: boolean;
}

export default function Header({
  icon,
  onIconClick,
  title,
  renderCustomCloseBehaviour,
  onClose,
  closeTooltip,
  addScrollShadow
}: Props) {
  return (
    <div
      className={classNames({
        [locals.header]: true,
        [locals.scrollShadow]: addScrollShadow
      })}
    >
      {icon ? (
        <div className={locals.customTitle}>
          <HeaderIcon icon={icon} onIconClick={onIconClick} />
          <Title title={title} />
        </div>
      ) : (
        <Title title={title} />
      )}
      {renderCustomCloseBehaviour && (
        <span className={locals.customCloseBehaviour}>{renderCustomCloseBehaviour()}</span>
      )}
      {onClose && <Close onClose={onClose} tooltip={closeTooltip} />}
    </div>
  );
}

function HeaderIcon({ icon, onIconClick }: { icon: string; onIconClick?: () => void }) {
  if (onIconClick) {
    return <IconButton type={icon} iconSize="l" onClick={onIconClick} kind="info" alignment="left" />;
  }
  return <SvgIcon size="l" type={icon} />;
}

function Close({ onClose, tooltip }: { onClose?: () => void; tooltip?: string }) {
  const button = (
    <IconButton type="lib_openclose_cancel" iconSize="l" onClick={onClose} kind="info" alignment="right" />
  );
  if (tooltip) {
    return (
      <Tooltip content={tooltip} themeStyle={light}>
        {button}
      </Tooltip>
    );
  }
  return button;
}

export function Title({ title }: { title: string | ReactElement }): ReactElement {
  if (typeof title === 'string') {
    return <h1 className={locals.title}>{title}</h1>;
  }
  return title;
}
