#target photoshop

app.bringToFront();
var docOriginal, docNew, docRes;
main();



function main() {
    
    var Path = app.activeDocument.path; //Get file path
    var Name = app.activeDocument.name.replace(/\.[^\.]+$/, ''); //Get file name
    var saveFile = File(Path + "/Fixed/" + app.activeDocument.name); //Set path for new saved file.
    //Only run the script if the path is correct, else we will just get an alert saying that it is the wrong path.
    if(Path != "~/Desktop/Original") { //Check if path is correct
        alert("Script is not executed!\n\nWrong Path\nPath should be: ~/Desktop/Original\nPath is :" + Path + "\n\nPress OK to cotinue working", "ERROR");
        //app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); //Close document without saving changes.
        return; //end script.
    }
    
    var doc = app.activeDocument; //create a variable called doc and place active document in it. This is the document currently open.
    if(doc.mode == DocumentMode.RGB) { //check if the active document's image mode is RGB.
        docOriginal = DocumentMode.RGB; //If this is true then we are setting the variable docOriginal to be equal to RGB. This is done so if can call later what the original document mode was.
    } else if(doc.mode == DocumentMode.GRAYSCALE) { //If the document mode is not RGB then we are checking if it is GRAYSCALE. 
        docOriginal = DocumentMode.GRAYSCALE; //If this is true then we are setting docOrigianl to GRAYSCALE.
    } else if(doc.mode == DocumentMode.BITMAP){ //If the document mode is not RGB or GRAYSCALE then we check if it is already BITMAP.
        docOriginal = DocumentMode.BITMAP; 
    } else { //If document mode is none of the above then we set docOriginal to Unknown.
        docOriginal = "Unknown";
    }
    
    if(doc.mode == DocumentMode.BITMAP) { //If the document mode is BITMAP then we don't have to do anything, because the document is already BITMAP.
        alert("Document is already " + docOriginal + " cannot convert.\nSaving file to output folder as tif.", "ERROR"); //We make an alert making the user aware that we are not converting the image.
        SaveTIF(saveFile); //We set the file to the correct path (this is the Path as described above)
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); //Last we clone the active document and don't save the changes. Since we save the document another place, we want to keep the original file unchanged. 
        return; //we end the script.
    }
    

    if(doc.mode == DocumentMode.RGB){ //check if mode is RGB
        doc.changeMode(ChangeMode.GRAYSCALE); //if true then convert from RGB to GRAYSCALE.
    }
    
    if(doc.mode == DocumentMode.GRAYSCALE){ //check if mode is GRAYSCALE.
        var bitsaveoptions = new BitmapConversionOptions()
        bitsaveoptions.method = BitmapConversionType.DIFFUSIONDITHER;
        bitsaveoptions.resolution = doc.resolution;
        docRes = doc.resolution;
        app.activeDocument.changeMode(ChangeMode.BITMAP,bitsaveoptions)
        docNew = DocumentMode.BITMAP;
    }


    SaveTIF(saveFile); 
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    //alert("Converted from " + docOriginal + " to " + docNew + " with a reselution of " + docRes + "\nSaved to: " + Path + "/Fixed/" + " as " + Name, "Succes!");
}

function SaveTIF(saveFile){ 
    params = new TiffSaveOptions(); 
    params.byteOrder = ByteOrder.IBM; 
    params.layers = false; 
    params.transparency = false; 
    params.alphaChannels = true; 
    params.embedColorProfile = false;   
    params.imageCompression = TIFFEncoding.TIFFLZW; 
    params.saveImagePyramid = false; 
    app.activeDocument.saveAs (saveFile, params , true,Extension.LOWERCASE);
} 