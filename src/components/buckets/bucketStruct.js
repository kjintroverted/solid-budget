import { getBoolean, getStringNoLocale, setBoolean, setStringNoLocale } from "@inrupt/solid-client";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export const bucketStruct = {
  name: {
    predicate: FOAF.name,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  account: {
    predicate: FOAF.account,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  balance: {
    predicate: VCARD.value,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  pinned: {
    predicate: FOAF.focus,
    parse: getBoolean,
    set: setBoolean
  }
}