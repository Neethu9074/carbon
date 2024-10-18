/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, useState } from 'react';
import classNames from 'classnames';

import { Spacer, SvgIcon, Toggle, IconButton } from '@instana/components';

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
    onRemove,
    editDisabled
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
              <IconButton
                kind="primary"
                className={locals.icon}
                type="lib_actions_edit"
                onClick={isInstanaDefaultRule ? null : () => onEdit()}
                buttonType="button"
                disabled={editDisabled}
              />
              {onRemove && (
                <IconButton
                  kind="primary"
                  className={locals.icon}
                  type="lib_actions_delete"
                  onClick={isInstanaDefaultRule ? null : () => onRemove()}
                  buttonType="button"
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
            <IconButton
              kind="action"
              className={locals.icon}
              type={expand ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
              onClick={() => setExpand(!expand)}
              buttonType="button"
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
