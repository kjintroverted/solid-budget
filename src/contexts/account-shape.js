export default {
	"@context": {
		"dc": "http://purl.org/dc/elements/1.1/",
		"foaf": "http://xmlns.com/foaf/0.1/",
		"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
		"as": "https://www.w3.org/ns/activitystreams#"
	},
	"shape": [
		{
			"prefix": "foaf",
			"predicate": "name"
		},
		{
			"prefix": "rdfs",
			"predicate": "label"
		},
		{
			"prefix": "as",
			"predicate": "target",
			"alias": "balance",
			"stringify": value => value + "",
			"parse": value => +value
		},
		{
			"prefix": "dc",
			"predicate": "created",
			"alias": "lastUpdated",
			"stringify": value => value.toString(),
			"parse": value => new Date(value)
		}
	]
}
