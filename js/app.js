angular.module('myApp', ['ui.bootstrap', 'myApp.controllers', 'myApp.directives', 'myApp.filters', 'myApp.services']);

angular.module('myApp')
.config(	
	function ($routeProvider) {
  		$routeProvider
        .when('/page/contact', {templateUrl: 'partials/contact.html', controller: 'ContactController'})
    		.when('/page/:slug', {templateUrl: 'partials/page.html', controller: 'RouteController'})
    		.otherwise({redirectTo: '/page/home'});
	}
);

angular.module('myApp.controllers', [])
.controller('AppController', ['$scope', '$rootScope', '$http', '$window', '$modal', '$log',
  function ($scope, $rootScope, $http, $window, $modal, $log) {
      $scope.visitor = 'Guest';

    // Load static links on startup
      $http.get('links.json').success(function (links) {
        $rootScope.staticLinks = links.staticLinks.content;
        //console.log('# of links: '+$rootScope.staticLinks.length)
      });

  	// Load pages on startup
    	$http.get('pages.json').success(function (data) {
      	$rootScope.pages = data;
    	});

    	// Set the slug for menu active class
    	$scope.$on('routeLoaded', function (event, args) {
      	$scope.slug = args.slug;
    	});

      $scope.items = [];
      
      $scope.openModal = function (strVal) {
        $log.info(strVal+' clicked...');

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: ModalInstanceCtrl,
        resolve: {
          items: function () {
            /*return $scope.items;*/
            return strVal;
          }
        },
        backdrop: 'static'
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

      $scope.items = [];
      $scope.items.push(items);
      $scope.selected = {
        item: $scope.items[0]
      };

      $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.openInNewWindow = function(url) {
        var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
        var win = $window.open(url, "_blank", strWindowFeatures);
      };

    };

  }
])
.controller('RouteController', ['$scope', '$rootScope', '$routeParams',
  function ($scope, $rootScope, $routeParams) {
  	// Getting the slug from $routeParams
    	var slug = $routeParams.slug;
      //console.log('slug='+slug);
    	$scope.$emit('routeLoaded', {slug: slug});
    	$scope.page = $rootScope.pages[slug];
  }
])
.controller('ContactController', ['$scope', '$rootScope', 
  function ($scope, $rootScope) {
      $scope.$emit('routeLoaded', {slug: 'contact'});
      $scope.page = $rootScope.pages['contact'];
  }
]);

angular.module('myApp.directives',[])
.directive('myLinkDirective', ['$log', function($log) {
  $log.info('Start myLinkDirective.....');
  var ddo = {
    restrict: 'A',
    replace : true,
    transclude : false,
    templateUrl : 'partials/mylinks.html'
  };
  return ddo;
}
]);

angular.module('myApp.filters',[])
.filter('ttDesc', [function() {
  return function(str) {
    if(angular.isDefined(str)) {
      return 'Click to go to '+str;
    }
  }
}
]);

angular.module('myApp.services',[])
.factory('getData', [function() {
   return ;
}
])
.service('getDataService', [function() {
   return ;
}
]);



