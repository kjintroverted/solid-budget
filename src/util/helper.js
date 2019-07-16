export function getAccount(accounts, label) {
  if (!accounts || !label) return {};
  let account = accounts.find(val => val.label === label);
  return account || {};
}

export function calculateBillsTil(bills, month, date) {
  return bills.reduce((acc, bill) => (!bill.months || bill.months.indexOf(month) != -1) && bill.date < date ? acc + +bill.payment : acc, 0);
}