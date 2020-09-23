import React, { useCallback, useMemo } from 'react';
import { isEmpty } from 'lodash';

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
import { pendingResult, emptyObject } from 'in-services/fixedObjects';
import Overlay from 'in-new-components/overlays/Overlay/Overlay';
import { compareIgnoreCase } from 'in-services/util/string';
import { Ul, Li } from 'in-new-components/lists/List';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
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
      (result?.data?.plugins || [])
        .map(getType)
        .filter(Boolean)
        .concat([allInfrastructureType])
        .sort((a, b) => compareIgnoreCase(a.name, b.name)),
    [result]
  );
  const { icon, name } = getType(type);

  return (
    <Overlay props={{ types, getParamsForType }} withoutWrapper content={Dropdown}>
      {({ toggle, isOpen, refSetter }) => (
        <DashboardHeaderButton size="normal" refSetter={refSetter} onClick={toggle} expanded={isOpen}>
          <TypeRow icon={icon} name={name} />
        </DashboardHeaderButton>
      )}
    </Overlay>
  );
}

function Dropdown({ getParamsForType, types, close }) {
  return (
    <div className={locals.dropdown}>
      <Ul>
        {types.map(({ plugin, icon, name }) => (
          <Li
            key={plugin}
            href$={getLinkToExplore(getParamsForType(plugin))}
            onDefaultHrefInteractionSideEffect={close}
          >
            <TypeRow icon={icon} name={name} />
          </Li>
        ))}
      </Ul>
    </div>
  );
}

function TypeRow({ icon, name }) {
  return (
    <div className={locals.typeRow}>
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
    : group === defaultAllInfraGroup && type !== allTypes
    ? emptyObject
    : group;
}
