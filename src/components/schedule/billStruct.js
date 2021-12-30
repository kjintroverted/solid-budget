import { getStringNoLocale, setStringNoLocale } from "@inrupt/solid-client";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export const billStruct = {
  title: {
    predicate: FOAF.name,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  debit: {
    predicate: VCARD.value,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  date: {
    predicate: VCARD.Date,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  month: {
    predicate: VCARD.note,
    parse: getStringNoLocale,
    set: setStringNoLocale
  }
}