#!/usr/bin/env bash

output=(basename $1 .md)

[ -f $1 ] \
&& [ -f ./config/default.pandoc.conf ] \
&& [ -f ./templates/note_template.html ] \
&& pandoc -s --defaults config/default.pandoc.conf -o ${output}.html $1
