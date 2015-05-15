DIR := $(shell dirname $(lastword $(MAKEFILE_LIST)))

NODE_MODS  := $(DIR)/node_modules
JADE       := $(NODE_MODS)/jade/bin/jade.js
STYLUS     := $(NODE_MODS)/stylus/bin/stylus
AP         := $(NODE_MODS)/autoprefixer/autoprefixer
BROWSERIFY := $(NODE_MODS)/browserify/bin/cmd.js
MARKED     := $(NODE_MODS)/marked/bin/marked

HTML   := index
HTML   := $(patsubst %,http/%.html,$(HTML))
CSS    := $(wildcard src/stylus/*.styl)
CSS_ASSETS := build/css/style.css
JS     := $(wildcard src/js/*.js)
JS_ASSETS := build/js/assets.js
DOCS   := $(wildcard src/docs/*.md)
DOCS   := $(patsubst src/docs/%.md,http/docs/%.html,$(DOCS))
STATIC := $(shell find static -type f \! -name *~)
STATIC := $(patsubst static/%,http/%,$(STATIC))
TEMPLS := $(wildcard src/jade/templates/*.jade)

WATCH  := src/jade src/js src/stylus src/docs static Makefile

all: docs html css js static

docs: $(DOCS)

html: templates $(HTML)

css: $(CSS_ASSETS) $(CSS_ASSETS).sha256
	install -D $< http/css/style-$(shell cat $(CSS_ASSETS).sha256).css

js: $(JS_ASSETS) $(JS_ASSETS).sha256
	install -D $< http/js/assets-$(shell cat $(JS_ASSETS).sha256).js

static: $(STATIC)

templates: build/templates.jade

build/templates.jade: $(TEMPLS)
	mkdir -p build
	cat $(TEMPLS) >$@

build/hashes.jade: $(CSS_ASSETS).sha256 $(JS_ASSETS).sha256
	echo "- var css_hash = '$(shell cat $(CSS_ASSETS).sha256)'" > $@
	echo "- var js_hash = '$(shell cat $(JS_ASSETS).sha256)'" >> $@

http/index.html: build/templates.jade build/hashes.jade

$(JS_ASSETS): $(JS) node_modules
	@mkdir -p $(shell dirname $@)
	NODE_PATH=./static/js $(BROWSERIFY) src/js/main.js -s main -o $@ || \
	(rm -f $@; exit 1)

node_modules:
	npm install

%.sha256: %
	mkdir -p $(shell dirname $@)
	sha256sum $< | sed 's/^\([a-f0-9]\+\) .*$$/\1/' > $@

http/docs/%.html: src/docs/%.md
	@mkdir -p $(shell dirname $@)
	$(MARKED) -i $< -o $@ --gfm --tables --smart-lists

http/%: static/%
	install -D $< $@

http/%.html: src/jade/%.jade $(wildcard src/jade/*.jade) node_modules
	@mkdir -p $(shell dirname $@)
	$(JADE) $< -o http || (rm -f $@; exit 1)

build/css/%.css: src/stylus/%.styl node_modules
	@mkdir -p $(shell dirname $@)
	$(STYLUS) -I styles < $< | $(AP) -b "> 1%" >$@ || (rm -f $@; exit 1)

watch:
	@clear
	$(MAKE)
	@while sleep 1; do \
	  inotifywait -qr -e modify -e create -e delete \
		--exclude .*~ --exclude \#.* $(WATCH); \
	  clear; \
	  $(MAKE); \
	done

tidy:
	rm -f $(shell find "$(DIR)" -name \*~)

clean: tidy
	rm -rf http build

dist-clean: clean
	rm -rf node_modules

.PHONY: all install html css static templates clean tidy
