function save(key, data) {
  localStorage.setItem(JSON.stringify(key), JSON.stringify(data))
}

function load(key) {
  let data = localStorage.getItem(JSON.stringify(key));
  return JSON.parse(data);
}

export function saveAccounts(data) {
  save("accounts", data)
}

export function loadAccounts() {
  return load("accounts")
}