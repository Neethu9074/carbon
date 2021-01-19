/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MultiButton.mless';

export default function MultiButton(props) {
  const { buttons } = props;

  return <Fragment>{buttons.length > 1 ? <MultiButtonDropdown {...props} /> : buttons[0]}</Fragment>;
}

function MultiButtonDropdown({ label, icon, buttons, className, kind }) {
  return (
    <Overlay content={ButtonList} props={{ buttons }} align="bottomMiddle" withoutWrapper>
      {({ toggle, isOpen, refSetter }) => (
        <Button kind={kind ? kind : 'primary'} icon={icon} onClick={toggle} refSetter={refSetter} className={className}>
          {label}
          <SvgIcon className={locals.icon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
        </Button>
      )}
    </Overlay>
  );
}

function ButtonList({ buttons }) {
  return (
    <div className={locals.buttonWrapper}>
      {buttons.map((button, index) => {
        return React.cloneElement(button, {
          key: index,
          className: locals.integrationButton
        });
      })}
    </div>
  );
}
