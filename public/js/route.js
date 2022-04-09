var app = angular.module("routing", []);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state("login", {
			"url":"/login",
			"templateUrl":"template/login.html",
			"controller":"loginCtrl"
		})
		.state("admin", {
			"url":"/admin",
			"abstract":true,
			"controller":"adminCtrl",
			"templateUrl":"template/admin.html"
		})
		.state("admin.dash", {
			"url":"/dashboard",
			"views":{
				"mainDash":{
					"templateUrl":"template/dashboard.html"
				}
			}
		})
		.state("admin.tambah", {
			"url":"/add",
			"views":{
				"mainDash":{
					"controller":"formTambahCtrl",
					"templateUrl":"template/form-tambah.html"
				}
			}
		})
		.state("admin.edit", {
			"url":"/edit/:id",
			"views":{
				"mainDash":{
					"controller":"formEditCtrl",
					"templateUrl":"template/form-edit.html"
				}
			}
		});
	$urlRouterProvider.otherwise("/admin/dashboard");
});