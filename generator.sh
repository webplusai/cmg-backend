#!/bin/bash
# $1 is the name of the module
# This script will generate a module, controller and service

nest generate module modules/$1 --no-spec && nest generate controller modules/$1 --no-spec && nest generate service modules/$1 --no-spec
