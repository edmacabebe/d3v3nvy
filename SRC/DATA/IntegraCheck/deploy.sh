#!/bin/bash
echo ‘number of arguments’
echo "\$#: $#"
echo ”

echo ‘using $num’
echo "\$0 [local|dev|qa|uat|sit|staging|prod]"
if [ $# -ge 1 ];then echo "\$1: $1"; fi
if [ $# -ge 2 ];then echo "\$2: $2"; fi
if [ $# -ge 3 ];then echo "\$3: $3"; fi
if [ $# -ge 4 ];then echo "\$4: $4"; fi
if [ $# -ge 5 ];then echo "\$5: $5"; fi
echo ”

echo ‘using $@’
#let i=1
#let env = "local"
#for x in $@; do
 #echo "$i: $x"
 #let i=$i+1
 #env = $x
#done

./ml $@ bootstrap
./ml $@ deploy modules
./ml $@ deploy content
#./ml $@ mlcp -options_file options_scripts/import-sample-data.options
./ml $@ mlcp -options_file options_scripts/import-sample-profile.options
./ml $@ mlcp -options_file options_scripts/constants.options
./ml $@ mlcp -options_file options_scripts/dictionary-constants.options
./ml $@ mlcp -options_file options_scripts/thesauri-constants.options