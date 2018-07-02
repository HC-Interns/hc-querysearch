// this should be moved to dna app properties

const indexSpec = {
    tweet : 
    {
        indexFields: [
            {fieldName: "title", weight: 2.0}, 
            {fieldName: "body.text", weight: 1.0}
        ]
    }
};