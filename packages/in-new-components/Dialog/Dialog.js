import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import { generateUniqueShortId } from 'in-services/util/id';
import { stopPropagation } from 'in-services/util/function';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Dialog.mless';

export default function Dialog({
  title,
  onClose,
  children,
  className,
  renderCustomCloseBehaviour,
  withoutBodyPadding,
  showOverflow,
  headless = false
}) {
  const [id] = useState(generateUniqueShortId());

  return (
    <div key={id} className={locals.wrapper} onClick={onClose}>
      <section className={joinClassNames(locals.dialog, className)} onClick={stopPropagation}>
        {!headless && (
          <div className={locals.header}>
            <h1 className={locals.title}>{title}</h1>
            {renderCustomCloseBehaviour ? (
              <>{renderCustomCloseBehaviour()}</>
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

Dialog.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  renderCustomCloseBehaviour: PropTypes.func,
  headless: PropTypes.bool,
  onClose: PropTypes.func,
  showOverflow: PropTypes.bool,
  title: PropTypes.string,
  withoutBodyPadding: PropTypes.bool
};
