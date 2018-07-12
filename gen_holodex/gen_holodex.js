var path = require('path'), 
    fs   = require('fs'),
    downloadGitRepo = require("download-git-repo");


// function for using strings like 'body.text.title' to access object properties
function getWithStringPath(obj, path) {
  return path.split('.').reduce(function (obj,i) {return obj[i]}, obj)
}

function followStringPathInSchema(schema, path) {
  return getWithStringPath(schema, 'properties.'+path.replace('.', '.properties.'))
}

function genSkeletalSchema(schema) {
  // find the ordinal index fields and create a new schema with only those entries
  let skelSchema = {
    name : 'skel_'+schema.name,
    type: "object",
    properties: {},
    indexFields: []
  }

  let indexFields = schema.holodexIndexFields || []
  indexFields.forEach(fieldSpec => {
    if (fieldSpec.type === "ordinal") {
      // add this field flattened to the skeletal schemad
      let flatField = fieldSpec.field.replace('.', '_')
      skelSchema.properties[flatField] = followStringPathInSchema(schema, fieldSpec.field)
      // add an entry in the indexFields
      let indexFieldEntry = {}
      indexFieldEntry[flatField] = fieldSpec.ascending?1:-1
      skelSchema.indexFields.push(indexFieldEntry)
    }
  })
  return skelSchema
}

function genTextSearchSpec(schemas) {
  let specs = {}
  schemas.forEach(schema => {
    specs[schema.name] = {fields: []}
    let indexFields = schema.holodexIndexFields || []
    indexFields.forEach(fieldSpec => {
      if(fieldSpec.type === 'textSearch') {
        specs[schema.name].fields.push({
          fieldName: fieldSpec.field,
          weight: fieldSpec.weight
        })
      }
    })
  })
  return specs
}

function genIndexSpec(schemas) {
  let specs = {}
  schemas.forEach(schema => {
    specs[schema.name] = []
    let indexFields = schema.holodexIndexFields || []
    indexFields.forEach(fieldSpec => {
      if(fieldSpec.type === 'ordinal') {
        specs[schema.name].push(fieldSpec.field)
      }
    })
  })
  return specs
}

// takes a list of all schemas in an app and adds some properties to the properties object
function AddHolodexDNAProperties(properties, AppUUID, schemas) {
  properties['textSearchSpec'] = genTextSearchSpec(schemas)
  properties['indexSpec'] = genIndexSpec(schemas)
  return properties
}




////// Script steps (zome style!) Script must be run from app root dir (one that contains dna dir)

// // load the existing app DNA
let appDNA = JSON.parse(fs.readFileSync('./dna/dna.json'))

// generate the objects for the skeleton entries and things to be added to the DNA
let schemas = []
appDNA.Zomes.forEach(zome => {
  zome.Entries.forEach(entry => {
    if (entry.SchemaFile) {
      let schema = JSON.parse(fs.readFileSync('./dna/'+zome.Name+'/'+entry.SchemaFile))
      schemas.push(schema)
    }
  })
})

let skeletonSchemas = schemas.map(genSkeletalSchema)
console.log(JSON.stringify(skeletonSchemas))

let textSearchSpec = genTextSearchSpec(schemas)
let indexSpec = genIndexSpec(schemas)


// get an instance of Holodex zome edition from github (placeholder for now)
downloadGitRepo('github:HC-Interns/holodex#template', './dna/', function (err) {
  console.log(err ? 'Error downloading template from repo' : 'Success')
})


//// update dna json
// write the new stuff to properties
appDNA.Properties['textSearchSpec'] = genTextSearchSpec(schemas)
appDNA.Properties['indexSpec'] = genIndexSpec(schemas)

// add the new zome info
let holodexDNA = JSON.parse(fs.readFileSync('./holodexDNATemplate.json'))

skeletonSchemas.forEach(schema => {
  // write the schema json
  fs.writeFileSync('./dna/holodex/'+schema.name+'.json', JSON.stringify(schema, null, 2), 'utf8')
  // add to the holodexDNA entry
  holodexDNA.Entries.push({
    Name: schema.name,
    DataFormat: "json",
    SchemaFile: schema.name+'.json',
    Sharing: "public"
  })
})

appDNA.Zomes.push(holodexDNA)

// write the dna to replace the old file
fs.writeFileSync('./dna.json', JSON.stringify(appDNA, null, 2), 'utf8')

// done!
