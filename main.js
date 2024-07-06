const {app, BrowserWindow} = require("electron");
const {shell} = require('electron');
var mammoth = require('mammoth');
var fs = require("fs");

//Generate HTML Files
fs.rmSync("webpages", { recursive: true }, (err) => {});
fs.mkdirSync("webpages", { recursive: false }, (err) => {});
fs.readdir("../.indices", (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach((file) => {
        createHtml(file.replace(".docx", ""));
    });
});

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
    win.loadFile("webpages/Main.html");
}

app.prependListener("window-all-closed", () => {app.quit();});

//Extract From Word Document
function createHtml(filename){
    mammoth.convertToHtml({path: "../.indices/" + filename + ".docx"})
        .then(function(result){
            formatOutput(result.value, filename);
            if(filename == "Main"){
                app.whenReady().then(createWindow);
            }
        })
        .catch(function(error) {
            console.error(error);
        });
}

//Format Extracted HTMl String
function formatOutput(input, filename){
    output = input.replaceAll(/<\/?p>/g, "")                            //Remove <p> and </p>
    .replaceAll("</a><a href=\"", "</a>\n<a href=\"")                   //Add \n between <a></a>
    .replaceAll("</h1>", "</h1>\n")                                     //Add \n before <h1>
    .replaceAll("<ol>", "\n<ol>")                                       //Add \n before <ol>
    .replaceAll("<li>", "\n<li>")                                       //Add \n before <li>
    .replaceAll("</h2>", "</h2>\n")                                     //Add \n after <h2>
    .replaceAll("><h1>", ">\n<h1>")                                     //Add \n before <h1> (other than the first one)
    .replaceAll("><h2>", ">\n<h2>")                                     //Add \n before second <h2>
    .replaceAll("</ol>", "\n</ol>\n")                                   //Add \n either side of </ol>
    .replaceAll(/<a id=\"(.*)\"><\/a>/g, "")                            //Remove random <a id> tags
    .replaceAll(/<a href="..\//g, "$&../")                               //Reassign Links
    .replaceAll(/[^>]*$/gm, "\n$&")                                     //Add \n before loose text (and one to everything)
    .replaceAll(/\n+/g, "\n")                                           //Removes blank lines
    .replaceAll(/^[^<].*/gm, "<p>$&</p>")                               //Add a <p> tags to all lines that have no tags
    .replaceAll(/"([^\/]*)\.docx"/g, "\"$1.html\" target=\"_self\"")    //Replace index links
    
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
    .replace("<h1>Twelfth Doctor</h1>", "<h1 id=\"twelve\">Twelfth Doctor</h1>")
    .replace("<h1>More</h1>", "<h1 id=\"more\">More</h1>");
    
    table = produceTable(output.split("\n"));
    start = fs.readFileSync("templates/start.html", "utf8");
    end = fs.readFileSync("templates/end.html");
    fs.writeFileSync(("webpages/" + filename + ".html"), start.replace(">Dodex - Main<", ">Dodex - " + filename + "<") + table + end);
}

//Create Central Table
function produceTable(input){
    indent = 0;
    headers = 0;
    contenttable = "<table border=0 style=\"width: 820px;\">\n";
    bars = ["blue", "pink", "purple", "green", "gold", "red"];

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
            tr = "<tr background=\"../resources/bars/";
            if(element.includes(">First Doctor<") || element .includes(">Fourth Doctor<") || element.includes(">Twelfth Doctor<")){
                tr += bars[0];
            }else if(element.includes(">Second Doctor<") || element.includes(">Eleventh Doctor<")){
                tr += bars[1];
            }else if(element.includes(">Eighth Doctor<") || element.includes(">Third Doctor<")){
                tr += bars[2];
            }else if(element.includes(">Fifth Doctor<") || element.includes(">Tenth Doctor<")){
                tr += bars[3];
            }else if(element.includes(">War Doctor<") || element.includes(">Sixth Doctor<") || element.includes(">More<")){
                tr += bars[4];
            }else if(element.includes(">Ninth Doctor<") || element.includes(">Seventh Doctor<")){
                tr += bars[5];
            }else{
                tr += bars[headers%bars.length];
            }

            if (headers == 0){
                output += tr + ".png\"><td>\n" + element + "\n</td></tr>\n";
            }else{
                output += "</table>"
                if(element.includes(">More<")){
                    output += "<br><br><br>";
                }
                output += "<br>" + contenttable + tr + ".png\"><td>\n" + element + "\n</td></tr>\n";
            }
            headers++

        }else if(element == ""){
            //pass
        }else{
            output += "<tr><td>\n" + element + "\n</td></tr>\n";
        }
    }
    output += "</table>";

    return output;
}