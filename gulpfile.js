const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const webpack = require("webpack-stream");
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const fileInclude = require("gulp-file-include");
const postcss = require("gulp-postcss");
const pxtorem = require("postcss-pxtorem");
const replace = require("gulp-replace");
const gcmq = require("gulp-group-css-media-queries");

function pages() {
	return src("src/pages/*.html")
		.pipe(
			fileInclude({
				basepath: "src/components",
			})
		)
		.pipe(replace("@img", "./images"))
		.pipe(dest("src"))
		.pipe(browserSync.stream());
}

function fonts() {
	return src("src/fonts/src/*.*")
		.pipe(
			fonter({
				formats: ["woff", "ttf"],
			})
		)
		.pipe(src("src/fonts/*.ttf"))
		.pipe(ttf2woff2())
		.pipe(dest("src/fonts"));
}

function images() {
	return src([
		"src/images/src/**/*.*",
		"!src/images/src/**/*.{opdownload}",
	])
		.pipe(newer("src/images/dest"))
		.pipe(webp())
		.pipe(imagemin())
		.pipe(dest("src/images/dest"));
}

function scripts() {
	return src(["src/js/main.js"])
		.pipe(
			webpack({
				mode: "development", // production || development
				entry: "./src/js/main.js",
				output: {
					filename: "main.min.js",
				},
			})
		)
		.pipe(dest("src/js"))
		.pipe(browserSync.stream());
}

function styles() {
	return src("src/scss/*.scss")
		.pipe(scss())
		.pipe(gcmq())
		.pipe(
			postcss([
				pxtorem({
					propList: ["*"],
					mediaQuery: true,
				}),
			])
		)
		.pipe(replace("@img", "../images"))
		.pipe(dest("src/css"))
		.pipe(browserSync.stream());
}

function watching() {
	browserSync.init({
		server: {
			baseDir: "src/",
		},
	});
	watch(["src/scss/**/*.scss"], styles);
	watch(["src/images/src"], images);
	watch(["src/js/**/*.js", "!src/js/main.min.js"], scripts);
	watch(["src/components/*", "src/pages/*"], pages);
	watch(["src/*.html"]).on("change", browserSync.reload);
}

function cleanDist() {
	return src("dist", { allowEmpty: true })
		.pipe(clean());
}

function building() {
	return src(
		[
			"src/css/*",
			"src/images/**/*.*",
			"!src/images/**/*.html",
			"!src/images/src/**/*",
			"src/fonts/*.*",
			"src/js/main.js",
			"src/*.html",
		],
		{ base: "src" }
	).pipe(dest("dist"));
}

exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.pages = pages;
exports.building = building;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, pages, watching);
