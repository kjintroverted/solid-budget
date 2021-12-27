import { getBoolean, getStringNoLocale, setBoolean, setStringNoLocale } from "@inrupt/solid-client";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export const account = {
  title: {
    predicate: FOAF.title,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  balance: {
    predicate: VCARD.value,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  primary: {
    predicate: FOAF.focus,
    parse: getBoolean,
    set: setBoolean
  }
}