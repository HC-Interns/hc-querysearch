// this should be moved to dna app properties

const indexSpec = {
    record : 
    {
        indexFields: [
            {fieldName: "title", weight: 2.0}, 
            {fieldName: "body.text", weight: 1.0}
        ]
    }
};