import React, { useCallback, useMemo } from 'react';

import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import getAvailablePlugins from 'in-infrastructure/subscriptions/getAvailablePlugins';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { typeMatrixParameter } from 'in-infrastructure/navigation/paths';
import Overlay from 'in-new-components/overlays/Overlay/Overlay';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import { Ul, Li } from 'in-new-components/lists/List';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TypeSelector.mless';

const urlStateDefinition = {
  bind: [typeMatrixParameter]
};

const emptyTagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };
const allInfrastructureType = { plugin: 'all', name: 'All Infrastructure', icon: 'lib_infrastructure' };

export default function TypeSelector() {
  const [{ type }, onChange] = useUrlState(urlStateDefinition);
  const setType = useCallback(type => onChange({ type }));
  const timeConfig = useTimeConfig();
  const tagFilterExpression = emptyTagFilterExpression;
  const result =
    useObservable(getAvailablePlugins({ filter: { timeConfig, tagFilterExpression } }), [timeConfig]) || pendingResult;
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
    <Overlay props={{ types, setType }} withoutWrapper content={Dropdown}>
      {({ toggle, isOpen, refSetter }) => (
        <DashboardHeaderButton size="normal" refSetter={refSetter} onClick={toggle} expanded={isOpen}>
          <TypeRow icon={icon} name={name} />
        </DashboardHeaderButton>
      )}
    </Overlay>
  );
}

function Dropdown({ setType, types, close }) {
  return (
    <div className={locals.dropdown}>
      <Ul>
        {types.map(({ plugin, icon, name }) => (
          <Li
            key={plugin}
            onClick={() => {
              close();
              setType(plugin);
            }}
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
  if (type === 'all') {
    return allInfrastructureType;
  }
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  return (
    snapshotDefinition && {
      plugin: type,
      icon: `plugin:${type}`,
      name: snapshotDefinition.pluginName.plural
    }
  );
}
