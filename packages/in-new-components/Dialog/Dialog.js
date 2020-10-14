import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import Header from 'in-new-components/Dialog/Header';
import useObservable from 'in-hooks/useObservable';

import locals from './Dialog.mless';

export default function Dialog({
  className,
  title,
  titleIconType,
  onClose,
  onTitleIconClick,
  children,
  renderCustomCloseBehaviour,
  withoutBodyPadding,
  showOverflow,
  headless = false,
  doNotCloseOnOutsideClick
}) {
  const [scrollshadow, setScrollshadow] = useState(false);
  const isStacked = (useObservable(activeDialogs$, [children]) ?? []).length > 1;

  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.cursorDefault]: doNotCloseOnOutsideClick,
        [locals.isStacked]: isStacked
      })}
      onClick={e => (doNotCloseOnOutsideClick ? stopPropagationAndPreventDefault(e) : onClose(e))}
    >
      <section className={joinClassNames(locals.dialog, className)} onClick={stopPropagation}>
        {!headless && (
          <Header
            icon={titleIconType}
            onIconClick={onTitleIconClick}
            title={title}
            renderCustomCloseBehaviour={renderCustomCloseBehaviour}
            onClose={onClose}
            addScrollShadow={scrollshadow}
          />
        )}
        <div
          className={evaluateClassNames({
            [locals.body]: true,
            [locals.withoutPadding]: withoutBodyPadding,
            [locals.showOverflow]: showOverflow
          })}
          onScroll={e => setScrollshadow(e.currentTarget?.scrollTop > 0)}
        >
          {children}
        </div>
      </section>
    </div>
  );
}

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  renderCustomCloseBehaviour: PropTypes.func,
  headless: PropTypes.bool,
  onClose: PropTypes.func,
  onTitleIconClick: PropTypes.func,
  showOverflow: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  titleIconType: PropTypes.string,
  withoutBodyPadding: PropTypes.bool,
  doNotCloseOnOutsideClick: PropTypes.bool
};
