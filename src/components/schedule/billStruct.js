import { getBoolean, getStringNoLocale, setBoolean, setStringNoLocale } from "@inrupt/solid-client";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";
import { getAndParse, stringifyAndSet } from "solid-core/dist/pods";

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
    parse: getAndParse,
    set: stringifyAndSet
  },
  inactive: {
    predicate: VCARD.hasSource,
    parse: getBoolean,
    set: setBoolean
  }
}