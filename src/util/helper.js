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

export function getAccount(accounts, label) {
  if (!accounts || !label) return {};
  let account = accounts.find(val => val.label === label);
  return account || {};
}

export function calculateBillsTil(bills, month, date) {
  return bills.reduce((acc, bill) => (!bill.months || bill.months.indexOf(month) != -1) && bill.date < date ? acc + +bill.payment : acc, 0);
}

export function totalDebit(bills, month) {
  return bills.reduce((acc, bill) => !bill.months || bill.months.indexOf(month) != -1 ? acc + +bill.payment : acc, 0);
}

export function getNextPayDate(basePayDate, date, inclusive) {
  let dayDiff = Math.floor((date.getTime() - basePayDate.getTime()) / 86400000) % 14;
  return !dayDiff && inclusive ? date.getDate() : date.getDate() + 14 - dayDiff;
}

export function totalCredit(paycheck, payDate, month, year) {
  let date = new Date();
  date.setMonth(month - 1);
  date.setDate(1);
  date.setFullYear(year);
  payDate = getNextPayDate(payDate, date);
  date.setDate(payDate);

  let income = 0;
  while (date.getMonth() + 1 === month) {
    income += paycheck;
    payDate += 14;
    date.setDate(payDate);
  }
  return income;
}