#!/bin/sh

appname=${0##*/}
appname=${appname%.sh}

rm -r jar_temp
rm $appname.jar

mkdir jar_temp
cp -r content ./jar_temp/
cp -r locale ./jar_temp/
cp -r skin ./jar_temp/

cd jar_temp
chmod -cfr 644 *.jar *.js *.light *.inf *.rdf *.cfg *.manifest

zip -r0 "../$appname.jar" content locale skin -x \*/.svn/\*
cd ..

rm -r jar_temp

