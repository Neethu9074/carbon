/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';

import locals from './TagGroupConfigurationWrapper.mless';

const emptyMessage = 'No group defined.';

/**
 * The presentational part of the grouping in the metric configurator.
 * Shows the quick group bar, the "list" of groups, which can only contain one group, and the settings below.
 * Any change calls the related onChange function.
 */
export default function TagGroupConfigurationWrapper({
  quickGroupBar,
  tagGroupList,
  grouping,
  onDirectionChange,
  onIncludeOthersChange
}) {
  const hasActiveGrouping = grouping?.by?.groupbyTag?.length > 0;
  return (
    <div
      className={classNames({
        [locals.wrapper]: true
      })}
    >
      <div className={locals.bar}>{quickGroupBar}</div>
      <div className={locals.list}>
        {hasActiveGrouping && tagGroupList}
        {!hasActiveGrouping && <div className={locals.empty}>{emptyMessage}</div>}
      </div>
      {hasActiveGrouping && (
        <div className={locals.barBottom}>
          <div className={locals.barBottomContent}>
            <div className={locals.barBottomLeft}>
              <div className={locals.barBottomDrop}>
                <FormGroup>
                  <Label htmlFor="select-top-groups">Select</Label>
                  <Select
                    className={locals.select}
                    id="select-top-groups"
                    value={grouping.direction}
                    onChange={e => {
                      onDirectionChange(e.target.value);
                    }}
                  >
                    <option value="DESC">Top 5</option>
                    <option value="ASC">Bottom 5</option>
                  </Select>
                </FormGroup>
              </div>
              <div className={locals.barBottomToggle}>
                <Toggle
                  id="display-sum-others"
                  checked={grouping.includeOthers}
                  onChange={() => onIncludeOthersChange(!grouping.includeOthers)}
                />
              </div>
              <div className={locals.barBottomLabel}>Show remaining groups aggregated as &ldquo;Other&ldquo;.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
