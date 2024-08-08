const gulp = require('gulp')
const browsersync = require('browser-sync')
const sass = require('gulp-sass')(require('sass'))
const webpack = require('webpack-stream')
const autoprefixer = require('autoprefixer')
const cleanCSS = require('gulp-clean-css')
const postcss = require('gulp-postcss')

const dist = './dist'

gulp.task('copy-html', () => {
	return gulp
		.src('./src/index.html')
		.pipe(gulp.dest(dist))
		.pipe(browsersync.stream())
})

gulp.task('copy-server', () => {
	return gulp.src('./src/server/server.php').pipe(gulp.dest(dist + '/server'))
})

gulp.task('build-js', () => {
	return gulp
		.src('./src/js/main.js')
		.pipe(
			webpack({
				mode: 'development',
				output: {
					filename: 'script.js',
				},
				watch: false,
				devtool: 'source-map',
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /(node_modules|bower_components)/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: [
										[
											'@babel/preset-env',
											{
												debug: true,
												corejs: 3,
												useBuiltIns: 'usage',
											},
										],
									],
								},
							},
						},
					],
				},
			})
		)
		.pipe(gulp.dest(dist + '/js'))
		.pipe(browsersync.stream())
})

gulp.task('build-sass', () => {
	return gulp
		.src('./src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(dist + '/css'))
		.pipe(browsersync.stream())
})

gulp.task('copy-assets', () => {
	gulp.src('./src/icons/**/*.*').pipe(gulp.dest(dist + '/icons'))

	return gulp
		.src('./src/img/**/*.*')
		.pipe(gulp.dest(dist + '/img'))
		.pipe(browsersync.stream())
})

gulp.task('watch', () => {
	browsersync.init({
		server: './dist/',
		port: 4000,
		notify: true,
	})

	gulp.watch('./src/index.html', gulp.parallel('copy-html'))
	gulp.watch('./src/icons/**/*.*', gulp.parallel('copy-assets'))
	gulp.watch('./src/img/**/*.*', gulp.parallel('copy-assets'))
	gulp.watch('./src/server/server.php', gulp.parallel('copy-server'))
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('build-sass'))
	gulp.watch('./src/js/**/*.js', gulp.parallel('build-js'))
})

gulp.task(
	'build',
	gulp.parallel(
		'copy-html',
		'copy-server',
		'copy-assets',
		'build-sass',
		'build-js'
	)
)

gulp.task('prod', () => {
	gulp.src('./src/index.html').pipe(gulp.dest(dist))
	gulp.src('./src/img/**/*.*').pipe(gulp.dest(dist + '/img'))
	gulp.src('./src/icons/**/*.*').pipe(gulp.dest(dist + '/icons'))
	gulp.src('./src/db.json').pipe(gulp.dest(dist + '/db'))

	gulp
		.src('./src/js/main.js')
		.pipe(
			webpack({
				mode: 'production',
				output: {
					filename: 'script.js',
				},
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /(node_modules|bower_components)/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: [
										[
											'@babel/preset-env',
											{
												debug: false,
												corejs: 3,
												useBuiltIns: 'usage',
											},
										],
									],
								},
							},
						},
					],
				},
			})
		)
		.pipe(gulp.dest(dist + '/js'))

	return gulp
		.src('./src/scss/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(cleanCSS())
		.pipe(gulp.dest(dist + '/css'))
})

gulp.task('default', gulp.parallel('watch', 'build'))
