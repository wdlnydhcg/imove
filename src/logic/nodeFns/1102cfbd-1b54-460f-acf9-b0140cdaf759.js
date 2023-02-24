// imove-behavior: 审批1

import fpget from 'lodash.get';

export default async function(ctx) {
  const obj = {a: {b: 'hello imove~'}};
  console.log(fpget(obj, 'a.b'));
  return ctx.getPipe();
}