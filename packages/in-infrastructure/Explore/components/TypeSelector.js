/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useMemo, useState, useRef } from 'react';
import { isEmpty, isEqual } from 'lodash';
import classNames from 'classnames';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Li } from '@instana/components';

import { groupMatrixParameter, typeMatrixParameter, getLinkToExplore } from 'in-infrastructure/navigation/paths';
import { allInfrastructureType, defaultAllInfraGroup, allTypes } from 'in-infrastructure/Explore/constants';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import getAvailablePlugins from 'in-infrastructure/subscriptions/getAvailablePlugins';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { pendingResult, emptyObject } from 'in-services/fixedObjects';
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

export default function TypeSelector({ onTypeSelected }) {
  const [{ group, type }] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();
  const tagFilterExpression = EMPTY_EXPRESSION;
  const result = useObservable(getAvailablePluginsObservable, [timeConfig, tagFilterExpression]) || pendingResult;
  const getParamsForType = useCallback(type => ({ type, group: updatedGroup(group, type) }), [group]);
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
      props={{ types, getParamsForType, onTypeSelected }}
      withoutWrapper
      content={Dropdown}
      align="bottomLeft"
      focusOnClose
    >
      {({ toggle, isOpen, ref }) => (
        <DashboardHeaderButton size="normal" ref={ref} onClick={toggle} expanded={isOpen} className={locals.button}>
          <TypeRow icon={icon} name={name} className={locals.header} />
        </DashboardHeaderButton>
      )}
    </Overlay>
  );
}

function Dropdown({ getParamsForType, types, close, onTypeSelected }) {
  const [query, setQuery] = useState('');

  const filteredTypes = useMemo(() => types.filter(({ name }) => query === '' || containsIgnoreCase(name, query)), [
    types,
    query
  ]);

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
            href$={getLinkToExplore(getParamsForType(plugin))}
            onDefaultHrefInteractionSideEffect={() => {
              onTypeSelected(plugin);
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
  if (type === allTypes) {
    return allInfrastructureType;
  }
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  return (
    snapshotDefinition &&
    !isEmpty(snapshotDefinition) && {
      plugin: type,
      icon: `lib_infra_${type}`,
      name: getPluginName(type, 2)
    }
  );
}

function updatedGroup(group, type) {
  return !group?.groupbyTag && type === allTypes
    ? defaultAllInfraGroup
    : isEqual(group, defaultAllInfraGroup) && type !== allTypes
    ? emptyObject
    : group;
}

function getAvailablePluginsObservable([timeConfig, tagFilterExpression]) {
  return getAvailablePlugins({ filter: { timeConfig, tagFilterExpression } });
}
