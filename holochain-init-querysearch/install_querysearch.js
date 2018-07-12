#!/usr/bin/env node

var path = require('path'), 
    fs   = require('fs-extra');

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

  let indexFields = schema.querysearchIndexFields || []
  indexFields.forEach(fieldSpec => {
    if (fieldSpec.type === "ordinal") {
      console.log("Generating skeleton schema for "+schema.name)
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
    let indexFields = schema.querysearchIndexFields || []
    indexFields.forEach(fieldSpec => {
      if(fieldSpec.type === 'textSearch') {
        console.log('Generating keyword search for '+schema.name+'.'+fieldSpec.field)
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
    let indexFields = schema.querysearchIndexFields || []
    indexFields.forEach(fieldSpec => {
      if(fieldSpec.type === 'ordinal') {
        specs[schema.name].push(fieldSpec.field)
      }
    })
  })
  return specs
}



////// Script steps (zome style!) Script must be run from app root dir (one that contains dna dir)

// check there is not already a querysearch directory in dna
if (fs.existsSync('dna/querysearch')) {
  console.error('Holodex directory already present in dna! Delete it if you wish to reinstall. Aborting')
  process.exit(1)
}

// copy querysearch across
fs.copySync('node_modules/holochain-init-querysearch/querysearch', 'dna/querysearch')

// // load the existing app DNA
let appDNA = JSON.parse(fs.readFileSync('dna/dna.json'))

// generate the objects for the skeleton entries and things to be added to the DNA
let schemas = []
appDNA.Zomes.forEach(zome => {
  if (zome.Name === 'querysearch') { return }
  zome.Entries.forEach(entry => {
    if (entry.SchemaFile) {
      let schema = JSON.parse(fs.readFileSync('dna/'+zome.Name+'/'+entry.SchemaFile))
      schemas.push(schema)
    }
  })
})

let skeletonSchemas = schemas.map(genSkeletalSchema)

//// update dna json
// write the new stuff to properties
appDNA.Properties['textSearchSpec'] = JSON.stringify(genTextSearchSpec(schemas))
appDNA.Properties['indexSpec'] = JSON.stringify(genIndexSpec(schemas))

// add the new zome info
let querysearchDNA = JSON.parse(fs.readFileSync('node_modules/holochain-init-querysearch/querysearchDNATemplate.json'))

skeletonSchemas.forEach(schema => {
  // write the schema json
  fs.writeFileSync('dna/querysearch/'+schema.name+'.json', JSON.stringify(schema, null, 2), 'utf8')
  // add to the querysearchDNA entry
  querysearchDNA.Entries.push({
    Name: schema.name,
    DataFormat: "json",
    SchemaFile: schema.name+'.json',
    Sharing: "public"
  })
})


// remove existing querysearch dna entry if one exists
appDNA.Zomes = appDNA.Zomes.filter(zome => {
  return zome.Name !== 'querysearch'
})

appDNA.Zomes.push(querysearchDNA)

// write the dna to replace the old file
fs.writeFileSync('dna/dna.json', JSON.stringify(appDNA, null, 2), 'utf8')

// done!
console.log("Success!")
