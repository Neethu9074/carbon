/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useRef } from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { MenuButton, MenuItem } from '@instana/carbon';

import { clusterListFullyQualified, clusterOtelListFullyQualified } from 'in-kubernetes/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './KubernetesSourceSelector.mless';

type KubernetesDataSource = 'instanaAgent' | 'otelCollector';

const OTEL_COLLECTOR = 'otelCollector';
const INSTANA_AGENT = 'instanaAgent';

export { OTEL_COLLECTOR, INSTANA_AGENT };

export default function DataSourceSelector() {
  const menuContainerRef = useRef<Element | undefined>();
  const { goToPath, matchLocation } = useNavigation();
  const [selectedItem, setSelectedItem] = useState<KubernetesDataSource>(
    matchLocation(clusterOtelListFullyQualified) ? OTEL_COLLECTOR : INSTANA_AGENT
  );
  const dataSources = {
    instanaAgent: {
      text: t('in-kubernetes:sourceSelector.instanaAgent.text'),
      icon: 'lib_navigation_stan',
      description: t('in-kubernetes:sourceSelector.instanaAgent.description')
    },
    otelCollector: {
      text: t('in-kubernetes:sourceSelector.otelCollector.text'),
      icon: 'lib_openTelemetry',
      description: t('in-kubernetes:sourceSelector.otelCollector.description')
    }
  };

  return (
    <>
      <MenuButton
        id="dataSourceSelector"
        kind="tertiary"
        size="sm"
        menuTarget={menuContainerRef.current}
        //@ts-expect-error
        label={
          <div className={locals.menubutton}>
            <SvgIcon
              className={locals.icon}
              type={dataSources[selectedItem].icon}
              color="currentColor"
              size="xs"
              aria-label={t('in-kubernetes:sourceSelector.label')}
            />
            {dataSources[selectedItem].text}
          </div>
        }
        menuAlignment="bottom-end"
      >
        <MenuItem
          className={locals.menuitem}
          //@ts-expect-error
          label={renderMenuLabel(INSTANA_AGENT, selectedItem)}
          onClick={() => {
            setSelectedItem(INSTANA_AGENT);
            goToPath(clusterListFullyQualified);
          }}
        />
        <MenuItem
          className={locals.menuitem}
          //@ts-expect-error
          label={renderMenuLabel(OTEL_COLLECTOR, selectedItem)}
          onClick={() => {
            setSelectedItem(OTEL_COLLECTOR);
            goToPath(clusterOtelListFullyQualified);
          }}
        />
      </MenuButton>
      <div ref={menuContainerRef as any} className={locals.dropdownMenu} />
    </>
  );

  function renderMenuLabel(item: KubernetesDataSource) {
    const { icon, text, description } = dataSources[item];
    return (
      <div className={locals.option}>
        <SvgIcon className={locals.optionIcon} type={icon} aria-label={text} />
        <div className={locals.optionText}>
          <Typography variant="heading-compact-02">
            <span className={locals.text}>{text}</span>
          </Typography>
          <Typography variant="label-01">
            <div className={locals.description}>{description}</div>
          </Typography>
        </div>
      </div>
    );
  }
}
