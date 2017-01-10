import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './Dialog.less';


const block = 'in-dialog';

export default function Dialog({childrenOutsideOfContentFlow, children, header, onClose, contentClassName}) {
  let contentClasses = `${block}__content`;
  if (contentClassName) {
    contentClasses = `${contentClasses} ${contentClassName}`;
  }

  return (
    <section className={block}
             onClick={onClickOutside}>
      {childrenOutsideOfContentFlow}

      <div className={`${block}__content-wrapper`}>
        <header className={`${block}__header`}>
          {header}

          {onClose ?
            <SvgIcon type='x'
                     width={14}
                     className={`${block}__close`}
                     onClick={onClose} />
          : null}
        </header>

        <div className={contentClasses}>
          {children}
        </div>
      </div>
    </section>
  );

  function onClickOutside(e) {
    if (e.target.className === block && onClose) {
      onClose();
    }
  }

}
