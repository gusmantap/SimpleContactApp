var app = angular.module("contactList", ['ui.router', 'routing', 'angular-loading-bar', 'ngAnimate']);
// Token = Basic admin:1234
var token = "Basic YWRtaW46MTIzNA==";


app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
}]);

app.controller("loginCtrl", function($scope) {

    $scope.user = [];

    $scope.clickLogin = function() {

        if ($scope.user.name === undefined && $scope.user.pass === undefined) {
            alert("Harap isi semuanya!");
        } else if ($scope.user.name == "admin" && $scope.user.pass == "1234") {
            location.href = "/#/admin/dashboard";
        } else {
            alert("Gagal Masuk");
        }
    };
});


app.controller('adminCtrl', function($scope, $rootScope, $http, $location, $filter) {

    $rootScope.host = "http://" + location.hostname + ":2090";
    


    // Declare Scope
    $scope.deletedId = {};
    $scope.search = {};
    $scope.search.selectBy = "all";
    $scope.search.group = "";
    $scope.nav = false;
    $scope.detailPanel = false;




    $rootScope.getData = function() {
        $http.get($rootScope.host + "/api", {
            headers: {
                Authorization: token
            }
        }).success(function(response) {
            $scope.contact = response;
        });
    };


    $rootScope.getById = function(id) {
        $http.get($rootScope.host + "/api/" + id, {
            headers: {
                Authorization: token
            }
        }).success(function(response) {
            $rootScope.detailContact = response;
        });
    };

    $scope.groupById = function(char) {
        $scope.search.group = char;
        $scope.filtering();
        $scope.closeAll();
        $location.path("/admin/dashboard");

    };
    $scope.filtering = function() {

        var field = $scope.search.selectBy;
        if (field == 'title') {

            $scope.filterContact = $filter('filter')($scope.contact, {
                "title": $scope.search.q,
                "groupby": $scope.search.group
            });

        } else if (field == 'name') {
            $scope.filterContact = $filter('filter')($scope.contact, {
                "name": $scope.search.q,
                "groupby": $scope.search.group
            });
        } else if (field == 'email') {
            $scope.filterContact = $filter('filter')($scope.contact, {
                "email": $scope.search.q,
                "groupby": $scope.search.group
            });
        } else if (field == 'phone') {
            $scope.filterContact = $filter('filter')($scope.contact, {
                "phone": $scope.search.q,
                "groupby": $scope.search.group
            });
        } else if (field == 'address') {
            $scope.filterContact = $filter('filter')($scope.contact, {
                "address": $scope.search.q,
                "groupby": $scope.search.group
            });
        } else if (field == 'company') {
            $scope.filterContact = $filter('filter')($scope.contact, {
                "company": $scope.search.q,
                "groupby": $scope.search.group
            });
        } else {
            $scope.filterContact = $filter('filter')($scope.contact, {
                $: $scope.search.q,
                "groupby": $scope.search.group
            });
        }

    };

    $scope.viewClick = function(dataId) {
        $rootScope.getById(dataId);
        $scope.openDetail();
    };

    $scope.openNav = function() {
        if ($scope.nav === true) {
            $scope.nav = false;
        } else if ($scope.nav === false) {
            $scope.nav = true;
        }
    };
    $scope.openDetail = function() {
        if ($scope.detailPanel === false) {
            $scope.detailPanel = true;
        }
    };
    $scope.closeAll = function() {
        $scope.nav = false;
        $scope.detailPanel = false;

    };

    $scope.deleteData = function(id) {
        deleteContact(id);
        $rootScope.detailContact = {};
    };

    $scope.directUpdate = function(id) {
        location.href = $rootScope.host + "/#/admin/edit/" + id;
    };

    var deleteContact = function(id) {
        var c = confirm("Yakin ingin menghapus");

        if (c == 1) {
            $http.delete($rootScope.host + "/api/" + id, {
                headers: {
                    Authorization: token
                }
            }).success(function(response) {
                $scope.getData();
            });
        } else {
            alert("Dibatalkan!");
            $scope.getById(id);
        }

        $location.path("/admin/dashboard");
        $scope.closeAll();
    };


    // Call Function
    $rootScope.getData();


    $scope.addContact = function() {
        $scope.search.group = false;
        $scope.search.group = "add";
        $location.path("/admin/add");
        $scope.closeAll();
    };
});

app.controller('formTambahCtrl', function($scope, $rootScope, $http, $location) {
    $scope.data = {};
    $scope.data.groupby = "none";

    $scope.tambahData = function() {

        $scope.newData = {
            "name": $scope.data.fullname,
            "title": $scope.data.title,
            "email": $scope.data.email,
            "phone": $scope.data.phone,
            "address": $scope.data.address,
            "company": $scope.data.company,
            "groupby": $scope.data.groupby
        };

        $scope.data = {};


        $http.post($rootScope.host + "/api", $scope.newData, {
            headers:{
                Authorization:token
            }
        }).success(function(response) {

            $location.path("/admin/dashboard");
            $scope.getData();
        });
        $scope.detailContact = "";
        $scope.search = {};
        $scope.search.selectBy = "all";
        $scope.search.group = "";

        $scope.groupById("");

    };
});

app.controller("formEditCtrl", function($scope, $rootScope, $stateParams, $http, $location) {
    $scope.data = {};
    $scope.data.groupby = "none";

    var id = $stateParams.id;

    $http.get($rootScope.host + "/api/" + id, {
        headers: {
            Authorization: token
        }
    }).success(function(response) {
        $scope.data = response[0];
        $rootScope.getData();
    });


    $scope.updateData = function(item) {
        var id = item.data._id;
        $http.put($rootScope.host + "/api/" + id, item.data, {
            headers: {
                Authorization: token
            }
        }).success(function(response) {

            $contactDetail = {};
            $rootScope.getById(id);
            $rootScope.getData();
            $location.path("/admin/dashboard");
        });
    };



});
