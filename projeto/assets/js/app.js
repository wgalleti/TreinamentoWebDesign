(function () {
	'use strict'

	var app = angular.module('webTodo', ['ui.router', 'LocalStorageModule'])

	app.constant('urlApi', 'http://127.0.0.1:9000/')
	app.config(config)

	app.factory('authServices', authServices)
	app.factory('todoServices', todoServices)

	app.controller('LayoutController', LayoutController)
	app.controller('LoginController', LoginController)
	app.controller('TodoController', TodoController)


	function config($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
		
		$urlRouterProvider
			.otherwise('/todo')

		$stateProvider
			.state('login', {
				url: '/auth',
				templateUrl: './partials/login.html',
				controller: 'LoginController',
				controllerAs: 'login'
			})

			.state('todo', {
				url: '/todo',
				templateUrl: './partials/todo.html',
				controller: 'TodoController',
				controllerAs: 'todo',
				resolve : {
					authenticate : authenticate
				}
			})

		localStorageServiceProvider
			.setPrefix('webTodo')
			.setDefaultToCookie(false)
			.setNotify(true, true)

		function authenticate($q, authServices, $state, $timeout) {
			if (authServices.isLogged) {
				return $q.when()
			} else {
				var def = $q.defer()

				authServices.check()
					.then(
						function(){
							def.resolve()
						},
						function(){
							$timeout(function(){
								$state.go('login')
								def.reject()
							})
						}
					)
				return def.promise
			}
		}
	}

	function authServices($q, $http, urlApi, $timeout, localStorageService){
		var auth = {
			isLogged : false,
			infoLogin : {},
			signIn: signIn,
			signOut: signOut,
			check: check
		}

		return auth

		function check() {
			var def = $q.defer()

			var token = localStorageService.get('token')

			$timeout(function(){
				if (token == 123) {
					auth.isLogged = true
					auth.infoLogin = {
						name : 'William Galleti',
						email : 'william.galleti@gmail.com',
						isAdmin : true
					}
					
					def.resolve(auth)
				} else {
					def.reject()
				}
			},100)

			return def.promise
		}

		function signIn(user) {
			var def = $q.defer()
			$timeout(function(){

				if (user.login != 'wGalleti') {
					def.reject('Usuário inválido')
				} else {
					auth.isLogged = true
					auth.infoLogin = {
						name : 'William Galleti',
						email : 'william.galleti@gmail.com',
						isAdmin : true
					}

					localStorageService.set('token', '123')

					def.resolve(auth)
				}


			},100)
			return def.promise
		}

		function signOut() {
			var def = $q.defer()
			$timeout(function(){
				auth.isLogged = false
				auth.infoLogin = {}
				localStorageService.clearAll()
				def.resolve(auth)

			},100)
			return def.promise
		}
	}

	function todoServices($q, $http, urlApi){
		var todo = {
			data : [{
				done: false,
				text: 'Estruturar site',
			},{
				done: false,
				text: 'Estruturar css',
			},{
				done: false,
				text: 'Estruturar js',
			},{
				done: false,
				text: 'Finalizar login',
			},{
				done: false,
				text: 'Finalizar Todo',
			},]
		}

		return todo
	}

	function LayoutController(authServices, $state){
		var vm = this
		vm.auth = authServices

		vm.logout = function(){
			authServices.signOut()
				.then(
					function(){
						$state.go('login')
					},
					function(){
						$state.go('todo')
					}
				)
		}
	}

	function LoginController(authServices, $state){
		var vm = this

		vm.entrar = function(){
			authServices.signIn(vm.form)
				.then(
					function(){
						$state.go('todo')
					},
					function(error){
						swal({
							title: "Erro de Login",
						  	text: error,
						  	type: "warning",
						  	showConfirmButton: false,
						  	timer: 2000,
						})
					}
				)
		}
	}

	function TodoController(todoServices) {
		var vm = this
		vm.dataService = todoServices

		vm.done = function(dataObject, pos) {
			console.log('ok')
			if (dataObject.done) {
				dataObject.done = false
			} else {
				dataObject.done = true
			}
		}
	}



})(); 