import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { getOperatorLabel } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes';

import locals from './TagFilterListPresenter.mless';

export default function TagFilterListPresenter({ tagFilters, onTagFilterClick, onRemoveTagFilter }) {
  if (tagFilters.length === 0) {
    return null;
  }

  return (
    <ul className={locals.list}>
      {tagFilters.map((tagFilter, i) => (
        <TagFilterPresenter
          key={i}
          tagFilter={tagFilter}
          onTagFilterClick={onTagFilterClick}
          onRemoveTagFilter={onRemoveTagFilter}
        />
      ))}
    </ul>
  );
}

function TagFilterPresenter({ tagFilter, onTagFilterClick, onRemoveTagFilter }) {
  const node = findSubTreeByFullyQualifiedName(tagFilter.name);
  const tagType = (node && node.type) || 'STRING';

  return (
    <li className={locals.item}>
      <a
        href=""
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          onTagFilterClick(tagFilter);
        }}
        className={locals.itemBlock}
      >
        <SvgIcon className={locals.icon} type={getIcon(tagFilter)} width={24} height={24} />
        <Tag tagFilter={tagFilter} tagType={tagType} /> <Operator tagFilter={tagFilter} tagType={tagType} />{' '}
        <Value tagFilter={tagFilter} tagType={tagType} />
      </a>

      <Pill className={locals.conjunction} color={theme.lib.colors.N400}>
        and
      </Pill>

      <Tooltip content="Remove filter">
        <SvgIcon
          className={locals.removeIcon}
          type="lib_openclose_cancel"
          width={24}
          height={24}
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            onRemoveTagFilter(tagFilter);
          }}
        />
      </Tooltip>
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
