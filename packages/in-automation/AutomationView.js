/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewSwitcher from 'in-automation/components/ViewSwitcher';
import { automation } from 'in-automation/navigation/paths';
import Table from 'in-sdk/components/dashboard/Table';
import { Row, Col } from 'in-components/layout/Grid';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

const columns = [
  {
    title: t('in-automation:action:name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-automation:action:description'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.description;
      }
    }
  },
  {
    title: t('in-automation:action:type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.type;
      }
    }
  },
  {
    title: t('in-automation:action:invocations'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row?.stats?.runs?.total.toString() ?? '0';
      }
    }
  },
  {
    title: t('in-automation:action:successRate'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row?.stats?.runspercent?.toString() ?? null;
      }
    }
  },
  {
    title: t('in-automation:action:lastModified'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return new Date(row._modifiedAt).toLocaleString();
      }
    }
  }
];
const rows = [
  {
    _id: 'fd9b605942c73e601db246e505001144',
    name: 'IA Resize DB VM ',
    type: 'HTTP',
    description: '',
    _type: 'HTTP',
    _createdAt: 1648000266025,
    _modifiedAt: 1648000266025,
    id: 'fd9b605942c73e601db246e505001144',
    key: 'fd9b605942c73e601db246e505001144'
  },
  {
    _id: 'fd9b605942c73e601db246e5050013a4',
    name: 'IA Power Off VM',
    type: 'HTTP',
    description: '',
    _type: 'HTTP',
    _createdAt: 1648000305045,
    _modifiedAt: 1648000305045,
    id: 'fd9b605942c73e601db246e5050013a4',
    key: 'fd9b605942c73e601db246e5050013a4'
  },
  {
    _id: 'fd9b605942c73e601db246e5050016ca',
    name: 'IA Install Package - LAMP',
    type: 'HTTP',
    description: '',
    _type: 'HTTP',
    _createdAt: 1648000399812,
    _modifiedAt: 1648000399812,
    id: 'fd9b605942c73e601db246e5050016ca',
    key: 'fd9b605942c73e601db246e5050016ca'
  },
  {
    _id: 'fd9b605942c73e601db246e505001c74',
    name: 'IA Install Package - Websphere ',
    type: 'HTTP',
    description: '',
    _type: 'HTTP',
    _createdAt: 1648000491015,
    _modifiedAt: 1648000491015,
    id: 'fd9b605942c73e601db246e505001c74',
    key: 'fd9b605942c73e601db246e505001c74'
  },
  {
    _id: 'fd9b605942c73e601db246e505002944',
    name: 'IA Power On VM',
    type: 'HTTP',
    description: '',
    _type: 'HTTP',
    _createdAt: 1648000525644,
    _modifiedAt: 1648000525644,
    id: 'fd9b605942c73e601db246e505002944',
    key: 'fd9b605942c73e601db246e505002944'
  },
  {
    _id: 'fd9b605942c73e601db246e50500682e',
    name: 'Open GitHub Issue',
    type: 'HTTP',
    description: 'Creates a new GitHub issue following the template defined in this automation.',
    _type: 'HTTP',
    _createdAt: 1648000593733,
    _modifiedAt: 1648000593733,
    id: 'fd9b605942c73e601db246e50500682e',
    key: 'fd9b605942c73e601db246e50500682e'
  },
  {
    _id: 'fd9b605942c73e601db246e5050077e4',
    name: 'Example: Offload runbook automation',
    type: 'SCRIPT',
    description:
      'This automation can be used to offload runbook execution records to a local filesystem on a linux target.',
    subtype: 'bash',
    _type: 'SCRIPT',
    _createdAt: 1648000593736,
    _modifiedAt: 1648000593736,
    id: 'fd9b605942c73e601db246e5050077e4',
    key: 'fd9b605942c73e601db246e5050077e4'
  },
  {
    _id: 'fd9b605942c73e601db246e505009bd1',
    name: 'IA Update Service',
    type: 'HTTP',
    description: '',
    stats: {
      runs: {
        successful: 9,
        failed: 10,
        canceled: 0,
        executing: 0,
        unsuccessful: 14,
        unknown: 0,
        total: 33
      },
      runspercent: 39,
      executionTime: 3.6666666666666665,
      executionMinTime: 3,
      executionMaxTime: 5
    },
    executionCount: 33,
    successCount: 9,
    _type: 'HTTP',
    _createdAt: 1648472302979,
    _modifiedAt: 1648591130989,
    id: 'fd9b605942c73e601db246e505009bd1',
    key: 'fd9b605942c73e601db246e505009bd1'
  },
  {
    _id: 'fd9b605942c73e601db246e50501ba8a',
    name: 'IA Authentication  ',
    type: 'HTTP',
    description: 'Obtain an access token from IBM Cloud Pak. ',
    stats: {
      runs: {
        successful: 50,
        failed: 1,
        canceled: 0,
        executing: 0,
        unsuccessful: 18,
        unknown: 0,
        total: 69
      },
      runspercent: 74,
      executionTime: 1.9,
      executionMinTime: 1,
      executionMaxTime: 22
    },
    executionCount: 69,
    successCount: 50,
    _type: 'HTTP',
    _createdAt: 1648667905369,
    _modifiedAt: 1648692118142,
    id: 'fd9b605942c73e601db246e50501ba8a',
    key: 'fd9b605942c73e601db246e50501ba8a'
  },
  {
    _id: 'fd9b605942c73e601db246e505027bbf',
    name: 'IA Get Tenant ',
    type: 'HTTP',
    description: '',
    stats: {
      runs: {
        successful: 5,
        failed: 8,
        canceled: 0,
        executing: 0,
        unsuccessful: 14,
        unknown: 0,
        total: 27
      },
      runspercent: 26,
      executionTime: 0.6,
      executionMinTime: 0,
      executionMaxTime: 1
    },
    executionCount: 27,
    successCount: 5,
    _type: 'HTTP',
    _createdAt: 1648671025122,
    _modifiedAt: 1648819233839,
    id: 'fd9b605942c73e601db246e505027bbf',
    key: 'fd9b605942c73e601db246e505027bbf'
  },
  {
    _id: 'fd9b605942c73e601db246e50502cfd8',
    name: 'IA  JSON Parser',
    type: 'SCRIPT',
    description:
      'This is a gap fill solution to parse values from HTTP actions.   Ideally, the action output should be parsed and values obtainable automatically. ',
    subtype: 'bash',
    stats: {
      runs: {
        successful: 43,
        failed: 1,
        canceled: 0,
        executing: 0,
        unsuccessful: 4,
        unknown: 0,
        total: 48
      },
      runspercent: 91,
      executionTime: 1,
      executionMinTime: 1,
      executionMaxTime: 1
    },
    executionCount: 48,
    successCount: 43,
    _type: 'SCRIPT',
    _createdAt: 1648732327989,
    _modifiedAt: 1648747789655,
    id: 'fd9b605942c73e601db246e50502cfd8',
    key: 'fd9b605942c73e601db246e50502cfd8'
  },
  {
    _id: 'fd9b605942c73e601db246e505042c4d',
    name: 'IA Get Tenant SSH',
    type: 'SCRIPT',
    description: 'Work around for http step issues',
    subtype: 'bash',
    stats: {
      runs: {
        successful: 31,
        failed: 0,
        canceled: 0,
        executing: 0,
        unsuccessful: 13,
        unknown: 0,
        total: 44
      },
      runspercent: 70,
      executionTime: 3.5806451612903225,
      executionMinTime: 1,
      executionMaxTime: 32
    },
    executionCount: 44,
    successCount: 31,
    _type: 'SCRIPT',
    _createdAt: 1648738138652,
    _modifiedAt: 1648757733078,
    id: 'fd9b605942c73e601db246e505042c4d',
    key: 'fd9b605942c73e601db246e505042c4d'
  },
  {
    _id: 'fd9b605942c73e601db246e505068ee3',
    name: 'IA Update Service SSH',
    type: 'SCRIPT',
    description: 'Work around for http step issues with modification',
    subtype: 'bash',
    stats: {
      runs: {
        successful: 27,
        failed: 0,
        canceled: 0,
        executing: 0,
        unsuccessful: 12,
        unknown: 0,
        total: 39
      },
      runspercent: 69,
      executionTime: 6.666666666666667,
      executionMinTime: 4,
      executionMaxTime: 13
    },
    executionCount: 39,
    successCount: 27,
    _type: 'SCRIPT',
    _createdAt: 1648752860071,
    _modifiedAt: 1651607595592,
    id: 'fd9b605942c73e601db246e505068ee3',
    key: 'fd9b605942c73e601db246e505068ee3'
  },
  {
    _id: 'AWX:job:cmh-lamp',
    name: 'cmh-lamp',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1646346700297,
    _modifiedAt: 1646347437248,
    id: 'AWX:job:cmh-lamp',
    key: 'AWX:job:cmh-lamp'
  },
  {
    _id: 'AWX:job:Demo ENV Idleness Finder EC2-USER / UCDEV b-cp4waiops-1',
    name: 'Demo ENV Idleness Finder EC2-USER / UCDEV b-cp4waiops-1',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1626441906744,
    _modifiedAt: 1626961175583,
    id: 'AWX:job:Demo ENV Idleness Finder EC2-USER / UCDEV b-cp4waiops-1',
    key: 'AWX:job:Demo ENV Idleness Finder EC2-USER / UCDEV b-cp4waiops-1'
  },
  {
    _id: 'AWX:job:Demo ENV Idleness Finder UBUNTU / UCDEV',
    name: 'Demo ENV Idleness Finder UBUNTU / UCDEV',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1626961120484,
    _modifiedAt: 1626961206082,
    id: 'AWX:job:Demo ENV Idleness Finder UBUNTU / UCDEV',
    key: 'AWX:job:Demo ENV Idleness Finder UBUNTU / UCDEV'
  },
  {
    _id: 'AWX:job:Demo Job Template',
    name: 'Demo Job Template',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1623324694587,
    _modifiedAt: 1623324694587,
    id: 'AWX:job:Demo Job Template',
    key: 'AWX:job:Demo Job Template'
  },
  {
    _id: 'AWX:job:hello-world',
    name: 'hello-world',
    type: 'AWX',
    description: '',
    stats: {
      runs: {
        successful: 1,
        failed: 0,
        canceled: 0,
        executing: 0,
        unsuccessful: 1,
        unknown: 0,
        total: 2
      },
      runspercent: 50,
      executionTime: 9,
      executionMinTime: 9,
      executionMaxTime: 9
    },
    executionCount: 2,
    successCount: 1,
    _type: 'AWX',
    _createdAt: 1648215811993,
    _modifiedAt: 1648235906025,
    id: 'AWX:job:hello-world',
    key: 'AWX:job:hello-world'
  },
  {
    _id: 'AWX:job:Idleness Finder EC2-USER / UCDEV key',
    name: 'Idleness Finder EC2-USER / UCDEV key',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1625065957044,
    _modifiedAt: 1626269751915,
    id: 'AWX:job:Idleness Finder EC2-USER / UCDEV key',
    key: 'AWX:job:Idleness Finder EC2-USER / UCDEV key'
  },
  {
    _id: 'AWX:job:Idleness Finder UBUNTU / UCDEV key',
    name: 'Idleness Finder UBUNTU / UCDEV key',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1625073536354,
    _modifiedAt: 1626269821715,
    id: 'AWX:job:Idleness Finder UBUNTU / UCDEV key',
    key: 'AWX:job:Idleness Finder UBUNTU / UCDEV key'
  },
  {
    _id: 'AWX:job:lamp-stack',
    name: 'lamp-stack',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1642020582286,
    _modifiedAt: 1642020582286,
    id: 'AWX:job:lamp-stack',
    key: 'AWX:job:lamp-stack'
  },
  {
    _id: 'AWX:job:Zombie Finder',
    name: 'Zombie Finder',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1623327284347,
    _modifiedAt: 1624883181264,
    id: 'AWX:job:Zombie Finder',
    key: 'AWX:job:Zombie Finder'
  },
  {
    _id: 'AWX:workflow:test-workflow',
    name: 'test-workflow',
    type: 'AWX',
    description: '',
    _type: 'AWX',
    _createdAt: 1645722508375,
    _modifiedAt: 1645722508375,
    id: 'AWX:workflow:test-workflow',
    key: 'AWX:workflow:test-workflow'
  }
];
export default function AutomationView(props) {
  const actionContext = getMatrixParameter(props.location, automation, 'view');
  return (
    <Sticky
      header={
        <>
          <DashboardHeader
            icon="lib_automation_inverted"
            label={t('in-automation:titleAutomation')}
            title={t('in-automation:titleAutomation')}
            labelForTitle=""
          />
          <DashboardHeaderModule theme={themes.light} withBottomBorder={false}>
            <ViewSwitcher actionContext={actionContext} />
          </DashboardHeaderModule>
          {/* {!eventId && <DashboardHeaderShadowModule />} */}
        </>
      }
    >
      <Row>
        <Col>{actionContext === 'catalog' && <Table cols={columns} rows={rows} />}</Col>
      </Row>
    </Sticky>
  );
}
