DIR := $(shell dirname $(lastword $(MAKEFILE_LIST)))

NODE_MODS  := $(DIR)/node_modules
JADE       := $(NODE_MODS)/jade/bin/jade.js
STYLUS     := $(NODE_MODS)/stylus/bin/stylus
AP         := $(NODE_MODS)/autoprefixer/autoprefixer
UGLIFY     := $(NODE_MODS)/uglify-js/bin/uglifyjs
BROWSERIFY := $(NODE_MODS)/browserify/bin/cmd.js

HTTP_DIR := http

HTML   := index
HTML   := $(patsubst %,$(HTTP_DIR)/%.html,$(HTML))
CSS    := $(wildcard src/stylus/*.styl)
CSS    := $(patsubst src/stylus/%.styl,$(HTTP_DIR)/css/%.css,$(CSS))
JS     := $(wildcard src/js/*.js)
JS_ASSETS := $(HTTP_DIR)/js/assets.js
STATIC := $(shell find static -type f \! -name *~)
STATIC := $(patsubst static/%,$(HTTP_DIR)/%,$(STATIC))
TEMPLS := $(wildcard src/jade/templates/*.jade)

WATCH  := src/jade src/js src/stylus static Makefile

all: dirs html css js static

html: templates $(HTML)

css: $(CSS)

js: $(JS_ASSETS)

static: $(STATIC)

templates: build/templates.jade

build/templates.jade: $(TEMPLS)
	mkdir -p build
	cat $(TEMPLS) >$@

$(HTTP_DIR)/index.html: build/templates.jade

$(JS_ASSETS): $(JS) node_modules
	NODE_PATH=./static/js $(BROWSERIFY) src/js/main.js -s main -o $@ || \
	(rm -f $@; exit 1)
#	$(UGLIFY) $(JS) -o $@ --source-map $@.map --source-map-root /js/ \
	  --source-map-url $(shell basename $@).map -c -p 2

node_modules:
	npm install

$(HTTP_DIR)/js/%.js: src/js/%.js
	install -D $< $@

$(HTTP_DIR)/%: static/%
	install -D $< $@

$(HTTP_DIR)/%.html: src/jade/%.jade $(wildcard src/jade/*.jade) node_modules
	$(JADE) $< -o $(HTTP_DIR) || (rm -f $@; exit 1)

$(HTTP_DIR)/css/%.css: src/stylus/%.styl node_modules
	$(STYLUS) -I styles < $< | $(AP) -b "> 1%" >$@ || (rm -f $@; exit 1)

dirs:
	@mkdir -p $(HTTP_DIR)/css
	@mkdir -p $(HTTP_DIR)/js
	@mkdir -p $(HTTP_DIR)/docs

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
