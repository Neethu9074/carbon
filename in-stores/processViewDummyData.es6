import {create} from 'reactive-observables';
import Immutable from 'immutable';


const processView$ = create()
  .emit(Immutable.fromJS([
    edge('customer-app', 'customer-schema', 'to'),
    edge('tracking-app', 'customer-app', 'to'),
    edge('customer-app', 'shipping-app', 'to'),
    edge('shipping-app', 'customer-app', 'to'),
    edge('tomcat-1', 'tracking-app', 'of'),
    edge('tomcat-2', 'tracking-app', 'of'),
    edge('tomcat-2', 'shipping-app', 'of'),
    edge('tomcat-2', 'mysql-2', 'to'),
    edge('shipping-app', 'shipping-schema', 'to'),
    edge('mysql-1', 'customer-schema', 'of'),
    edge('mysql-2', 'customer-schema', 'of'),
    edge('mysql-2', 'shipping-schema', 'of')
  ]))
  .freeze();


export function getProcessViewStructureObservable() {
  return processView$;
}


function edge(from, to, rel) {
  return {
    from,
    to,
    relation: rel,
    type: 'add'
  };
}
