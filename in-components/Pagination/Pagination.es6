import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './Pagination.less';

const block = 'in-pagination';
const element = `${block}__element`;
const pageIndicator = `${block}__page-indicator`;
const switchElement = `${block}__switch`;
const switchIconElement = `${block}__switch-icon`;
const disabledSwitchElement = `${switchElement} ${switchElement}--disabled`;

export default function Pagination({ ariaLabel, currentPage, pageCount, onNextPage, onPrevPage }) {
  const prevDisabled = currentPage === 0;
  const prev = prevDisabled
    ? preventDefault
    : e => {
        e.preventDefault();
        onPrevPage();
      };

  const nextDisabled = currentPage >= pageCount - 1;
  const next = nextDisabled
    ? preventDefault
    : e => {
        e.preventDefault();
        onNextPage();
      };

  return (
    <nav aria-label={ariaLabel}>
      <ul className={block}>
        <li className={element}>
          <a
            href=""
            aria-label="Previous"
            onClick={prev}
            className={prevDisabled ? disabledSwitchElement : switchElement}
          >
            <SvgIcon type="chevron_left" width={5} className={switchIconElement} />
          </a>
        </li>
        <li className={element}>
          <span className={pageIndicator}>
            {`${currentPage + 1} / ${pageCount}`}
          </span>
        </li>
        <li className={element}>
          <a href="" aria-label="Next" onClick={next} className={nextDisabled ? disabledSwitchElement : switchElement}>
            <SvgIcon type="chevron_right" width={5} className={switchIconElement} />
          </a>
        </li>
      </ul>
    </nav>
  );
}

function preventDefault(e) {
  e.preventDefault();
}
