/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useMemo, useState, useRef, forwardRef } from 'react';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Li } from '@instana/components';

import {
  groupMatrixParameter,
  typeMatrixParameter,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import { allInfrastructureType, defaultAllInfraGroup, allTypes } from 'in-infrastructure/Explore/constants';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import getAvailablePlugins from 'in-infrastructure/subscriptions/getAvailablePlugins';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import { pendingResult, emptyObject } from 'in-services/fixedObjects';
import DropdownButton from 'in-components/Button/DropdownButton';
import { getInteractiveElements } from 'in-services/util/dom';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import { containsIgnoreCase } from 'in-services/util/string';
import { compareIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-components/SearchInput';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './TypeSelector.mless';

const urlStateDefinition = {
  bind: [groupMatrixParameter, typeMatrixParameter]
};

export default function HeaderTypeSelector({ onHrefSideEffect }) {
  const [{ group, type }] = useUrlState(urlStateDefinition);
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const tagFilterExpression = EMPTY_EXPRESSION;
  const getHrefForType = useCallback(
    type => getLinkToInfraEntityExplore({ type, group: updatedGroup(group, type) }),
    [group, getLinkToInfraEntityExplore]
  );
  return (
    <TypeSelector
      getHrefForType={getHrefForType}
      group={group}
      type={type}
      tagFilterExpression={tagFilterExpression}
      onHrefSideEffect={onHrefSideEffect}
      ButtonComponent={DashboardHeaderButton}
      header
    />
  );
}

export function TypeSelector(props) {
  const {
    getHrefForType,
    type,
    tagFilterExpression,
    onTypeChange,
    onHrefSideEffect,
    ButtonComponent,
    header,
    className,
    localGetAvailablePlugins = getAvailablePlugins
  } = props;
  const timeConfig = useTimeConfig();
  const result =
    useObservable(localGetAvailablePlugins({ filter: { timeConfig, tagFilterExpression } }), [
      timeConfig,
      tagFilterExpression
    ]) || pendingResult;
  const types = useMemo(
    () =>
      [allInfrastructureType].concat(
        (result?.data?.plugins || [])
          .map(getType)
          .filter(Boolean)
          .sort((a, b) => compareIgnoreCase(a.name, b.name))
      ),
    [result]
  );
  const { icon, name } = getType(type);

  return (
    <Overlay
      props={{ types, getHrefForType, onHrefSideEffect, onTypeChange }}
      withoutWrapper
      content={Dropdown}
      align="bottomLeft"
      focusOnClose
    >
      {({ toggle, isOpen, ref }) => {
        const Component = ButtonComponent ?? DefaultButton;
        return (
          <Component
            size="normal"
            ref={ref}
            onClick={toggle}
            expanded={isOpen}
            className={classNames(className, { [locals.headerButton]: header })}
          >
            <TypeRow icon={icon} name={name} className={classNames({ [locals.header]: header })} />
          </Component>
        );
      }}
    </Overlay>
  );
}

const DefaultButton = forwardRef(function DefaultButton({ className, ...buttonProps }, ref) {
  return (
    <DropdownButton
      ref={ref}
      {...buttonProps}
      kind={'secondary'}
      className={classNames(className, locals.defaultButton)}
    />
  );
});

function Dropdown({ getHrefForType, types, close, onHrefSideEffect, onTypeChange }) {
  const [query, setQuery] = useState('');

  const filteredTypes = useMemo(
    () => types.filter(({ name }) => query === '' || containsIgnoreCase(name, query)),
    [types, query]
  );

  const listRef = useRef();

  return (
    <div className={locals.dropdown}>
      <div className={locals.searchWrapper}>
        <SearchInput
          placeholder={t('in-infrastructure:explore.search')}
          query={query}
          onChange={setQuery}
          autoFocus
          onReturn={() => {
            const elems = getInteractiveElements(listRef.current);
            elems[0]?.focus();
            if (elems.length === 1) {
              elems[0].click();
            }
          }}
        />
      </div>
      <div ref={listRef} onKeyDown={onArrowKeyDownFocusSiblings}>
        {filteredTypes.map(({ plugin, icon, name }) => (
          <Li
            noAlternatingBg
            key={plugin}
            href={getHrefForType && getHrefForType(plugin)}
            onClick={
              onTypeChange &&
              (() => {
                onTypeChange(plugin !== allTypes ? plugin : undefined);
                close();
              })
            }
            onDefaultHrefInteractionSideEffect={() => {
              if (onHrefSideEffect) {
                onHrefSideEffect(plugin);
              }
              close();
            }}
          >
            <TypeRow icon={icon} name={name} />
          </Li>
        ))}
      </div>
    </div>
  );
}

function TypeRow({ icon, name, className }) {
  return (
    <div className={classNames(locals.typeRow, className)}>
      <SvgIcon className={locals.icon} type={icon} />
      {name}
    </div>
  );
}

function getType(type) {
  if (!type || type === allTypes) {
    return allInfrastructureType;
  }
  return {
    plugin: type,
    icon: getIconType(type),
    name: getPluginName(type, 2)
  };
}

function updatedGroup(group, type) {
  return !group?.groupbyTag && type === allTypes
    ? defaultAllInfraGroup
    : isEqual(group, defaultAllInfraGroup) && type !== allTypes
    ? emptyObject
    : group;
}
