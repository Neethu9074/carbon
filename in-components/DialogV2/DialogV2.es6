import React from 'react';

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
