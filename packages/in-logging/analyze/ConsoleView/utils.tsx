/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { LogItem, TagFilterExpressionElementUnion } from '@instana/types';
import { interval } from '@instana/observables';

import { buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { fixateTimeConfig, getTimeConfig, setTimeConfig } from 'in-stores/time/config';
import { LOG_LEVEL, LOG_MESSAGE_TIMESTAMP } from 'in-logging/queryBuilder';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import getLogs from 'in-logging/subscriptions/getLogs';
import { logsPath } from 'in-logging/navigation/paths';

export function HighlightedText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword) return <span>{text}</span>;

  const regex = new RegExp(keyword, 'gi');
  const matches = [...text.matchAll(regex)];

  if (matches.length === 0) return <span>{text}</span>;

  const parts = text.split(regex);
  let currentIndex = 0;

  return (
    <span>
      {parts.map((part, i) => {
        if (i < parts.length - 1) {
          const match = matches[i];
          const originalKeyword = text.slice(currentIndex + part.length, currentIndex + part.length + match[0].length);
          currentIndex += part.length + match[0].length;
          return (
            <>
              {part}
              <span style={{ backgroundColor: 'yellow' }}>{originalKeyword}</span>
            </>
          );
        }
        return part;
      })}
    </span>
  );
}

