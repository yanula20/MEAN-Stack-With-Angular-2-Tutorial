#!/bin/bash

set -eo pipefail


TARGETFMT='/opt/vagrant/embedded/gems/gems/vagrant-%s/plugins/providers/virtualbox/driver/meta.rb'

die() { echo >&2 "$@"; exit 1; }

[[ $EUID -eq 0 ]] || die "sudo required"

command -v vagrant >/dev/null || die "no vagrant installed"

version=$(vagrant version | awk '{ print $NF; exit }')
[[ -n $version ]] || die "no version found"

# shellcheck disable=SC2059
target=$(printf "$TARGETFMT" "$version")
[[ -f $target ]] || die "$target not found"

cp "$target" "$target.orig"
sed -i '' 's/"4.0" => Version_4_0,/"5.2" => Version_5_1,/' "$target"