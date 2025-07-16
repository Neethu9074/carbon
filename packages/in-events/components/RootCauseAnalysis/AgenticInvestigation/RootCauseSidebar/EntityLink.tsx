/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

// eslint-disable-next-line no-restricted-imports
import { Link } from '@carbon/react';
import React, { FC } from 'react';

import { SvgIcon } from '@instana/components';

import {
  getIconForRCADisplay,
  trackClick,
  TrackRcaClickProps,
  useGenerateLinkToDashboard
} from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { useIncident } from 'in-events/components/providers/IncidentProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { ServiceLabel } from 'in-types';

import locals from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/EntityLink.mless';

const capatalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface EntityLinkProps {
  label: string;
  tracking: TrackRcaClickProps;
  type?: string;
  index?: number;
  isLast?: boolean;
  additionalServices?: ServiceLabel[];
  entityId?: string;
  plugin?: string;
}

/**
 * Tree view component that renders horizontal and vertical lines
 * to represent a hierarchical structure
 */
const TreeView: FC<{ isLast?: boolean }> = ({ isLast = false }) => {
  return (
    <div className={locals.treeView}>
      <div className={isLast ? locals.verticalLineShort : locals.verticalLine} />
      <div className={locals.horizontalLine} />
    </div>
  );
};

const EntityLink: FC<EntityLinkProps> = ({
  label,
  tracking,
  type,
  index = 0,
  isLast = false,
  additionalServices = [],
  entityId,
  plugin
}) => {
  const showTreeView = index > 0;
  const { location } = useNavigation();
  const { relatedAPInfo } = useRootCauseTopologyDataContext();
  const { incident } = useIncident();
  const incidentTimeWindow = getIncidentTimeConfig(incident);

  // Generate link if entityType and entityId are provided, otherwise use the provided link
  const generatedLink = useGenerateLinkToDashboard(
    type || '',
    entityId,
    location,
    relatedAPInfo?.id || '',
    incidentTimeWindow
  );

  return (
    <div className={locals.entityLink}>
      {showTreeView && <TreeView isLast={isLast} />}
      <span className={locals.decorator}>
        <span className={locals.decoratorLabel}>
          <SvgIcon type={getIconForRCADisplay(type as string, plugin)} size="xxs" />
          {plugin ? capatalize(plugin) : capatalize(type as string)}
        </span>
        <Link
          aria-label={label}
          href={generatedLink}
          className={locals.decoratorValue}
          title={label}
          onClick={() => {
            trackClick(tracking);
          }}
        >
          <span className={locals.labelText}>{label}</span>
        </Link>
        {additionalServices.length > 1 && <AdditionalServices additionalServices={additionalServices} />}
      </span>
    </div>
  );
};

const AdditionalServices: FC<{ additionalServices: ServiceLabel[] }> = ({ additionalServices }) => {
  return (
    <MoreMenu icon="lib_openclose_add_box" size="compact">
      {additionalServices.map(service => (
        <ServiceLink key={service.id} service={service} />
      ))}
    </MoreMenu>
  );
};

interface ServiceLinkProps {
  service: ServiceLabel;
}

const ServiceLink: FC<ServiceLinkProps> = ({ service }) => {
  const { location } = useNavigation();
  const { relatedAPInfo } = useRootCauseTopologyDataContext();
  const { incident } = useIncident();
  const incidentTimeWindow = getIncidentTimeConfig(incident);
  const linkToService = useGenerateLinkToDashboard(
    'service',
    service.id,
    location,
    relatedAPInfo?.id || '',
    incidentTimeWindow
  );

  return <MoreMenuButton href={linkToService}>{service.label}</MoreMenuButton>;
};

export default EntityLink;
