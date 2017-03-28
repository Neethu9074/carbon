import React from 'react';

import TextBlockInput from 'in-components/SearchBar/components/Blocks/TextBlockInput';
import {updateBlock} from 'in-components/SearchBar/stores/blocks';
import {evaluateClassNames} from 'in-services/util/classnames';

import './TextContent.less';


const block = 'in-search-block-text';

export default function TextContent({b, isSelected, onClick}) {
  let content;
  if (isSelected) {
    content = (
      <TextBlockInput b={b}
                      onUpdateBlock={updateBlock} />
    );
  } else {
    content = (
      b.get('tokens').map((token, i) => {
        if (token.get('token') === 'whitespace') {
          return (
            <span key={i}>
              &nbsp;
            </span>
          );
        }
        return (
          <span className={`${block}__part cm-${token.get('token')}`}
               key={i}>
            {token.get('lexeme')}
          </span>
        );
      })
    );
  }

  return (
    <div className={evaluateClassNames({
           [block]: true,
           [`${block}--selected`]: isSelected
         })}
         onClick={onClick}>
      {content}
    </div>
  );
}
