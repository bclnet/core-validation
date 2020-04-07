import * as V from '..';
import Binder from './Binder';

let Validator = V.create(new V.ReactBinding());
for (let key in V) {
  if (!V.hasOwnProperty(key)) continue;
  Validator[key] = V[key];
}
Validator.Binder = Binder

export default Validator;