export function getAccount(accounts, label) {
  return accounts && label ? accounts.find(val => val.label === label) : {};
}