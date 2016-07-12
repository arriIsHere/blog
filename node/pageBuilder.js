/**
  * Copyright 2016 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */

/**
 * Modified version of pageBuilder from templatizer, used primaraly to generate
 * blog content, should always be run in root
 */
"use strict";
var fs = require('fs');
var path = require('path');
var htmlTemplatize = require('./Templateizer/htmlTemplatize');

//Add function for title
htmlTemplatize.registerCommand('title', (context) => {

  const titleFileName = path.basename(context.partialPath, '.html');

  const title = titleFileName.replace(/([a-z])([A-Z])/g, '$1 $2');

  return title;

});

htmlTemplatize.registerCommand('abstract', (context) => {

  //Get the containing folder
  const abstractFolder = path.dirname(context.partialPath);
  const abstractPath = abstractFolder + "/abstract.txt";

  //Return the file contents
  return fs.readFileSync(abstractPath, {encoding: 'UTF-8'});

});

fs.mkdirParentSync = function(dirPath, mode)
{
  //Try to find parent dir
  try
  {
    fs.mkdirSync(dirPath, mode);
  }
  catch(error)
  {
    if(error.errno && error.errno === 'ENOENT')
    {
      //Attempt to make parent folder(s)
      fs.mkdirParentSync(path.dirname(dirPath), mode);
      fs.mkdirParentSync(dirPath, mode);
    }
    else
    {
      //Rethrow error if not because dir doesn't exist
      throw error;
    }
  }

  //Parents are made, make the child
  fs.mkdirSync(dirPath, mode);
};

var partialList = [];

var outList = [];

//Start by getting the template
var templateArg = "template.html";

//Then the partial dir
var partialPath = "partials/"

//Finally get the output dir
var outputDirArg = ".";

//Handle this as a stack
let stack = [partialPath];

//Get all the children of the directory itteratively
while(stack.length > 0)
{
  let value = stack.pop();

  //Check for directory
  let info = fs.lstatSync(value);

  if(info.isFile())
  {
    //Check for html extension
    if(path.extname(value) === '.html')
    {
      partialList.push(value);
    }
  }
  else
  {
    //Get the children and add them to the stack
    let children  = fs.readdirSync(value, "UTF-8");

    for(let index in children)
    {
      let child = children[index]
      let fullPath = value + path.sep + child;
      stack.push(fullPath);
    }
  }
}

//Create the output dirs
for(let index = 0; index < partialList.length; ++index)
{
  let outputValue = path.normalize(partialList[index].replace(partialPath, outputDirArg));

  //The blog needs to have all the entries renamed to 'index.html'
  let dirName = path.dirname(outputValue);
  let correctedOutputValue = dirName + "/index.html";

  outList[index] = correctedOutputValue;
  try
  {
    fs.mkdirParentSync(path.dirname(outputValue));
  }
  catch(error)
  {
    if(error.code !== 'EEXIST')
    {
      throw error;
    }
  }
}

((template, partials, output, ctx) => {
  htmlTemplatize.templatize(template, partials, output, ctx);
})(templateArg, partialList, outList, {outputBase : outputDirArg, partialBase : partialPath});