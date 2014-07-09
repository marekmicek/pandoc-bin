'use strict';

var BinBuild = require('bin-build');
var BinWrapper = require('bin-wrapper');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

/**
 * Initialize a new BinWrapper
 */

console.log(chalk.yellow('⧖ Downloading Pandoc (~50MB). This may take a couple minutes.'));
var bin = new BinWrapper()
	.src('https://raw.github.com/toshgoodson/pandoc-bin/0.0.0/vendor/osx/pandoc', 'darwin')
	// .src('https://raw.github.com/imagemin/optipng-bin/0.3.9/vendor/linux/x86/optipng', 'linux', 'x86')
	// .src('https://raw.github.com/imagemin/optipng-bin/0.3.9/vendor/linux/x64/optipng', 'linux', 'x64')
	// .src('https://raw.github.com/imagemin/optipng-bin/0.3.9/vendor/freebsd/optipng', 'freebsd')
	// .src('https://raw.github.com/imagemin/optipng-bin/0.3.9/vendor/sunos/x86/optipng', 'sunos', 'x86')
	// .src('https://raw.github.com/imagemin/optipng-bin/0.3.9/vendor/sunos/x64/optipng', 'sunos', 'x64')
	// .src('https://raw.github.com/imagemin/optipng-bin/0.3.9/vendor/win/optipng.exe', 'win32')
	.dest(path.join(__dirname, 'vendor'))
	.use(process.platform === 'win32' ? 'pandoc.exe' : 'pandoc');

/**
 * Only run check if binary doesn't already exist
 */

fs.exists(bin.use(), function (exists) {
	if (!exists) {
		bin.run(['--version'], function (err) {
			if (err) {
				console.log(chalk.red('✗ pre-build test failed, compiling from source...'));

				var builder = new BinBuild()
					.src('http://downloads.sourceforge.net/project/optipng/OptiPNG/optipng-0.7.5/optipng-0.7.5.tar.gz')
					.cfg('./configure --with-system-zlib --prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"')
					.make('make install');

				return builder.build(function (err) {
					if (err) {
						return console.log(chalk.red('✗ ' + err));
					}

					console.log(chalk.green('✓ optipng built successfully'));
				});
			}

			console.log(chalk.green('✓ pre-build test passed successfully'));
		});
	}
});

/**
 * Module exports
 */

module.exports.path = bin.use();