export const sampleData = [
  {
    itemId: '1838993DC880B48059E23053E2A65B241838993DC880B48000000000000000AD',
    timestamp: 1745313346242,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DC8829958B9525E9D6F4CF5A918389932C8A8FE00000000000000004D',
    timestamp: 1745313346242,
    message:
      '2025-04-22 09:15:46,242 INFO  instana-load-filler o.apache.kafka.clients.NetworkClient - [Consumer clientId=saas_instana_load_filler-group_members, groupId=saas_instana_load_filler-cooperative] Disconnecting from node 1 due to socket connection setup timeout. The timeout value is 27430 ms.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'INFO',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025-04-22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DC8FAC68059E23053E2A65B241838993DC8FAC68000000000000000CB',
    timestamp: 1745313346250,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DCF893E00FCAACFC2B4BB66A11838993DCF893E000000000000000009',
    timestamp: 1745313346360,
    message: 'Not found while trying to fetch alert configurations',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DCF893E00FCAACFC2B4BB66A11838993DCF893E00000000000000000B',
    timestamp: 1745313346360,
    message: 'Failed to reload alert configuration registry. Retrying in {} sec.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DCF96FE6152EA19F38C10B08418389934A57F4E00000000000000002E',
    timestamp: 1745313346360,
    message:
      '2025-04-22 09:15:46,360 WARN  srees-test-issue-tracker c.i.g.client.GroundskeeperClient - Not found while trying to fetch alert configurations',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025-04-22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DCF986B1152EA19F38C10B08418389934A57F4E00000000000000004E',
    timestamp: 1745313346360,
    message:
      '2025-04-22 09:15:46,360 WARN  srees-test-issue-tracker c.i.i.a.AlertConfigurationRegistry - Failed to reload alert configuration registry. Retrying in 30 sec.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025-04-22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DD1914DC950030DCDDC20FAF3183899337B795C000000000000000025',
    timestamp: 1745313346394,
    message:
      '2025-04-22 09:15:46,393 INFO  log-processor o.apache.kafka.clients.NetworkClient - [Producer clientId=saas_log_processor-filtered-tag-set-downstream] Disconnecting from node -1 due to socket connection setup timeout. The timeout value is 35952 ms.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'INFO',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025-04-22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DD1CD138050BFE8AB5D4E8E911838993DD1CD13800000000000000003',
    timestamp: 1745313346398,
    message: 'Dropped event with id {} at AlertDownstream due to RateLimiter.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DD617B58059E23053E2A65B241838993DD617B58000000000000001BF',
    timestamp: 1745313346470,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DD82DC440043FA787572B53AB1838993DD82DC4400000000000000001',
    timestamp: 1745313346505,
    message: 'Failed to notify {} of event {} on the {} integration channel with id {} due to {}',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DD8D59D0059E23053E2A65B241838993DD8D59D000000000000000189',
    timestamp: 1745313346516,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DD971FF177167BDC2C498B5FF1838993E6CE472000000000000000001',
    timestamp: 1745313346526,
    message:
      '2025/04/22 09:15:46 output.go:18: pod=instana-agent/k8sensor-97bc67595-l5w7q shards=[00 03 06 09 0C 0F 12 15]',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'NONE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DD9E62BA27167BDC2C498B5FF1838993F96EA64000000000000000001',
    timestamp: 1745313346533,
    message:
      '2025/04/22 09:15:46 output.go:18: call=senseLoop PodsCount={16} PodsRunning={16} PodsPending={0} snitch=pod sense.min=0 sense.99.9PCTL=0 sense.max=84 apply.min=0 apply.99.9PCTL=1951 apply.max=3196 http.do.min=0 http.do.99.9PCTL=59 http.do.max=981 encode.pmin=780.00B encode.p99.9PCTL=5.99KB encode.pmax=31.90KB encode.tmin=0 encode.t99.9PCTL=38 encode.tmax=124 total.min=4 total.99.9PCTL=2001 total.max=9312 send.calls=4377600 send.errors=1457 send.exceptions=2036236',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'NONE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DDD203F0059E23053E2A65B241838993DDD203F000000000000000032',
    timestamp: 1745313346588,
    message: 'Rejecting request with key AHUv5eucRJ2w6_jNgo4nEw for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DDE5FC45A8C33ABE085361E5718389932C8A8FE0000000000000000F0',
    timestamp: 1745313346608,
    message:
      "[2025/04/22 09:15:46] [error] [output:cloudwatch_logs:cloudwatch_logs.0] CreateLogStream API responded with error='AccessDeniedException'",
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DDE606D138C33ABE085361E5718389932C8A8FE0000000000000000F1',
    timestamp: 1745313346608,
    message: '[2025/04/22 09:15:46] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to create log stream',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DDE6089028C33ABE085361E5718389932C8A8FE0000000000000000F2',
    timestamp: 1745313346608,
    message: '[2025/04/22 09:15:46] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to send events',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DDECB7E0059E23053E2A65B241838993DDECB7E00000000000000019F',
    timestamp: 1745313346616,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DDEDAC04059E23053E2A65B241838993DDEDAC040000000000000015E',
    timestamp: 1745313346617,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DDEDAC04059E23053E2A65B241838993DDEDAC0400000000000000160',
    timestamp: 1745313346617,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DDF64148050BFE8AB5D4E8E911838993DDF6414800000000000000007',
    timestamp: 1745313346626,
    message: 'Dropped event with id {} at AlertDownstream due to RateLimiter.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DE02A71C059E23053E2A65B241838993DE02A71C000000000000000DE',
    timestamp: 1745313346639,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DE02A71C059E23053E2A65B241838993DE02A71C000000000000001A1',
    timestamp: 1745313346639,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DE1B72C40366196CC55D420371838993DE1B72C400000000000000000',
    timestamp: 1745313346665,
    message:
      'request [POST http://10.255.204.98:9200/saas_tag_sets_2025_17*/_search?routing=saas_instana_plgprovider&typed_keys=true&max_concurrent_shard_requests=5&ignore_unavailable=true&expand_wildcards=open&allow_no_indices=true&search_type=query_then_fetch&batched_reduce_size=512] returned 4 warnings: [299 Elasticsearch-8.17.2-747663ddda3421467150de0e4301e8d4bc636b0c "Deprecated field [from] used, this field is unused and will be removed entirely"],[299 Elasticsearch-8.17.2-747663ddda3421467150de0e4301e8d4bc636b0c "Deprecated field [to] used, this field is unused and will be removed entirely"],[299 Elasticsearch-8.17.2-747663ddda3421467150de0e4301e8d4bc636b0c "Deprecated field [include_lower] used, this field is unused and will be removed entirely"],[299 Elasticsearch-8.17.2-747663ddda3421467150de0e4301e8d4bc636b0c "Deprecated field [include_upper] used, this field is unused and will be removed entirely"]',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DE1BB81951BA0934B0175898218389930B037E400000000000000000E',
    timestamp: 1745313346665,
    message:
      '2025-04-22 09:15:46,665 WARN  tag-processor org.elasticsearch.client.RestClient - request [POST http://10.255.204.98:9200/saas_tag_sets_2025_17*/_search?routing=saas_instana_plgprovider&typed_keys=true&max_concurrent_shard_requests=5&ignore_unavailable=true&expand_wildcards=open&allow_no_indices=true&search_type=query_then_fetch&batched_reduce_size=512] returned 4 warnings: [299 Elasticsearch-8.17.2-747663ddda3421467150de0e4301e8d4bc636b0c "Deprecated field [from] used, this field is unused and will be removed entirely"],[299 Elasticsearch-8.17.2-747663ddda3421467150de0e4301e8d4bc636b0c "Deprecated field [to] used, this field is unused and will be removed entirely"],[299 Elasticsearch-8.17.2-747663ddda3421467150de0e4301e8d4bc636b0c "Deprecated field [include_lower] used, this field is unused and will be removed entirely"],[299 Elasticsearch-8.17.2-747663ddda3421467150de0e4301e8d4bc636b0c "Deprecated field [include_upper] used, this field is unused and will be removed entirely"]',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025-04-22 09:15:46',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DE334A48059E23053E2A65B241838993DE334A48000000000000001D0',
    timestamp: 1745313346690,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DE8A1314059E23053E2A65B241838993DE8A131400000000000000102',
    timestamp: 1745313346781,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DE8A1314059E23053E2A65B241838993DE8A131400000000000000104',
    timestamp: 1745313346781,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DE8CEF80059E23053E2A65B241838993DE8CEF8000000000000000107',
    timestamp: 1745313346784,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DEA1EA98059E23053E2A65B241838993DEA1EA9800000000000000008',
    timestamp: 1745313346806,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DEA1EA98059E23053E2A65B241838993DEA1EA9800000000000000186',
    timestamp: 1745313346806,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DEA1EA98059E23053E2A65B241838993DEA1EA98000000000000001A7',
    timestamp: 1745313346806,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DED381E8059E23053E2A65B241838993DED381E8000000000000000EC',
    timestamp: 1745313346858,
    message: 'Rejecting request with key instanalocal for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DED4760C059E23053E2A65B241838993DED4760C0000000000000013E',
    timestamp: 1745313346859,
    message: 'Rejecting request with key instanalocal for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DED65E540043FA787572B53AB1838993DED65E5400000000000000007',
    timestamp: 1745313346861,
    message: 'Failed to notify {} of event {} on the {} integration channel with id {} due to {}',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DEE97124059E23053E2A65B241838993DEE9712400000000000000048',
    timestamp: 1745313346881,
    message: 'Rejecting request with key instanalocal for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DEE97124059E23053E2A65B241838993DEE97124000000000000001AC',
    timestamp: 1745313346881,
    message: 'Rejecting request with key instanalocal for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DEE97124059E23053E2A65B241838993DEE9712400000000000000201',
    timestamp: 1745313346881,
    message: 'Rejecting request with key instanalocal for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DEEA6548059E23053E2A65B241838993DEEA654800000000000000141',
    timestamp: 1745313346882,
    message: 'Rejecting request with key instanalocal for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF0F96C4059E23053E2A65B241838993DF0F96C400000000000000188',
    timestamp: 1745313346921,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF136754059E23053E2A65B241838993DF1367540000000000000010F',
    timestamp: 1745313346925,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF19202C050BFE8AB5D4E8E911838993DF19202C00000000000000002',
    timestamp: 1745313346931,
    message: 'Dropped event with id {} at AlertDownstream due to RateLimiter.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF20C14C050BFE8AB5D4E8E911838993DF20C14C00000000000000005',
    timestamp: 1745313346939,
    message: 'Dropped event with id {} at AlertDownstream due to RateLimiter.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF22A994050BFE8AB5D4E8E911838993DF22A99400000000000000004',
    timestamp: 1745313346941,
    message: 'Dropped event with id {} at AlertDownstream due to RateLimiter.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF2C32FC050BFE8AB5D4E8E911838993DF2C32FC00000000000000006',
    timestamp: 1745313346951,
    message: 'Dropped event with id {} at AlertDownstream due to RateLimiter.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF2F0F68059E23053E2A65B241838993DF2F0F680000000000000006E',
    timestamp: 1745313346954,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF30038C059E23053E2A65B241838993DF30038C000000000000001B3',
    timestamp: 1745313346955,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF507054059E23053E2A65B241838993DF5070540000000000000020A',
    timestamp: 1745313346989,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF553508059E23053E2A65B241838993DF55350800000000000000018',
    timestamp: 1745313346994,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF553508059E23053E2A65B241838993DF55350800000000000000192',
    timestamp: 1745313346994,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF5BE204059E23053E2A65B241838993DF5BE204000000000000000C7',
    timestamp: 1745313347001,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF5BE204059E23053E2A65B241838993DF5BE20400000000000000119',
    timestamp: 1745313347001,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF5CD628059E23053E2A65B241838993DF5CD6280000000000000011B',
    timestamp: 1745313347002,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF5DCA4C059E23053E2A65B241838993DF5DCA4C000000000000000C9',
    timestamp: 1745313347003,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF5E781F5B0F7CB3C2599E63E183898F81C4A26000000000000000001',
    timestamp: 1745313347003,
    message: '1:M 22 Apr 2025 09:15:47.003 * 100 changes in 300 seconds. Saving...',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'NONE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '09:15:47.003',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF5EE26ADB0F7CB3C2599E63E183898F81C4A26000000000000000002',
    timestamp: 1745313347004,
    message: '1:M 22 Apr 2025 09:15:47.004 * Background saving started by pid 21985',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'NONE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '09:15:47.004',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF628F00059E23053E2A65B241838993DF628F000000000000000001E',
    timestamp: 1745313347008,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF628F00059E23053E2A65B241838993DF628F00000000000000000CB',
    timestamp: 1745313347008,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF64CF409B0F7CB3C2599E63E183898F81C4A26000000000000000003',
    timestamp: 1745313347010,
    message: '21985:C 22 Apr 2025 09:15:47.010 * DB saved on disk',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'NONE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '09:15:47.010',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF654A1E4B0F7CB3C2599E63E183898F81C4A26000000000000000004',
    timestamp: 1745313347010,
    message: '21985:C 22 Apr 2025 09:15:47.010 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'NONE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '09:15:47.010',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF656B6C059E23053E2A65B241838993DF656B6C00000000000000194',
    timestamp: 1745313347011,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF6753B4059E23053E2A65B241838993DF6753B4000000000000000CD',
    timestamp: 1745313347013,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF6753B4059E23053E2A65B241838993DF6753B40000000000000020D',
    timestamp: 1745313347013,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF72C564059E23053E2A65B241838993DF72C564000000000000001DA',
    timestamp: 1745313347025,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF72C564059E23053E2A65B241838993DF72C56400000000000000210',
    timestamp: 1745313347025,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF8A9CE8059E23053E2A65B241838993DF8A9CE8000000000000000A9',
    timestamp: 1745313347050,
    message: 'Rejecting request with key AHUv5eucRJ2w6_jNgo4nEw for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DF8A9CE8059E23053E2A65B241838993DF8A9CE80000000000000014C',
    timestamp: 1745313347050,
    message: 'Rejecting request with key AHUv5eucRJ2w6_jNgo4nEw for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFADE61C059E23053E2A65B241838993DFADE61C00000000000000214',
    timestamp: 1745313347087,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFBEB3CC5B0F7CB3C2599E63E183898F81C4A26000000000000000005',
    timestamp: 1745313347104,
    message: '1:M 22 Apr 2025 09:15:47.104 * Background saving terminated with success',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'NONE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '09:15:47.104',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFE34DFC059E23053E2A65B241838993DFE34DFC00000000000000174',
    timestamp: 1745313347143,
    message: 'Rejecting request with key AHUv5eucRJ2w6_jNgo4nEw for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFE44220059E23053E2A65B241838993DFE44220000000000000001B8',
    timestamp: 1745313347144,
    message: 'Rejecting request with key AHUv5eucRJ2w6_jNgo4nEw for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFEA6EFD5564357337C1A4043183899328D0E34000000000000000055',
    timestamp: 1745313347150,
    message:
      "[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] CreateLogStream API responded with error='AccessDeniedException'",
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFEA7DFB1564357337C1A4043183899328D0E34000000000000000056',
    timestamp: 1745313347150,
    message: '[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to create log stream',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFEA89490564357337C1A4043183899328D0E34000000000000000057',
    timestamp: 1745313347150,
    message: '[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to send events',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFED4D336BC6527282C0751831838993F96EA64000000000000000001',
    timestamp: 1745313347153,
    message:
      '2025-04-22T09:15:47.152+00:00 | ERROR | instana-scheduler-thread-3-3     | ntainerdUtilImpl | com.instana.agent-process-handling - 1.0.13 | Executing [ctr, --address, /run/containerd/containerd.sock, -n, k8s.io, c, info, 5b5f66df3436a7181a082f0cd93fcdd551acd86485866908d94d19b54956ceb7] command results in exit status 1 with an error output: ctr: container "5b5f66df3436a7181a082f0cd93fcdd551acd86485866908d94d19b54956ceb7" in namespace "k8s.io": not found\n',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025-04-22T09:15:47.152+00:00',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFF251501E0D7C86B6848308C18389932C8A8FE000000000000000051',
    timestamp: 1745313347158,
    message:
      "[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] CreateLogStream API responded with error='AccessDeniedException'",
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFF25E268E0D7C86B6848308C18389932C8A8FE000000000000000052',
    timestamp: 1745313347158,
    message: '[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to create log stream',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993DFF2616D6E0D7C86B6848308C18389932C8A8FE000000000000000053',
    timestamp: 1745313347158,
    message: '[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to send events',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E004AEE80043FA787572B53AB1838993E004AEE800000000000000004',
    timestamp: 1745313347178,
    message: 'Failed to notify {} of event {} on the {} integration channel with id {} due to {}',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E029E0640E8ED9015F60FAF851838993E029E0640000000000000001B',
    timestamp: 1745313347217,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E029E0640E8ED9015F60FAF851838993E029E06400000000000000022',
    timestamp: 1745313347217,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E02BC8AC059E23053E2A65B241838993E02BC8AC000000000000001E5',
    timestamp: 1745313347219,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E02F993C0E8ED9015F60FAF851838993E02F993C0000000000000001E',
    timestamp: 1745313347223,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E0355214059E23053E2A65B241838993E035521400000000000000055',
    timestamp: 1745313347229,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E004AEE80043FA787572B53AB1838993E004AEE800000000000000004',
    timestamp: 1745313347178,
    message: 'Failed to notify {} of event {} on the {} integration channel with id {} due to {}',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E029E0640E8ED9015F60FAF851838993E029E0640000000000000001B',
    timestamp: 1745313347217,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E029E0640E8ED9015F60FAF851838993E029E06400000000000000022',
    timestamp: 1745313347217,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E02BC8AC059E23053E2A65B241838993E02BC8AC000000000000001E5',
    timestamp: 1745313347219,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E02F993C0E8ED9015F60FAF851838993E02F993C0000000000000001E',
    timestamp: 1745313347223,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E0355214059E23053E2A65B241838993E035521400000000000000055',
    timestamp: 1745313347229,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E043A01F223FB84778A34C42418389932C8A8FE000000000000000094',
    timestamp: 1745313347243,
    message:
      '10.255.216.253 - - [22/Apr/2025:09:15:47 +0000] "GET /build.json?noCache=1745313347185 HTTP/2.0" 200 114 "https://test-instana.pink.instana.rocks/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0"',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'NONE',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '22/Apr/2025:09:15:47 +0000',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E08DB730798B96F538784CF631838993251736A00000000000000005A',
    timestamp: 1745313347321,
    message:
      "[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] CreateLogStream API responded with error='AccessDeniedException'",
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E08DC1B7898B96F538784CF631838993251736A00000000000000005B',
    timestamp: 1745313347321,
    message: '[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to create log stream',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E08DC382498B96F538784CF631838993251736A00000000000000005C',
    timestamp: 1745313347321,
    message: '[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to send events',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E095E407E84CB271168521CF218389933F2AEF0000000000000000007',
    timestamp: 1745313347330,
    message:
      '2025-04-22 09:15:47,330 INFO  appdata-reader o.apache.kafka.clients.NetworkClient - [Producer clientId=producer-2] Disconnecting from node 1 due to socket connection setup timeout. The timeout value is 26688 ms.',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'INFO',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025-04-22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E10FB648059E23053E2A65B241838993E10FB648000000000000001C6',
    timestamp: 1745313347458,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E12699A8059E23053E2A65B241838993E12699A8000000000000001C8',
    timestamp: 1745313347482,
    message: 'Rejecting request with key 8RWwEQZ5SLOi3hZ6LVckeA for remote addr {} (remote host {}).',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'WARN',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E13066634E38BD010F59FDC4E1838993469E48400000000000000003C',
    timestamp: 1745313347492,
    message:
      "[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] CreateLogStream API responded with error='AccessDeniedException'",
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  },
  {
    itemId: '1838993E1306FE5BE38BD010F59FDC4E1838993469E48400000000000000003D',
    timestamp: 1745313347492,
    message: '[2025/04/22 09:15:47] [error] [output:cloudwatch_logs:cloudwatch_logs.0] Failed to create log stream',
    tags: [
      {
        name: 'log.level',
        key: null,
        stringValue: 'ERROR',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      },
      {
        name: 'log.tsFromMessage',
        key: null,
        stringValue: '2025/04/22 09:15:47',
        longValue: null,
        doubleValue: null,
        booleanValue: null
      }
    ]
  }
];
export const POLLING_INTERVAL_MS = 1000;
export const LINE_HEIGHT = 20;

