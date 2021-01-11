const CACHE_LIST = [
  "user",
  "accounts",
  "bills",
  "buckets",
]

function save(key, data) {
  localStorage.setItem(JSON.stringify(key), JSON.stringify(data))
}

function remove(key) {
  localStorage.removeItem(JSON.stringify(key))
}

function load(key) {
  let data = localStorage.getItem(JSON.stringify(key));
  return JSON.parse(data);
}

export function clearCache() {
  CACHE_LIST.forEach(k => remove(k))
}

export function checkUser(user) {
  let lastUser = load("user");
  if (user !== lastUser) clearCache();
  save("user", user);
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