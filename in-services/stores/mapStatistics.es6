import {create} from 'reactive-observables';


const roSpec = {emitLatestOnSubscribe: true};
export const mapStatisticsStore = create(roSpec);