const RETRIEVAL_SIZE = 200;
const POLLING_DELAY_MS = 30000;
export const getLogsOnIntervalObservable = (filters: TagFilterExpressionElementUnion) =>
  interval(POLLING_INTERVAL_MS)
    .map(timestamp => ({
      timeConfig: {
        windowSize: POLLING_INTERVAL_MS,
        to: timestamp - POLLING_DELAY_MS,
        focusedMoment: timestamp - POLLING_DELAY_MS,
        autoRefresh: false
      },
      tagFilterExpression: filters,
      retrievalSize: RETRIEVAL_SIZE,
      requestedTags: [LOG_LEVEL, LOG_MESSAGE_TIMESTAMP]
    }))
    .flatMap(params => getLogs(params))
    .scan((items: LogItem[] = [], result) => [...items, ...(result.data?.items ?? [])]);

function toAbsoluteUrl(partialUrl: string) {
  return new URL(partialUrl, window.location.origin);
}

export function useAbsoluteUrlToItem(itemId: string): URL {
  const { location, createHref } = useNavigation();

  const locationFromLogs = {
    ...location,
    matrix: {
      ...location.matrix,
      '/logs': {
        ...location.matrix['/logs'],
        dataSource: 'logs'
      }
    }
  };

  const timeConfig = getTimeConfig(locationFromLogs);
  setTimeConfig(
    locationFromLogs,
    fixateTimeConfig({
      windowSize: timeConfig.windowSize,
      focusedMoment: timeConfig.focusedMoment,
      autoRefresh: timeConfig.autoRefresh,
      to: timeConfig.to
    })
  );

  setOrDeleteMatrixKey(locationFromLogs, logsPath, 'selectedId', buildJsonSerializer()(itemId));

  return toAbsoluteUrl(createHref(locationFromLogs));
}
