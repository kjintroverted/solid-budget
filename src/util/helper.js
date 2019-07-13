export function getAccount(accounts, label) {
  if (!accounts || !label) return {};
  let account = accounts.find(val => val.label === label);
  return account || {};
}