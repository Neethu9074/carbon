import { minutes, number } from 'in-services/formatters/number';

export function getSliFormatter(sliEntity) {
  const isAvailabilitySli = sliEntity?.sliType === 'availability';
  return isAvailabilitySli ? callsFormatter : minutes.compact;
}

function callsFormatter(value) {
  const unit = value == 1 ? 'call' : 'calls';
  return `${number.compact(value)} ${unit}`;
}
