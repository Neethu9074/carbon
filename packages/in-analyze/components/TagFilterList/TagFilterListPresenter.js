/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { getOperatorLabel } from 'in-analyze/applicationFilter';
import { emptyArray } from 'in-services/fixedObjects';
import { isBlank } from 'in-services/util/string';
import EntityIndicator from '../EntityIndicator';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './TagFilterListPresenter.mless';

export default function TagFilterListPresenter({
  implicitTagFilters = emptyArray,
  tagFilters,
  onTagFilterClick,
  onRemoveTagFilter,
  readonlyFilterNames = emptyArray,
  readonly,
  disabled,
  showEntityIndicator
}) {
  if (tagFilters.length === 0) {
    return null;
  }

  return (
    <ul className={locals.list}>
      {tagFilters
        .filter(f => implicitTagFilters.indexOf(f) === -1)
        .map((tagFilter, i) => (
          <TagFilterPresenter
            key={i}
            tagFilter={tagFilter}
            onTagFilterClick={onTagFilterClick}
            onRemoveTagFilter={onRemoveTagFilter}
            readonly={readonly || readonlyFilterNames.includes(tagFilter.name)}
            disabled={disabled}
            withPadding={readonlyFilterNames.includes(tagFilter.name) && tagFilters.length > 1}
            showEntityIndicator={showEntityIndicator}
          />
        ))}
    </ul>
  );
}

TagFilterListPresenter.propTypes = {
  showEntityIndicator: PropTypes.bool,
  disabled: PropTypes.bool,
  readonlyFilterNames: PropTypes.arrayOf(PropTypes.string),
  implicitTagFilters: PropTypes.array,
  onRemoveTagFilter: PropTypes.func,
  onTagFilterClick: PropTypes.func,
  readonly: PropTypes.bool,
  tagFilters: PropTypes.array
};

function TagFilterPresenter({
  tagFilter,
  onTagFilterClick,
  onRemoveTagFilter,
  readonly,
  disabled,
  withPadding,
  showEntityIndicator
}) {
  const node = findSubTreeByFullyQualifiedName(tagFilter.name);
  const tagType = (node && node.type) || 'STRING';

  return (
    <li
      className={classNames({
        [locals.item]: true,
        [locals.withPadding]: withPadding
      })}
    >
      <a
        href=""
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          if (!readonly) {
            onTagFilterClick(tagFilter);
          }
        }}
        className={classNames({
          [locals.itemBlock]: true,
          [locals.readOnly]: readonly,
          [locals.disabled]: disabled
        })}
      >
        {showEntityIndicator && <EntityIndicator type={tagFilter.name} groupedByEntity={tagFilter.entity} />}
        <SvgIcon className={locals.icon} type={getIcon(tagFilter)} />
        <Tag tagFilter={tagFilter} tagType={tagType} /> <Operator tagFilter={tagFilter} tagType={tagType} />{' '}
        <Value tagFilter={tagFilter} tagType={tagType} />
      </a>

      <div className={locals.conjunction}>
        <Pill className={locals.conjunctionPill} color={theme.lib.colors.N400}>
          {t('in-analyze:components.tagFilterList.and')}
        </Pill>
      </div>

      {!readonly && onRemoveTagFilter && (
        <Tooltip content={t('in-analyze:tagFilterList.tooltipRemoveFilter')}>
          <SvgIcon
            className={locals.removeIcon}
            type="lib_openclose_cancel"
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              onRemoveTagFilter(tagFilter);
            }}
          />
        </Tooltip>
      )}
    </li>
  );
}

function Tag({ tagFilter, tagType }) {
  let name = tagFilter.name;
  if (tagType === 'KEY_VALUE_PAIR') {
    name = `${name}.${getFirstKeyValuePart(tagFilter.stringValue)}`;
  }
  return <span className={locals.tag}>{name}</span>;
}

function Operator({ tagFilter, tagType }) {
  return <span className={locals.operator}>{getOperatorLabel(tagType, tagFilter.operator)}</span>;
}

function Value({ tagFilter, tagType }) {
  let value = null;
  if (tagType === 'KEY_VALUE_PAIR') {
    value = getSecondKeyValuePart(tagFilter.stringValue);
  } else if (tagFilter.stringValue != null) {
    value = tagFilter.stringValue;
  } else if (tagFilter.numberValue != null) {
    value = tagFilter.numberValue;
  } else if (tagFilter.booleanValue != null) {
    value = tagFilter.booleanValue;
  }

  if (value != null) {
    // ensure that React renders boolean values
    value = String(value);
  }

  return <span className={locals.value}>{value}</span>;
}

function getIcon({ name }) {
  if (name === 'application.name') {
    return 'lib_application';
  } else if (name === 'service.name') {
    return 'lib_application_service';
  } else if (name === 'endpoint.name') {
    return 'lib_application_endpoint';
  } else if (name === 'beacon.website.name') {
    return 'lib_website';
  }
  return 'lib_views_tag';
}

function getFirstKeyValuePart(value) {
  return value.split('=', 2)[0];
}

function getSecondKeyValuePart(value) {
  if (!value || isBlank(value)) {
    return null;
  }

  const split = value.split('=', 2);
  if (split.length < 2) {
    return null;
  }
  return split[1];
}
