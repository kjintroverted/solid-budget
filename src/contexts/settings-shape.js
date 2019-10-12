// { "paycheck": 2600, "payDate": "2019-07-05" }
export default {
  "@context": {
    "foaf": "http://xmlns.com/foaf/0.1/",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "acl": "http://www.w3.org/ns/auth/acl#",
    "as": "https://www.w3.org/ns/activitystreams#"
  },
  "shape": [
    {
      "prefix": "acl",
      "predicate": "origin",
      "alias": "payDate"
    },
    {
      "prefix": "acl",
      "predicate": "accessTo",
      "alias": "shared"
    },
    {
      "prefix": "acl",
      "predicate": "accessControl",
      "alias": "link"
    },
    {
      "prefix": "as",
      "predicate": "target",
      "alias": "paycheck",
      "stringify": value => value + "",
      "parse": value => +value
    }
  ]
}
