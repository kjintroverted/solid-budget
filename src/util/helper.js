export function getAccount(accounts, label) {
  if (!accounts || !label) return {};
  let account = accounts.find(val => val.label === label);
  return account || {};
}

export function calculateBillsTil(bills, date) {
  return bills.reduce((acc, bill) => bill.date < date ? acc + +bill.payment : acc, 0);
}