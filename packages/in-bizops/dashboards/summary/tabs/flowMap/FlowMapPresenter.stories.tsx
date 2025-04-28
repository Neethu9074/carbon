/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import FlowMapPresenter from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMapPresenter';
import { Canvas } from 'in-bizops/dashboards/summary/tabs/flowMap/Canvas';

const mockMapData = {
  nodes: [
    {
      id: 'invoiceProcessed',
      name: 'Invoice\nprocessed',
      endpointIds: ['NQOSzHdOOoNuy1-qasFU49VtaYk'],
      remainingTargetCount: 5,
      metrics: {
        erroneous_call_count: [[1745425380000, 0]],
        latency: [[1745425380000, 8.0909]],
        count: [[1745425380000, 11]],
        openIssues: [[1745425380000, 0]],
        maxSeverity: [[1745425380000, 0]]
      },
      width: 250,
      height: 100
    },
    {
      id: 'prepareBankTransfer',
      name: 'Prepare\nBank\nTransfer',
      endpointIds: ['Fyis8etqAnr65_Rlw66lxnDIsMk'],
      remainingTargetCount: 0,
      metrics: {
        erroneous_call_count: [[1745425380000, 0]],
        latency: [[1745425380000, 8.2]],
        count: [[1745425380000, 5]],
        openIssues: [[1745425380000, 0]],
        maxSeverity: [[1745425380000, 0]]
      },
      width: 250,
      height: 100
    },
    {
      id: 'approveInvoice',
      name: 'Approve Invoice',
      endpointIds: ['jouP1lLEXPeR4w-m8fNig8k-wGg'],
      remainingTargetCount: 0,
      metrics: {
        erroneous_call_count: [[1745425380000, 0]],
        latency: [[1745425380000, 118.3333]],
        count: [[1745425380000, 24]],
        openIssues: [[1745425380000, 2]],
        maxSeverity: [[1745425380000, 5]]
      },
      width: 250,
      height: 100
    },
    {
      id: 'assignApprover',
      name: 'Assign Approver Group',
      endpointIds: ['jouP1lLEXPeR4w-m8fNig8k-wGg'],
      remainingTargetCount: 0,
      metrics: {
        erroneous_call_count: [[1745425380000, 0]],
        latency: [[1745425380000, 61.0416]],
        count: [[1745425380000, 24]],
        openIssues: [[1745425380000, 2]],
        maxSeverity: [[1745425380000, 5]]
      },
      width: 250,
      height: 100
    },
    {
      id: 'ServiceTask_1',
      name: 'Archive Invoice',
      endpointIds: ['GtXOslR44id_5Q5QHJ_JiMc4p7I'],
      remainingTargetCount: 0,
      metrics: {
        erroneous_call_count: [[1745425380000, 0]],
        latency: [[1745425380000, 14.5909]],
        count: [[1745425380000, 22]],
        openIssues: [[1745425380000, 0]],
        maxSeverity: [[1745425380000, 0]]
      },
      width: 250,
      height: 100
    },
    {
      id: 'reviewInvoice',
      name: 'Review Invoice',
      endpointIds: ['Fyis8etqAnr65_Rlw66lxnDIsMk'],
      remainingTargetCount: 0,
      metrics: {
        erroneous_call_count: [[1745425380000, 0]],
        latency: [[1745425380000, 6]],
        count: [[1745425380000, 3]],
        openIssues: [[1745425380000, 0]],
        maxSeverity: [[1745425380000, 0]]
      },
      width: 250,
      height: 100
    },
    {
      id: 'StartEvent_1',
      name: 'Invoice\nreceived',
      endpointIds: ['jouP1lLEXPeR4w-m8fNig8k-wGg'],
      remainingTargetCount: 0,
      metrics: {
        erroneous_call_count: [[1745425380000, 0]],
        latency: [[1745425380000, 0.3333]],
        count: [[1745425380000, 24]],
        openIssues: [[1745425380000, 2]],
        maxSeverity: [[1745425380000, 5]]
      },
      width: 250,
      height: 100
    },
    {
      id: 'invoice_approved',
      name: 'Invoice\napproved?',
      endpointIds: ['Fyis8etqAnr65_Rlw66lxnDIsMk'],
      remainingTargetCount: 0,
      metrics: {
        erroneous_call_count: [[1745425380000, 0]],
        latency: [[1745425380000, 4.6607]],
        count: [[1745425380000, 23]],
        openIssues: [[1745425380000, 0]],
        maxSeverity: [[1745425380000, 0]]
      },
      width: 250,
      height: 100
    }
  ],
  edges: [
    {
      id: 'assignApprover-approveInvoice',
      sources: ['assignApprover'],
      targets: ['approveInvoice']
    },
    {
      id: 'assignApprover-StartEvent_1',
      sources: ['assignApprover'],
      targets: ['StartEvent_1']
    },
    {
      id: 'invoice_approved-prepareBankTransfer',
      sources: ['invoice_approved'],
      targets: ['prepareBankTransfer']
    },
    {
      id: 'prepareBankTransfer-ServiceTask_1',
      sources: ['prepareBankTransfer'],
      targets: ['ServiceTask_1']
    },
    {
      id: 'StartEvent_1-assignApprover',
      sources: ['StartEvent_1'],
      targets: ['assignApprover']
    },
    {
      id: 'approveInvoice-invoice_approved',
      sources: ['approveInvoice'],
      targets: ['invoice_approved']
    },
    {
      id: 'invoice_approved-reviewInvoice',
      sources: ['invoice_approved'],
      targets: ['reviewInvoice']
    },
    {
      id: 'ServiceTask_1-invoiceProcessed',
      sources: ['ServiceTask_1'],
      targets: ['invoiceProcessed']
    },
    {
      id: 'invoice_approved-ServiceTask_1',
      sources: ['invoice_approved'],
      targets: ['ServiceTask_1']
    },
    {
      id: 'StartEvent_1-approveInvoice',
      sources: ['StartEvent_1'],
      targets: ['approveInvoice']
    },
    {
      id: 'invoice_approved-invoiceProcessed',
      sources: ['invoice_approved'],
      targets: ['invoiceProcessed']
    },
    {
      id: 'prepareBankTransfer-invoiceProcessed',
      sources: ['prepareBankTransfer'],
      targets: ['invoiceProcessed']
    }
  ]
};

const mockTimeConfig = {
  to: null,
  windowSize: 3600000,
  focusedMoment: null,
  autoRefresh: false
};

export const FlowMapPresenterExample = {
  render: () => (
    <div style={{ height: '500px' }}>
      <FlowMapPresenter mapData={mockMapData} addPaginateData={() => {}} timeConfig={mockTimeConfig} />
    </div>
  ),

  name: 'FlowMapPresenter'
};

export const CanvasExample = {
  render: () => (
    <div style={{ height: '500px' }}>
      <Canvas width="100%" height="100vh" defs={undefined}>
        <g transform={`translate(50,50)`}>
          <circle r="45" cx="50" cy="50" fill="red" />
        </g>
      </Canvas>
    </div>
  ),

  name: 'Canvas'
};

export default {
  component: FlowMapPresenter
};
