export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

export const day = 86400000;

export function getMainBalance(accountList) {
  if (!accountList) return 0;
  if (accountList.length === 0) return 0;
  if (accountList.length === 1) return accountList[0].balance;
  const main = accountList.find(acc => acc.label === "Main");
  return main.balance;
}

export function getAccount(accounts, label) {
  if (!accounts || !label) return {};
  let account = accounts.find(val => val.label === label);
  return account || {};
}

export function calculateBillsTil(bills, month, date) {
  return bills.reduce((acc, bill) => (!bill.months || bill.months.indexOf(month) !== -1) && bill.date < date ? acc + +bill.payment : acc, 0);
}

export function totalDebitForMonth(bills, month) {
  return bills.reduce((acc, bill) => !bill.months || bill.months.indexOf(month) !== -1 ? acc + +bill.payment : acc, 0);
}

export function getNextPayDate(basePayDate, date, inclusive) {
  let dayDiff = Math.floor((date.getTime() - basePayDate.getTime()) / 86400000) % 14;
  return !dayDiff && inclusive ? date.getDate() : date.getDate() + 14 - dayDiff;
}

export function totalCredit(paycheck, payDate, month, year) {
  let date = new Date(`${ ("0" + month).substr(-2, 2) }/1/${ year }`);
  payDate = getNextPayDate(payDate, date, true);
  date.setDate(payDate);

  let income = 0;
  while (date.getMonth() + 1 === month) {
    income += paycheck;
    payDate += 14;
    date.setDate(payDate);
  }
  return income;
}

export function round(num, places) {
  let x = +num;
  let factor = Math.pow(10, places);
  x *= factor;
  x = Math.floor(x);
  return x / factor;
}

export function deepEquals(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function uniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}