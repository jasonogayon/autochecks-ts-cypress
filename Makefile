ifeq ($(OS), Windows_NT)
	OSTYPE := Windows
else
	OSTYPE := $(shell sh -c 'uname -s 2>/dev/null || echo not')
endif

ORIG_PREFIX:= @
NEW_PREFIX:= -t @

help:
	@echo ""
	@echo "usage: make COMMAND"
	@echo ""
	@echo "Commands:"
	@echo ""
	@echo "    s                   Open Cypress UI"
	@echo ""
	@echo "    h                   Run tests locally without browser (headless)"
	@echo "    bs                  Run tests on Browserstack"
	@echo ""
	@echo "Git-Specific:"
	@echo ""
	@echo "    m                   Update local master branch with remote"
	@echo "    b tag={}            Create new local branch from latest remote master"
	@echo "    bu tag={}           Update local branch with remote master"
	@echo "    bn tag={}           Rename local branch"
	@echo "    d tag={}            Delete local branch"
	@echo "    dr tag={}           Delete remote branch"
	@echo ""


s:
	@npm run cy

h:
	@echo "Running tests ..."; echo "";
	@yarn run test

bs:
	@echo "Running tests ..."; echo ""
	@yarn run bs

snapshots:
	@yarn run snapshots




m:
	@echo "Fetching master (remote) ..."; echo ""
	@git checkout master && git fetch -p origin
	@echo "Merging master (remote to local) ..."; echo ""
	@git merge origin/master
	@echo "Done"; echo ""

b:
	@make m
	@echo "Creating new feature branch ..."; echo ""
	@git checkout -b $(tag) master && git branch
	@echo "Done"; echo ""

bu:
	@make m
	@echo "Merging master to feature branch ..."; echo ""
	@git checkout $(tag) && git merge master && git branch
	@echo "Done"; echo ""

bn:
	@echo "Renaming branch ..."; echo ""
	@git branch -m $(old) $(new)
	@echo "Done"; echo ""

d:
	@echo "Deleting branch (local) ..."; echo ""
	@git checkout master && git branch -D $(tag) && git branch
	@echo "Done"; echo ""

dr:
	@echo "Deleting branch (remote) ..."; echo ""
	@git checkout master && git push origin --delete $(tag)
	@echo "Done"; echo ""


.PHONY: clean init
