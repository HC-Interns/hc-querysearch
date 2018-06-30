// this should be moved to dna app properties

const indexSpec = [
    {
        entryType: "tweet",
        indexFields: [
            {fieldName: "title", weight: 1.0}, 
            {fieldName: "body.text", weight: 1.5}
        ]
    }
]