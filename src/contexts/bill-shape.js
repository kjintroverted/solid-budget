// Find option bank here
// https://github.com/solid/context/blob/master/context.json

export default {
  "@context": {
    "foaf": "http://xmlns.com/foaf/0.1/",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "dc": "http://purl.org/dc/elements/1.1/",
    "as": "https://www.w3.org/ns/activitystreams#"
  },
  "shape": [
    {
      "prefix": "dc",
      "predicate": "title"
    },
    {
      "prefix": "as",
      "predicate": "publicationDate",
      "alias": "date"
    },
    {
      "prefix": "as",
      "predicate": "attributedTo",
      "alias": "months",
      "stringify": JSON.stringify,
      "parse": JSON.parse
    },
    {
      "prefix": "as",
      "predicate": "target",
      "alias": "payment",
      "stringify": value => value + "",
      "parse": value => +value
    },
    {
      "prefix": "as",
      "predicate": "bcc",
      "alias": "oneTime",
      "stringify": value => value + "",
      "parse": value => value === "true"
    }
  ]
}
