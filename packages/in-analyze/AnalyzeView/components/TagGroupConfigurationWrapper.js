import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

import locals from './TagGroupConfigurationWrapper.mless';

/**
 * The presentational part of the grouping in the metric configurator.
 * Shows the quick group bar, the "list" of groups, which can only contain one group, and the settings below.
 * Any change calls the related onChange function.
 */
export default function TagGroupConfigurationWrapper({
  quickGroupBar,
  tagGroupList,
  grouping,
  isEmpty = false,
  disabled,
  onDirectionChange,
  isMultiMetrics
}) {
  let emptyMessage = 'No group defined.';
  if (disabled) {
    emptyMessage = isMultiMetrics
      ? 'Grouping is not supported for multiple metrics.'
      : 'Select a stacked chart type to enable grouping.';
  }
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.disabled]: disabled
      })}
    >
      <div className={locals.bar}>{quickGroupBar}</div>
      <div className={locals.list}>
        {!isEmpty && tagGroupList}
        {isEmpty && <div className={locals.empty}>{emptyMessage}</div>}
      </div>
      {!isEmpty && (
        <div className={locals.barBottom}>
          <div className={locals.barBottomContent}>
            <div className={locals.barBottomLeft}>
              <div className={locals.barBottomDrop}>
                <FormGroup>
                  <Label htmlFor="select-top-groups">Select</Label>
                  <Select
                    className={locals.select}
                    id="select-top-groups"
                    value={grouping.get('direction').value}
                    onChange={e => {
                      onDirectionChange(e.target.value);
                    }}
                  >
                    <option value="DESC">Top 5</option>
                    <option value="ASC">Bottom 5</option>
                  </Select>
                </FormGroup>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
