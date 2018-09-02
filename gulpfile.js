const dev = require("./src/index");
const gulp = require("gulp");

const options = {
    watch: true,
    debug: true
};

gulp.task("default", ()=>{
    dev.buildMain();
    dev.buildRenderer();
    //dev.buildHtml();
    gulp.src("./src/renderer/index.html")
        .pipe(gulp.dest("./dist/index.html"));
});

gulp.src("./src/renderer/index.html")
    .pipe(gulp.dest("./dist/app"))
    .on("end", ()=>{
        dev.buildMain(options);
        dev.buildRenderer(options);
    });
gulp.src("./package.json")
    .pipe(gulp.dest("./dist"));
//dev.buildHtml();

