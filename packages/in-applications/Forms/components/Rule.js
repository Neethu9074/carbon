/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, useState } from 'react';
import classNames from 'classnames';

import { Spacer, SvgIcon, Toggle } from '@instana/components';

import locals from './Rule.mless';

const Rule = forwardRef(function Rule(
  {
    name,
    content,
    expandableContent,
    enabled,
    reorderable,
    isInstanaDefaultRule,
    isUnspecified,
    onToggleEnable,
    onEdit,
    onRemove
  },
  ref
) {
  const [expand, setExpand] = useState(false);

  return (
    <div
      className={classNames({
        [locals.rule]: true,
        [locals.reorderable]: reorderable,
        [locals.disabled]: !enabled,
        [locals.fixed]: !expand
      })}
      ref={ref}
    >
      <div className={locals.fixedContent}>
        <div className={locals.reorder}>
          {reorderable ? (
            <SvgIcon className={locals.reorderIcon} type="lib_actions_reorder" />
          ) : (
            <div className={locals.iconPlaceholder} />
          )}
        </div>
        <div className={locals.left}>
          <span className={locals.query}>{name}</span>
          {content}
        </div>

        <div className={locals.right}>
          {isInstanaDefaultRule ? (
            <div className={locals.iconPlaceholder} />
          ) : (
            <>
              <SvgIcon
                className={locals.icon}
                type="lib_actions_edit"
                onClick={isInstanaDefaultRule ? null : () => onEdit()}
              />
              {onRemove && (
                <SvgIcon
                  className={locals.icon}
                  type="lib_actions_delete"
                  onClick={isInstanaDefaultRule ? null : () => onRemove()}
                />
              )}
            </>
          )}
          {onToggleEnable && (
            <>
              <Spacer horizontal="xxsmall" />
              <Toggle defaultToggled={enabled} disabled={isUnspecified} onToggle={onToggleEnable} checked={enabled} />
              <Spacer horizontal="xxsmall" />
            </>
          )}
          {expandableContent ? (
            <SvgIcon
              className={locals.icon}
              type={expand ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
              onClick={() => setExpand(!expand)}
            />
          ) : (
            <div className={locals.iconPlaceholder} />
          )}
        </div>
      </div>

      {expand && <div className={locals.expandableContent}>{expandableContent}</div>}
    </div>
  );
});
export default Rule;
