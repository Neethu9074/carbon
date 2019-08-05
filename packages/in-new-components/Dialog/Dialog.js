import React from 'react';

import { stopPropagation } from 'in-services/util/function';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Dialog.mless';

export default function Dialog({
  title,
  onClose,
  children,
  className,
  withoutBodyPadding,
  showOverflow,
  headless = false
}) {
  return (
    <div className={locals.wrapper} onClick={onClose}>
      <section className={joinClassNames(locals.dialog, className)} onClick={stopPropagation}>
        {!headless && (
          <div className={locals.header}>
            <h1 className={locals.title}>{title}</h1>
            <SvgIcon className={locals.closeIcon} type="lib_openclose_cancel" size="l" onClick={onClose} />
          </div>
        )}
        <div
          className={evaluateClassNames({
            [locals.body]: true,
            [locals.withoutPadding]: withoutBodyPadding,
            [locals.showOverflow]: showOverflow
          })}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
