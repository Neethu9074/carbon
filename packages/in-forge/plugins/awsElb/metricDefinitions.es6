import { number, bytes, seconds } from 'in-services/formatters/number';

export default [
  {
    metric: 'processed_bytes',
    label: 'Processed Bytes',
    category: ['Network'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'new_flow_count',
    label: 'New Flow Count',
    category: ['Network'],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'client_reset_count',
    label: 'Client RST',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_reset_count',
    label: 'Elb RST',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_reset_count',
    label: 'Target RST',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'active_connection_count',
    label: 'Active Connections',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'new_connection_count',
    label: 'New Connections',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'rejected_connection_count',
    label: 'Rejected Connections',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'request_count',
    label: 'Request Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'client_tls_negotiation_error_count',
    label: 'Client TLS Error Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_tls_negotiation_error_count',
    label: 'Target TLS Error Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_response_time',
    label: 'Target Response Time',
    category: ['Network'],
    min: 0,
    formatter: seconds.detailed
  },
  {
    metric: 'target_connection_error_count',
    label: 'Target Connection Error Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_4XX_count',
    label: 'Elb Status Code 4xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_5XX_count',
    label: 'Elb Status Code 5xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_2XX_count',
    label: 'Target Status Code 2xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_3XX_count',
    label: 'Target Status Code 3xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_4XX_count',
    label: 'Target Status Code 4xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_5XX_count',
    label: 'Target Status Code 5xx Count',
    category: ['Network'],
    min: 0,
    formatter: number.compact
  }
];
