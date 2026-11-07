#!/bin/bash

find . -maxdepth 1 -name "*.exe" -exec md5sum {} \; >settings/exe_md5.txt
find . -maxdepth 1 -name "*.dll" -exec md5sum {} \; >settings/dll_md5.txt

cat ./settings/exe_md5.txt
cat ./settings/dll_md5.txt
