module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2,
          paths: ["app/public/styles/css/"]
        },
        files: {
          "app/public/styles/css/homepage/homepage.css": "app/public/styles/less/homepage/*.less", // destination file and source file
          "app/public/styles/css/default/reset.css": "app/public/styles/less/default/*.less",
          "app/public/styles/css/customForm/customForm.css": "app/public/styles/less/customForm/*.less",
          "app/public/styles/css/groupProfile/groupProfile.css": "app/public/styles/less/groupProfile/*.less"
        }
      }
    },
    watch: {
      styles: {
        files: ['app/public/styles/less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'watch']);
};