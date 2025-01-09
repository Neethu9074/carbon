/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { analyzeTagFilterExpression } from 'in-applications/analyze/AnalyzeView2_0/components/analyzeTagFilter';

const traceId = 'e21ef53aa1787929';
const backendQueryModel1 = {
  type: 'EXPRESSION',
  logicalOperator: 'AND',
  elements: [
    {
      type: 'TAG_FILTER',
      name: 'application.name',
      operator: 'EQUALS',
      entity: 'DESTINATION',
      value: 'End-to-End test-7c00fda4-89a2-498e-adfb-32b119bfa3b0-G-app-1'
    },
    { type: 'TAG_FILTER', name: 'trace.id', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'e21ef53aa1787929' }
  ]
};

const backendQueryModel2 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    { type: 'TAG_FILTER', name: 'trace.id', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'e21ef53aa1787929' },
    { type: 'TAG_FILTER', name: 'trace.id', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'e21ef53aa1787929' }
  ]
};

const backendQueryModel3 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    { type: 'TAG_FILTER', name: 'trace.id', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'e21ef53aa1787929' },
    {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: 'e21ef53aa1787929'
        },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'EQUALS',
          entity: 'DESTINATION',
          value: 'End-to-End test-1670865239626-G-1'
        }
      ]
    }
  ]
};

const backendQueryModel4 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    { type: 'TAG_FILTER', name: 'trace.id', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'e21ef53aa1787929' },
    {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: 'e21ef53aa1787929'
        },
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: 'e21ef53aa1787929'
        }
      ]
    }
  ]
};

const backendQueryModel5 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    { type: 'TAG_FILTER', name: 'trace.id', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'e21ef53aa1787929' },
    {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'EQUALS',
          entity: 'DESTINATION',
          value: 'End-to-End test-1665392415358-G-app-1'
        },
        { type: 'TAG_FILTER', name: 'call.type', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'HTTP' }
      ]
    }
  ]
};

const backendQueryModel6 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    { type: 'TAG_FILTER', name: 'trace.id', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'e21ef53aa1787929' },
    {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'EQUALS',
          entity: 'DESTINATION',
          value: 'End-to-End test-1665392415358-G-app-1'
        },
        {
          type: 'EXPRESSION',
          logicalOperator: 'OR',
          elements: [
            { type: 'TAG_FILTER', name: 'call.type', operator: 'EQUALS', entity: 'NOT_APPLICABLE', value: 'HTTP' },
            {
              type: 'TAG_FILTER',
              name: 'trace.id',
              operator: 'EQUALS',
              entity: 'NOT_APPLICABLE',
              value: 'e21ef53aa1787929'
            }
          ]
        }
      ]
    }
  ]
};

const backendQueryModel7 = {
  type: 'TAG_FILTER',
  name: 'trace.id',
  operator: 'EQUALS',
  entity: 'NOT_APPLICABLE',
  value: 'e21ef53aa1787929'
};
const backendQueryModel8 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    {
      type: 'TAG_FILTER',
      name: 'service.name',
      operator: 'EQUALS',
      entity: 'DESTINATION',
      value: 'nginx-web'
    },
    {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: 'e21ef53aa1787929'
        },
        {
          type: 'TAG_FILTER',
          name: 'service.name',
          operator: 'EQUALS',
          entity: 'DESTINATION',
          value: 'nginx-web'
        }
      ]
    }
  ]
};
const backendQueryModel9 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    {
      type: 'TAG_FILTER',
      name: 'service.name',
      operator: 'EQUALS',
      entity: 'DESTINATION',
      value: 'nginx-web'
    },
    {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: 'e21ef53aa1787929'
        },
        {
          type: 'TAG_FILTER',
          name: 'service.name',
          operator: 'EQUALS',
          entity: 'DESTINATION',
          value: 'nginx-web'
        }
      ]
    }
  ]
};
const backendQueryModel10 = {
  type: 'EXPRESSION',
  logicalOperator: 'AND',
  elements: [
    {
      type: 'TAG_FILTER',
      name: 'service.name',
      operator: 'EQUALS',
      entity: 'DESTINATION',
      value: 'nginx-web'
    },
    {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: 'e21ef53aa1787929'
        },
        {
          type: 'TAG_FILTER',
          name: 'service.name',
          operator: 'EQUALS',
          entity: 'DESTINATION',
          value: 'nginx-web'
        }
      ]
    }
  ]
};
const backendQueryModel11 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    {
      type: 'TAG_FILTER',
      name: 'service.name',
      operator: 'EQUALS',
      entity: 'DESTINATION',
      value: 'nginx-web'
    },
    {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: 'd482ce60e2201f02'
        },
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: 'e21ef53aa1787929'
        }
      ]
    }
  ]
};

