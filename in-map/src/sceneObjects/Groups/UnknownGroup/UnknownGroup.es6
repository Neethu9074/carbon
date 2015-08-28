import BaseGroup from '../BaseGroup';


export default class UnknownGroup extends BaseGroup {

  constructor({parent, id}) {
    super({parent, id});
  }

  positionChanged() {}
}
