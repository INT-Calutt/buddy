import sys
import re
import os


# for dir in os.listdir():
#     for file in dir:
#         print(file)

with open("src\sass\index.scss", 'w', encoding="utf8") as indexFile:
    for path, subdirs, files in os.walk("C:\\Users\\hertz\\OneDrive\\Desktop\\Cart-IL\\buddy\\src\\sass"):
        last = None
        curr = None
        for name in files:
            if (name == "index.scss"):
                continue
            sass_path = path.split("sass\\")[1]
            sass_file = name[1:]
            line = "@import '" + sass_path + "/" + sass_file + "';\n"
            curr = sass_path
            if curr != last:
                indexFile.write("\n")
                last = curr
            indexFile.write(line)
