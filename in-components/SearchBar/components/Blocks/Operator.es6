import React from 'react';

import {updateBlock} from 'in-components/SearchBar/stores/blocks';
import {evaluateClassNames} from 'in-services/util/classnames';

import './Operator.less';


const block = 'in-search-block-operator';

export default function Operator({b, isSelected, onClick}) {
  return (
    <div className={evaluateClassNames({
           [block]: true,
           [`${block}--selected`]: isSelected
         })}
         onClick={onClick}>
      <span className={`${block}__part cm-operator`}>
        {b.get('operator')}
      </span>
      {isSelected ?
        <OperatorMenu b={b}
                      onUpdateBlock={updateBlock} />
      : null}
    </div>
  );
}

function OperatorMenu({b, onUpdateBlock}) {
  const menuBlock = `${block}__operatorcontext-menu`;
  return (
    <div className={menuBlock}>
      <MenuItem b={b}
                content='AND'
                onUpdateBlock={onUpdateBlock} />
      <MenuItem b={b}
                content='OR'
                onUpdateBlock={onUpdateBlock} />
      <MenuItem b={b}
                content='NOT'
                onUpdateBlock={onUpdateBlock} />
    </div>
  );
}


function MenuItem({b, content, onUpdateBlock}) {
  if (b.get('operator') === content) {
    return null;
  }

  return (
    <div className={`${block}__operatorcontext-menu__item cm-operator`}
         onClick={() => onUpdateBlock({block: b, operator: content})}>
      {content}
    </div>
  );
}
