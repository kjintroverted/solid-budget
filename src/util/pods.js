import rdf from 'rdflib';

const VCARD = rdf.Namespace("http://www.w3.org/2006/vcard/ns#")
const LDP = rdf.Namespace("http://www.w3.org/ns/ldp#")
const store = new rdf.IndexedFormula;
const fetcher = new rdf.Fetcher(store);
const updater = new rdf.UpdateManager(store);

export const getField = async (userID, field) => {
  const userStore = store.sym(userID);
  const profile = userStore.doc();
  await fetcher.load(profile);
  return store.any(userStore, VCARD(field));
}

export const setField = async (userID, field, value) => {
  const userStore = store.sym(userID);
  const profile = userStore.doc();
  const ins = rdf.st(userStore, VCARD(field), value, profile);
  const del = store.statementsMatching(userStore, VCARD(field), null, profile);

  updater.update(del, ins, (uri, ok) => {
    if (!ok) console.error("Failed update.", uri);
  })
}