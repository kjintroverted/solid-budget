import { getStringNoLocale, setStringNoLocale } from "@inrupt/solid-client";
import { VCARD } from "@inrupt/vocab-common-rdf";

export const settingsStruct = {
  payday: {
    predicate: VCARD.Date,
    parse: getStringNoLocale,
    set: setStringNoLocale
  },
  paycheck: {
    predicate: VCARD.value,
    parse: getStringNoLocale,
    set: setStringNoLocale
  }
}