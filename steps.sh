#!/bin/sh
set -x
rm -r out
podman stop $(podman ps --filter "label=out_label" -q)
podman build . -t out_image
podman run --label "out_label" --rm -itd out_image busybox sleep 4s
podman cp $(podman ps --filter "label=out_label" -q):out out
