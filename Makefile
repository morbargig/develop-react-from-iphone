SHELL=/bin/bash

auto-commit: 
	echo `git add . && git commit -m "Auto commit by $$(git config user.name) at $$(date +%Y-%m-%dT%H:%M%z)" && g$$(make push)`
push:
	git push --recurse-submodules=check origin $$(git branch --show-current)
pull:
	echo `git pull --recurse-submodules origin $$(git branch --show-current) && $$(make submodule-update)`

get-remote:
	echo `git config --get remote.origin.url`
clone:
	echo `git clone --recurse-submodules origin $$(git branch --show-current)`

init-submodule:
	echo `git submodule update --init --recursive -j 8`

submodule-update:
	echo `git submodule update --remote`F