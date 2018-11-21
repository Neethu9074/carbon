import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Toggle from 'in-components/form/Toggle';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Rule.mless';

export default function Rule({
  name,
  content,
  enabled,
  reorderable,
  isInstanaDefaultRule = false,
  onToggleEnable,
  onEdit
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.rule]: true,
        [locals.reorderable]: reorderable,
        [locals.disabled]: !enabled
      })}
    >
      <div className={locals.left}>
        <span className={locals.query}>{name}</span>
        {content}
      </div>

      <div className={locals.right}>
        {!isInstanaDefaultRule && (
          <SvgIcon
            className={locals.icon}
            type="lib_actions_edit"
            width={24}
            height={24}
            onClick={isInstanaDefaultRule ? null : () => onEdit()}
          />
        )}
        {isInstanaDefaultRule && <div className={locals.iconPlaceholder} />}
        <Toggle className={locals.toggle} checked={enabled} onChange={e => onToggleEnable(e.target.checked)} />
      </div>
    </div>
  );
}
