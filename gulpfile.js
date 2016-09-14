"use strict";

const gulp    = require("gulp"),
	  minify  = require("gulp-minify-css"),
	  prefix  = require("gulp-autoprefixer"),
	  sass    = require("gulp-sass"),
	  rename  = require("gulp-rename");

gulp.task("css", function() {
	gulp.src("scss/main.scss")
	.pipe(sass())
	.pipe(prefix("last 5 versions","> 1%","ie 9"))
	.pipe(minify())
	.pipe(rename("main.min.css"))
	.pipe(gulp.dest("css/"));
});


gulp.task("watch", function() {
	gulp.watch("scss/**/*.scss", ["css"]);
});

gulp.task("default", ["watch", "css"]);