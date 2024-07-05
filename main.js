const {app, BrowserWindow} = require("electron");
const {shell} = require('electron');
var mammoth = require('mammoth');
var fs = require("fs");

//Generate HTML
createHtml();

//Create Electron Window
function createWindow(){
    const win = new BrowserWindow({
        width: 1120,
        height: 720,
        minWidth: 300,
        minHeight: 200,
        autoHideMenuBar: true,
        icon: "resources/icon.ico",
    
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return {action: 'deny'};
      });
    win.loadFile("main.html");
}

app.prependListener("window-all-closed", () => {app.quit();});

//Extract From Word Document
function createHtml(){
    mammoth.convertToHtml({path: "../.indices/Main Index.docx"})
        .then(function(result){
            formatOutput(result.value);
            app.whenReady().then(createWindow);
        })
        .catch(function(error) {
            console.error(error);
        });
}

//Format Extracted Html String
function formatOutput(input){
    output = input.replaceAll(/<\/?p>/g, "")                //Remove <p> and </p>
    .replaceAll("</a><a href=\"", "</a>\n<a href=\"")       //Add \n between <a></a>
    .replaceAll("</h1>", "</h1>\n")                         //Add \n before <h1>
    .replaceAll("<ol>", "\n<ol>")                           //Add \n before <ol>
    .replaceAll("<li>", "\n<li>")                           //Add \n before <li>
    .replaceAll("</h2>", "</h2>\n")                         //Add \n after <h2>
    .replaceAll("><h1>", ">\n<h1>")                         //Add \n before <h1> (other than the first one)
    .replaceAll("><h2>", ">\n<h2>")                         //Add \n before second <h2>
    .replaceAll("</ol>", "\n</ol>\n")                       //Add \n either side of </ol>
    .replaceAll(/[^>]*$/gm, "\n$&")                         //Add \n before loose text (and one to everything)
    .replaceAll(/\n+/g, "\n")                               //Removes blank lines
    .replaceAll(/^[^<].*/gm, "<p>$&</p>")                   //add a <p> tags to all lines that have no tags
    
    //Add Doctor Tags
    .replace("<h1>Second Doctor</h1>", "<h1 id=\"two\">Second Doctor</h1>")
    .replace("<h1>Third Doctor</h1>", "<h1 id=\"three\">Third Doctor</h1>")
    .replace("<h1>Fourth Doctor</h1>", "<h1 id=\"four\">Fourth Doctor</h1>")
    .replace("<h1>Fifth Doctor</h1>", "<h1 id=\"five\">Fifth Doctor</h1>")
    .replace("<h1>Sixth Doctor</h1>", "<h1 id=\"six\">Sixth Doctor</h1>")
    .replace("<h1>Seventh Doctor</h1>", "<h1 id=\"seven\">Seventh Doctor</h1>")
    .replace("<h1>Eighth Doctor</h1>", "<h1 id=\"eight\">Eighth Doctor</h1>")
    .replace("<h1>War Doctor</h1>", "<h1 id=\"war\">War Doctor</h1>")
    .replace("<h1>Ninth Doctor</h1>", "<h1 id=\"nine\">Ninth Doctor</h1>")
    .replace("<h1>Tenth Doctor</h1>", "<h1 id=\"ten\">Tenth Doctor</h1>")
    .replace("<h1>Eleventh Doctor</h1>", "<h1 id=\"eleven\">Eleventh Doctor</h1>")
    .replace("<h1>Twelfth Doctor</h1>", "<h1 id=\"twelve\">Twelfth Doctor</h1>");
    
    //fs.writeFileSync("parse.html", output);
    table = produceTable(output.split("\n"));
    start = fs.readFileSync("templates/start.html");
    end = fs.readFileSync("templates/end.html");
    fs.writeFileSync("main.html", start + table + end)
}

//Create Main 
function produceTable(input){
    indent = 0;
    topHeader = true;
    contenttable = "<table border=0 style=\"width: 820px;\">\n";
    output = contenttable;
    for(const element of input){
        if(element == "<ol>"){
            output += "<ol>\n";
            indent++;
        }else if(element.startsWith("<p>")){
            if(indent==0){
                output += "<tr><td>" + element + "\n";
            }else{
                output += element + "\n";
            }
        }else if(element == "</ol>"){
            if(indent==0){
                output += "</ol>\n</td></tr>\n";
            }else{
                output += "</ol>\n";
            }
            indent--;
        }else if(element.startsWith("<li>") || element.startsWith("</li>")){
            output += element + "\n";
        }else if(element.startsWith("<h1")){
            tr = "<tr background=\"resources/bars/";
            if(element.includes("First") || element .includes("Fourth") || element.includes("Twelfth")){
                tr += "blue.png\">";
            }else if(element.includes("Second") || element.includes("Eleventh")){
                tr += "pink.png\">";
            }else if(element.includes("Eighth") || element.includes("Third")){
                tr += "purple.png\">";
            }else if(element.includes("Fifth") || element.includes("Tenth")){
                tr += "green.png\">";
            }else if(element.includes("War") || element.includes("Sixth")){
                tr += "gold.png\">";
            }else{
                tr += "red.png\"\>";
            }
            if (topHeader){
                output += tr + "<td>\n" + element + "\n</td></tr>\n";
                topHeader = false;
            }else{
                output += "</table><br>" + contenttable + tr + "<td>\n" + element + "\n</td></tr>\n";
            }

        }else if(element == ""){
            //pass
        }else{
            output += "<tr><td>\n" + element + "\n</td></tr>\n";
        }
    }
    output += "</table>";

    return output;
}