import re
import os

def getInvalid(extracted):
    invalid = set()
    for link in extracted:
        link = link.replace("\" target=\"_self", "")
        formatted = link.split("\">")
        formatted[0] = formatted[0].replace("%20", " ")
        formatted[1] = formatted[1].replace("â€™", "'").replace("&amp;", "&")
        if not formatted[0].startswith("https://"):
            if not os.path.exists(formatted[0]):
                invalid.add(formatted[1])
    return invalid

os.chdir("webpages")
os.system("cls")
for filename in os.listdir():
    f = open(filename)
    rawString = f.read()
    invalid = getInvalid(re.findall(r"<a href=\"(.+?)<\/a>", rawString))
    if len(invalid) > 0:
        print("\n" + filename.replace(".html", "") + ": \n")
        for link in invalid:
            print("\t" + link)

input("\nPress ENTER to exit...")