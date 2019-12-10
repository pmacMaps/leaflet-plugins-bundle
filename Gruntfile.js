module.exports = function(grunt){
	// configurations
    grunt.initConfig({
		concat: {
			css: {
				options: {
					separator: ''
				},
				src: ['plugins/css/*/*.css' ],
				dest: 'combined/css/leaflet-plugins.css'
			 },
			js_esri: {
				options: {
					separator: '\n\n',
					stripBanners: {
						block: true,
						line: true
					},
				},	
				src: ['plugins/js/esri/esri-leaflet/esri-leaflet.js', 'plugins/js/esri/esri-leaflet-renderers/esri-leaflet-renderers.js', 'plugins/js/esri/esri-leaflet-geocoder/esri-leaflet-geocoder.js', 'plugins/js/esri/esri-leaflet-legend/esri-leaflet-legend.js'],
				dest: 'combined/js/esri/esri-leaflet-plugins.js'
			},
			js_leaflet: {
				options: {
					separator: '\n\n',
					stripBanners: {
						block: true,
						line: true
					},	
				},
				src: ['plugins/js/leaflet/leaflet-fullscreen/Leaflet.fullscreen.js', 'plugins/js/leaflet/leaflet-locate-control/L.Control.Locate.min.js', 'plugins/js/leaflet/leaflet-zoomhome/leaflet.zoomhome.js'],
				dest: 'combined/js/leaflet/leaflet-plugins.js'
			},
			js_proj : {
				src: ['plugins/js/proj4JS/proj4js/proj4.js', 'plugins/js/proj4JS/Proj4Leaflet/proj4leaflet/js'],
				dest: 'combined/js/projections/projections.js'
			}
		},		
		cssmin: {
          options: {
              sourceMap: true
          },    
		  target: {
			files: [{
			  expand: true,
			  cwd: 'combined/css/',
			  src: ['*.css'],
			  dest: 'bundled/css',
			  ext: '.min.css'
			}]
		  }
	    },
		uglify: {
			options: {
				mangle: false,
				sourceMap: false        		
			},
			my_target: {
			  files: {
				'bundled/js/esri-leaflet-plugins.min.js' : ['combined/js/esri/esri-leaflet-plugins.js'],
				'bundled/js/leaflet-plugins.min.js' : ['combined/js/leaflet/leaflet-plugins.js'],
				'bundled/js/projections.js.min.js' : ['combined/js/projections/projections.js']
			  }
			}
  		}		
	});
    // load tasks
	grunt.loadNpmTasks('grunt-contrib-concat');	
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');    
};