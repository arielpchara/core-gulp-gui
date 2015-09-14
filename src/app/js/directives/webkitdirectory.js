module.exports = function (app) {
    app
    .directive('webkitdirectory',function () {
      return {
        link: function (scope,input) {
          input.on('change',function (e) {
            //.split('\\').slice(0,-1).join('/')
            scope.$emit('webkitdirectory.change', this.value );
            return false;
          });
        }
      };
    })
    .directive('fileselector',function () {
      return {
        link: function (scope,input) {
          input.on('change',function (e) {
            scope.$emit('fileselector.change', this.value );
            return false;
          });
        }
      };
    });
};
