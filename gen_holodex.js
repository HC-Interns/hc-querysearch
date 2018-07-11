var path = require('path'), 
    fs   = require('fs');


function findFilesInDir(startPath,filter){
    var results = [];
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }
    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            results = results.concat(findFilesInDir(filename,filter)); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            results.push(filename);
        }
    }
    return results;
}

function loadDNA(appPath) {
  let filePath = findFilesInDir(appPath, 'dna.json');
  console.log(filePath)
  return JSON.parse(fs.readFileSync(filePath[0]));
}

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
    name : schema.name,
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

const appRoot = './exampleBridgeApp'
dna = loadDNA(appRoot);

dna.Zomes.forEach(zome => {
  zome.Entries.forEach(entry => {
    if (entry.SchemaFile) {
      let schema = JSON.parse(fs.readFileSync(appRoot+'/dna/'+zome.Name+'/'+entry.SchemaFile))
      let skelSchema = genSkeletalSchema(schema)
      console.log(skelSchema)
    }
  })
})
