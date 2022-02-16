import { FOAF } from "@inrupt/vocab-common-rdf";
import { getAndParse, stringifyAndSet } from "solid-core/dist/pods";

export const notebookStruct = {
  notes: {
    predicate: FOAF.Document,
    parse: getAndParse,
    set: stringifyAndSet
  }
}

// const note = {
//   text: "Message text.",
//   actionType: "TRAN/UP",
//   account: "url",
//   target: "url",
//   recurring: false
// }