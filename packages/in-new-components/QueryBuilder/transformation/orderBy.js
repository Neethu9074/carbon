export function toNewOrderBy(orderBy, orderDirection = 'DESC') {
  return { by: orderBy, direction: orderDirection };
}
