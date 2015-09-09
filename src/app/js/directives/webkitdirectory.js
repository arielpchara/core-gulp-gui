module.exports = function (app) {
    app.directive('webkitdirectory',function () {
      return {
        link: function (scope,input) {
          input.on('change',function (e) {
            scope.$emit('webkitdirectory.change', this.value.split('\\').slice(0,-1).join('/') );
            return false;
          });
        }
      };
    });
};
