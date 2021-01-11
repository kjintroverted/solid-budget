function save(key, data) {
  localStorage.setItem(JSON.stringify(key), JSON.stringify(data))
}

function load(key) {
  let data = localStorage.getItem(JSON.stringify(key));
  return JSON.parse(data);
}

export function checkUser(user) {
  let lastUser = localStorage.getItem("user");
  if (user !== lastUser) localStorage.clear();
}

export function saveAccounts(data) {
  save("accounts", data)
}

export function loadAccounts() {
  return load("accounts")
}

export function saveBills(data) {
  save("bills", data)
}

export function loadBills() {
  return load("bills")
}

export function saveBuckets(data) {
  save("buckets", data)
}

export function loadBuckets() {
  return load("buckets")
}