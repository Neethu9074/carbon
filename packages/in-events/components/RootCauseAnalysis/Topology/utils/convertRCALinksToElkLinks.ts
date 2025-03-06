/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ElkExtendedEdge } from 'elkjs/lib/elk-api';

import { generateUniqueShortId } from '@instana/utils';

import { ConnectionsMap } from 'in-events/components/legacy/TopologyUtils';

interface GraphLink extends ElkExtendedEdge {
  dashed: boolean;
  metrics: any;
}

const convertRCALinksToElkLinks = (relationships: ConnectionsMap[]): GraphLink[] => {
  return relationships.map(({ from, to, connectionType, label, metrics }) => ({
    sources: [from],
    targets: [to],
    id: generateUniqueShortId(),
    dashed: connectionType === 'outgoing',
    labels: [{ text: label || '' }],
    metrics
  }));
};

export default convertRCALinksToElkLinks;
