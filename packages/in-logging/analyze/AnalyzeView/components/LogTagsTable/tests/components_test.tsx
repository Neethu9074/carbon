/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { LogItem, Result } from '@instana/types';

import { Actions } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/Tag';
import * as useNavigationModule from 'in-stores/navigation/hooks/useNavigation';

const sampleLogLevel = 'WARN';
const sampleLog = {
  data: {
    itemId: '1805F2DA180B2680A52CBDC6A0E45CA61805F2DA180B2680000000000000000D',
    timestamp: 1731056650314,
    message: 'Failed to notify {} of event {} on the {} integration channel with id {} due to {}',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: sampleLogLevel,
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.streamName',
        key: null,
        stringValue: 'log.slf4j',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'service.name',
        key: null,
        stringValue: 'issue-tracker',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: '_msg_param0',
        stringValue: 'issue.close',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: '_msg_param1',
        stringValue: 'HDPP6VDUToe1j-4EEvaQ_Q',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: '_msg_param2',
        stringValue: 'WEB_HOOK',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: '_msg_param3',
        stringValue: '9ps4jnZI4vVNu725',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: '_msg_param4',
        stringValue:
          "Failed to send message to Custom Webhook 'https://webhook.site/a44398fa-716d-4058-bf31-6762b55b3ab7' with status code: 429. Reason: Too many requests",
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: 'application_ids',
        stringValue:
          '0CSbk340Que4pTcvpxCf4A,6eS-NEmqQU2JI7fqUUsEHw,75BX_9xESMmTLPVjzuJqVQ,7c2mCYl4SiaWAXC8jhJTrQ,8PzdPnY8SlW8RTdrjYIn5g,8nxvniefT8iYzFK6K-j3YQ,9b9BtSmlSOitOI2g1DDsLA,AMh5TFJmSXqv4sqmg0Dnmw,CjDPZw-vTZGubRzsRIOJdg,DYww8pPeS-e9O-_vRZ2-bw,EtUaKj0sSu2tkQGY1D_MDg,IR-PEYzUTzuxcfCK6p0HTg,JBslXCNOSqqJbT3C6oXfhA,KmKCoVw6RKS72oAm-dQaeg,MX1ZrbIeTKavQeb0caNN_Q,OrnlcxNHRYGol-da3ZB4YQ,SXgulE-1T0Kr0apAuZjQtA,SgyVze2fQOCdtyFGFp_3YQ,TGHyNAFwRfSRY6ua_2WRDA,U_xJYF1yScKwCH4blH5-5w,V8UHx7QRT3aj30FhpiV0yQ,VYOln_s9QwerFndkvspYlQ,Viw4bKrfQ46WFpeyWvr4kg,Wi6lRIEBSTeXyxrsz-3bpQ,XpP2CVGJToGAeDtGvouk1w,YNV0Lrs4Re-aY5-ntmIpdg,ZJ0tqO2OSqq-Bp9UA89dYQ,ZOi0te_ERE-mRm-9zsbwdg,ZZH5gyYSRWyvLE8HTBpXjQ,btg-B701Rx6o9QNXUS4TVw,eZC_nqKaQzi_ub3Z7SCC0Q,g41sdvjtQTCaVBCI5KlD-g,go17fQ5ZQ8Ctbc19C8hR3w,hpY3YjbxSm6jlrUqIEcl8w,mS5QiJWxRneixWGYN9DGEA,oNh8Fi8gSTajU2z8_rmQBg,qnDOmaFzRS2wu0ve2-b5xQ,uRSFdBcZQq2oDObXjVltDw',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: 'endpoint_name',
        stringValue: 'sdk.callConfiguredIntegration',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: 'endpoint_type',
        stringValue: 'SDK',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: 'service_id',
        stringValue: 'e87d1583edcad157168a356f6608f208fdc27a70',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.traceId',
        key: null,
        stringValue: '000000000000000090210ea281dfa18f',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.spanId',
        key: null,
        stringValue: '7000aea74f6f596d',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'expiration.ts.seconds',
        key: null,
        stringValue: null,
        longValue: 1733648653,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'containerd.containerId',
        key: null,
        stringValue: '3d4239c1053d3da7f86278ffb3148cc19c1d6a991cea26d415d9ef0eeefb3b9c',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'id.process',
        key: null,
        stringValue: 'F09dGksN_Yc_vZ8J0I7_x_KmGk8',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'id.containerd',
        key: null,
        stringValue: 'k20QFSfrPtix9FMZ4hveVbZkuhE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'kubernetes.pod.name',
        key: null,
        stringValue: 'instana-test-issue-tracker-99999999',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'id.host',
        key: null,
        stringValue: 'TSCHzbyvvvRZ4Aua-VE75fcWpY8',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'host.name',
        key: null,
        stringValue: 'ip-99-99-99-99',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'process.id',
        key: null,
        stringValue: '8894',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.custom',
        key: 'endpoint_id',
        stringValue: '27FRD9TysqHhOeBrOpMQ_5pP6WA',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  time: 1731060288039,
  adjustedWindowSize: null,
  resultPrecisionDetails: {
    resultPrecision: 'PRECISION_UNKNOWN'
  },
  errors: [],
  progress: {
    percentage: null,
    loading: false,
    note: null
  },
  backendTraceId: '2f30c4825fb7fba7'
} as unknown as Result<LogItem>;

const allowedTagsForGrouping = new Set(['log.level']);

jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  ...(jest.requireActual('in-stores/navigation/hooks/useNavigation') as any),
  useNavigation: () => ({ navigate: () => null })
}));

describe('Log tag list tests', () => {
  const mockNavigation = jest.fn();
  const originalReturnObject = useNavigationModule.useNavigation();
  jest.spyOn(useNavigationModule, 'useNavigation').mockReturnValue({
    ...originalReturnObject,
    location: {
      pathname: '',
      matrix: {},
      query: {}
    },
    navigate: mockNavigation
  });
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined)
    }
  });

  it('Tag actions render and function', () => {
    render(
      <Actions
        getHrefToGroupedView={() => 'href'}
        allowedTagsForGrouping={allowedTagsForGrouping}
        onSelectTagHref={() => 'href'}
        item={sampleLog.data!}
        resolvedValue={'WARN'}
        uniqueTagName="tagName"
        tag={sampleLog.data!.tags.find(tag => tag.name === 'log.level')!}
      />
    );

    const groupButton = document.querySelector('#group-action');
    const filterButton = document.querySelector('#filter-action');
    const copyButton = document.querySelector('#copy-action');

    expect(groupButton).toBeInTheDocument();
    expect(filterButton).toBeInTheDocument();
    expect(copyButton).toBeInTheDocument();

    fireEvent.click(filterButton!);
    fireEvent.click(groupButton!);
    fireEvent.click(copyButton!);

    // Validate that copying the tag value writes the tag value to the clipboard
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sampleLogLevel);
  });
});
