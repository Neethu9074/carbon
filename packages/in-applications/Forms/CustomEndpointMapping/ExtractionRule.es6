import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { build } from 'in-services/validators/urlPath';
import Toggle from 'in-components/form/Toggle';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ExtractionRule.mless';

export default function ExtractionRule({
  rule,
  reorderable,
  onToggleEnable,
  queryNote,
  queryNoteTested = false,
  isInstanaDefaultRule = false,
  onClick
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.extractionRule]: true,
        [locals.reorderable]: reorderable,
        [locals.isInstanaDefaultRule]: isInstanaDefaultRule,
        [locals.disabled]: !rule.enabled
      })}
    >
      <div className={locals.left}>
        <span className={locals.query}>{rule.query || build(rule.pathSegments)}</span>
        <span
          className={evaluateClassNames({
            [locals.queryNote]: true,
            [locals.queryNoteTested]: queryNoteTested
          })}
        >
          {isInstanaDefaultRule ? 'INSTANA Default Rule' : queryNote}
        </span>
      </div>
      <div className={locals.right}>
        <Toggle className={locals.toggle} checked={rule.enabled} onChange={e => onToggleEnable(e.target.checked)} />
        {!isInstanaDefaultRule && (
          <SvgIcon
            className={locals.icon}
            type="lib_menu_more_vertical"
            width={24}
            height={24}
            onClick={isInstanaDefaultRule ? null : () => onClick(rule)}
          />
        )}
        {isInstanaDefaultRule && <div className={locals.iconPlaceholder} />}
      </div>
    </div>
  );
}
