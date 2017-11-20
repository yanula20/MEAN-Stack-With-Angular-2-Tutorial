#!/usr/bin/env bash
#https://packages.debian.org/jessie/all/libjs-angularjs/download


sudo echo 'deb http://ftp.us.debian.org/debian jessie main' | sudo tee /etc/apt/sources.list.d/angular.list

sudo apt install -i  -f - y /etc/apt/sources.list.d/libjs-angularjs_1.2.26-1_all.deb


#maybe sudo apt install debian.org

 