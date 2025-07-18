/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';

export interface PipeNode extends ElkNode {
  id: string;
  height: number;
  width: number;
  nodeType?: string;
  name?: string;
  children?: PipeNode[];
}

export interface PipeEdge extends ElkExtendedEdge {
  id: string;
  sources: string[];
  targets: string[];
}
