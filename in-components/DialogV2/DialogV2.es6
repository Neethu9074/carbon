import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './DialogV2.less';


const block = 'in-dialog-v2';

export default function DialogV2({childrenOutsideOfContentFlow, children, header, onClose}) {
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
                     onClick={onClose}/>
          : null}
        </header>

        <div className={`${block}__content`}>
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
