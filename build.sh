#!/usr/bin/env bash
rm -rf ./build 
mkdir build 
cp -r ./test ./build 
copyfiles --flat ./src_dna/*.json ./build/src_dna 
find src_dna -type d -mindepth 1 -exec sh -c 'mkdir ./build/src_dna/$(basename {}) && babel {} --out-file ./build/src_dna/$(basename {})/$(basename {}).js' \;
find src_dna -mindepth 2 -name \"*.json\" -exec cp {} build/`basename {}` \;
mv ./build/src_dna ./build/dna