const backendQueryModel12 = {
  type: 'TAG_FILTER',
  name: 'trace.id',
  operator: 'NOT_EQUAL',
  entity: 'NOT_APPLICABLE',
  value: 'e21ef53aa1787929'
};

const backendQueryModel13 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    {
      type: 'TAG_FILTER',
      name: 'application.name',
      operator: 'EQUALS',
      entity: 'DESTINATION',
      value: 'All Services'
    },
    {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'trace.id',
          operator: 'EQUALS',
          entity: 'NOT_APPLICABLE',
          value: '42bfabe8822b1158'
        },
        {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [
            {
              type: 'TAG_FILTER',
              name: 'application.name',
              operator: 'EQUALS',
              entity: 'DESTINATION',
              value: 'All Services'
            },
            {
              type: 'TAG_FILTER',
              name: 'trace.id',
              operator: 'EQUALS',
              entity: 'NOT_APPLICABLE',
              value: '42bfabe8822b1158'
            }
          ]
        }
      ]
    }
  ]
};

const backendQueryModel14 = {
  type: 'EXPRESSION',
  logicalOperator: 'OR',
  elements: [
    {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: [
        {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [
            {
              type: 'TAG_FILTER',
              name: 'application.name',
              operator: 'EQUALS',
              entity: 'DESTINATION',
              value: 'All Services'
            },
            {
              type: 'TAG_FILTER',
              name: 'trace.id',
              operator: 'EQUALS',
              entity: 'NOT_APPLICABLE',
              value: '42bfabe8822b1158'
            }
          ]
        },
        {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [
            {
              type: 'TAG_FILTER',
              name: 'application.name',
              operator: 'EQUALS',
              entity: 'DESTINATION',
              value: 'All Services'
            },
            {
              type: 'TAG_FILTER',
              name: 'trace.id',
              operator: 'EQUALS',
              entity: 'NOT_APPLICABLE',
              value: '42bfabe8822b1158'
            }
          ]
        }
      ]
    },
    {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: [
        {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [
            {
              type: 'TAG_FILTER',
              name: 'application.name',
              operator: 'EQUALS',
              entity: 'DESTINATION',
              value: 'All Services'
            },
            {
              type: 'TAG_FILTER',
              name: 'trace.id',
              operator: 'EQUALS',
              entity: 'NOT_APPLICABLE',
              value: '42bfabe8822b1158'
            }
          ]
        },
        {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [
            {
              type: 'TAG_FILTER',
              name: 'application.name',
              operator: 'EQUALS',
              entity: 'DESTINATION',
              value: 'All Services'
            },
            {
              type: 'TAG_FILTER',
              name: 'trace.id',
              operator: 'EQUALS',
              entity: 'NOT_APPLICABLE',
              value: '42bfabe8822b1158'
            }
          ]
        }
      ]
    }
  ]
};

describe('analyze tagFilter expression', () => {
  it('trace id in the toplevel with logical operator AND', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel1, traceId);
    expect(isFromSameTrace).toBeTruthy();
  });

  it('trace id in the toplevel with logical operator OR', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel2, traceId);
    expect(isFromSameTrace).toBeTruthy();
  });

  it('trace id with nested OR', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel3, traceId);
    expect(isFromSameTrace).toBeTruthy();
  });
  it('backendQueryModel4', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel4, traceId);
    expect(isFromSameTrace).toBeTruthy();
  });

  it('backendQueryModel5', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel5, traceId);
    expect(isFromSameTrace).toBeFalsy();
  });

  it('backendQueryModel6', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel6, traceId);
    expect(isFromSameTrace).toBeFalsy();
  });
  it('backendQueryModel7', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel7, traceId);
    expect(isFromSameTrace).toBeTruthy();
  });

  it('backendQueryModel8', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel8, traceId);
    expect(isFromSameTrace).toBeFalsy();
  });

  it('backendQueryModel9', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel9, traceId);
    expect(isFromSameTrace).toBeFalsy();
  });

  it('backendQueryModel10', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel10, traceId);
    expect(isFromSameTrace).toBeFalsy();
  });
  it('backendQueryModel11', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel11, traceId);
    expect(isFromSameTrace).toBeFalsy();
  });
  it('backendQueryModel12', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel12, traceId);
    expect(isFromSameTrace).toBeFalsy();
  });
  it('backendQueryModel13', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel13, '42bfabe8822b1158');
    expect(isFromSameTrace).toBeFalsy();
  });
  it('backendQueryModel14', () => {
    const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel14, '42bfabe8822b1158');
    expect(isFromSameTrace).toBeTruthy();
  });
});
