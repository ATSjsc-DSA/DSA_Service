export var variable = 0;

export function changeVariable(newValue) {
  let percent = (Math.random() * 2 + 1) / 100;
  let operator = Math.random() < 0.5 ? -1 : 1;
  variable = percent * operator;
}
