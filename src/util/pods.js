import rdf from 'rdflib';

const VCARD = rdf.Namespace("http://www.w3.org/2006/vcard/ns#")
const store = new rdf.IndexedFormula;

export const getField = async (userID, field) => {
  const userStore = store.sym(userID);
  const doc = userStore.doc();
  const fetcher = new rdf.Fetcher(store);
  await fetcher.load(doc);
  return store.any(userStore, VCARD(field));
}