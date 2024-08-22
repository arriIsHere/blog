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

//Define constants used for configuration
const outputHtmlName = "index.html";
const headerImageName = "header.jpg";

const titleGenerator = (context) => {

  const titleFileName = path.basename(context.partialPath, '.html');

  const title = titleFileName.replace(/([a-z])([A-Z])/g, '$1 $2');

  return title;

};

//Add function for title
htmlTemplatize.registerCommand('title', titleGenerator);

htmlTemplatize.registerCommand('postList', (context, args) => {

  let result = "";

  //Clone the array and remove this partial
  let postList = context.allPartials.slice(0);
  postList.splice(postList.indexOf(context.templatePath), 1);


  //Sort the new array
  postList.sort();

  let meOutPath = path.dirname(context.templatePath);

  //Now generate a string for elements
  for(let item of postList)
  {
    console.log(`Item is ${item}`);
    //Generate the output path
    let outputPath = item;
    outputPath = path.relative(meOutPath, outputPath);
    outputPath = path.dirname(outputPath) + "/" + outputHtmlName;
    outputPath = outputPath.replace(/\\/g, "/");

    //Get the output image path
    let outputImage = path.dirname(outputPath) + "/header.jpg";

    result += `<div class="articlePreview"><a href="${outputPath}">${titleGenerator(context)}</a><img src="${outputImage}"></div>\n`
  }

  return result;
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
    console.log("entered catch");
    if(error.code && error.code === 'ENOENT')
    {
      console.log(`calling folder ${path.dirname(dirPath)}`);
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

  //The blog needs to have all the entries renamed to the proper output name
  let dirName = path.dirname(outputValue);
  let correctedOutputValue = dirName + "/" + outputHtmlName;

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

  let imageFromPath = path.dirname(partialList[index]) + "/" + headerImageName;
  let imageToPath = dirName + "/" + headerImageName;

  if(fs.statSync(imageToPath).isFile() && fs.statSync(imageToPath).isFile())
  {
    //Copy header.jpg to the destination directory
    fs.createReadStream(imageFromPath).on('error', _ => null).pipe(fs.createWriteStream(imageToPath).on('error', _ => null));
  }
}


((template, partials, output, ctx) => {
  htmlTemplatize.templatize(template, partials, output, ctx);
})(templateArg, partialList, outList, {outputBase : outputDirArg, partialBase : partialPath, allPartials : partialList});