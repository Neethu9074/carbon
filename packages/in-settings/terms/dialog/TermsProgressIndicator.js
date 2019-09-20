import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import theme from 'in-themes';

import locals from './TermsProgressIndicator.mless';

export default function TermsProgressIndicator({ pageNumber = 1 }) {
  return (
    <div className={locals.container}>
      {pageNumber === 2 ? (
        <SvgIcon className={locals.icon} type="lib_check" color={theme.lib.colors.white} size={28} />
      ) : (
        <div
          className={evaluateClassNames({
            [locals.pageIndicator]: true,
            [locals.highlightCurrentPage]: pageNumber === 1
          })}
        >
          1
        </div>
      )}

      <div className={locals.line} />

      <div
        className={evaluateClassNames({
          [locals.pageIndicator]: true,
          [locals.highlightCurrentPage]: pageNumber === 2
        })}
      >
        2
      </div>
    </div>
  );
}
