import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Dialog2.mless';

export default function Dialog2({
  title,
  titleIconType,
  onClose,
  children,
  className,
  renderCustomCloseBehaviour,
  withoutBodyPadding,
  showOverflow,
  headless = false,
  doNotCloseOnOutsideClick
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.cursorDefault]: doNotCloseOnOutsideClick
      })}
      onClick={e => (doNotCloseOnOutsideClick ? stopPropagationAndPreventDefault(e) : onClose(e))}
    >
      <section className={joinClassNames(locals.dialog, className)} onClick={stopPropagation}>
        {!headless && (
          <div className={locals.header}>
            {titleIconType ? (
              <div className={locals.customTitle}>
                <SvgIcon size="l" type={titleIconType} />
                <h1 className={locals.title}>{title}</h1>
              </div>
            ) : (
              <h1 className={locals.title}>{title}</h1>
            )}
            {renderCustomCloseBehaviour ? (
              <Fragment>
                <span className={locals.customCloseBehaviour}>{renderCustomCloseBehaviour()}</span>
              </Fragment>
            ) : (
              <SvgIcon className={locals.closeIcon} type="lib_openclose_cancel" size="l" onClick={onClose} />
            )}
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

Dialog2.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  renderCustomCloseBehaviour: PropTypes.func,
  headless: PropTypes.bool,
  onClose: PropTypes.func,
  showOverflow: PropTypes.bool,
  title: PropTypes.string,
  titleIconType: PropTypes.string,
  withoutBodyPadding: PropTypes.bool,
  doNotCloseOnOutsideClick: PropTypes.bool
};
