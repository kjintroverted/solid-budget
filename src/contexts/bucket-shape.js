export default {
  "@context": {
    foaf: "http://xmlns.com/foaf/0.1/",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    as: "https://www.w3.org/ns/activitystreams#"
  },
  shape: [
    {
      prefix: "foaf",
      predicate: "name"
    },
    {
      prefix: "rdfs",
      predicate: "label"
    },
    {
      prefix: "as",
      predicate: "target",
      alias: "value",
      stringify: value => value + "",
      parse: value => +value
    },
    {
      prefix: "foaf",
      predicate: "primaryTopic",
      alias: "favorite",
      stringify: value => value + "",
      parse: value => value === "true"
    }
  ]
};
