import React, { useCallback, useMemo, useState, useRef } from 'react';
import { isEmpty, isEqual } from 'lodash';

import {
  emptyTagFilterExpression,
  allInfrastructureType,
  defaultAllInfraGroup,
  allTypes
} from 'in-infrastructure/Explore/constants';
import { groupMatrixParameter, typeMatrixParameter, getLinkToExplore } from 'in-infrastructure/navigation/paths';
import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import getAvailablePlugins from 'in-infrastructure/subscriptions/getAvailablePlugins';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { pendingResult, emptyObject } from 'in-services/fixedObjects';
import Overlay from 'in-new-components/overlays/Overlay/Overlay';
import { getInteractiveElements } from 'in-services/util/dom';
import { containsIgnoreCase } from 'in-services/util/string';
import { joinClassNames } from 'in-services/util/classnames';
import { compareIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import { Li } from 'in-new-components/lists/List';
import useUrlState from 'in-hooks/useUrlState';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TypeSelector.mless';

const urlStateDefinition = {
  bind: [groupMatrixParameter, typeMatrixParameter]
};

export default function TypeSelector() {
  const [{ group, type }] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();
  const tagFilterExpression = emptyTagFilterExpression;
  const result =
    useObservable(getAvailablePlugins({ filter: { timeConfig, tagFilterExpression } }), [timeConfig]) || pendingResult;
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
    <Overlay props={{ types, getParamsForType }} withoutWrapper content={Dropdown} align="bottomLeft" focusOnClose>
      {({ toggle, isOpen, refSetter }) => (
        <DashboardHeaderButton
          size="normal"
          refSetter={refSetter}
          onClick={toggle}
          expanded={isOpen}
          className={locals.button}
        >
          <TypeRow icon={icon} name={name} className={locals.header} />
        </DashboardHeaderButton>
      )}
    </Overlay>
  );
}

function Dropdown({ getParamsForType, types, close }) {
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
          placeholder="Search"
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
            onDefaultHrefInteractionSideEffect={close}
            onDefaultHrefIncludePrimaryElements
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
    <div className={joinClassNames(locals.typeRow, className)}>
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
      icon: `plugin:${type}`,
      name: snapshotDefinition.pluginName.plural
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
