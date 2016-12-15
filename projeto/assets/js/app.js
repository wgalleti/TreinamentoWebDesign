(function () {
	'use strict'

	var app = angular.module('webTodo', ['ui.router', 'LocalStorageModule', 'ui.bootstrap'])

	app.constant('urlApi', 'http://192.168.25.5:9001/')
	app.config(config)

	app.factory('authServices', authServices)
	app.factory('todoServices', todoServices)

	app.controller('LayoutController', LayoutController)
	app.controller('LoginController', LoginController)
	app.controller('TodoController', TodoController)
	app.controller('TodoAddController', TodoAddController)


	function config($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider) {
		$httpProvider
			.defaults
				.headers
					.post['Content-Type'] = 'application/x-www-form-urlencoded'

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
			ready: false,
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
			},],
			load : load,
			add: add,
			done: done,
			remove: remove,
		}

		return todo

		function load() {
			var def = $q.defer()
			todo.ready = false
			$http
				.get(urlApi + 'todo')
				.then(
					function(rest){
						todo.ready = true
						var data = _PrepareDataGet(rest.data)
						todo.data = angular.copy(data)

						def.resolve(todo)
					},
					function(error){
						def.reject(error)
					}
				)

			return def.promise
		}

		function _PrepareDataGet(dataObject) {

			for(var key in dataObject){
				dataObject[key].done = dataObject[key].done == 1 ? true : false
			}

			return dataObject
		}

		function _PrepareDataSet(dataObject) {

			var _dataObject = {
				id: dataObject.id,
				text: dataObject.text,
				done: dataObject.done == true ? 1 : 0
			}

			return _dataObject
		}

		function done(dataObject) {
			var def = $q.defer()
			dataObject = _PrepareDataSet(dataObject)
			var params = $.param(dataObject)

			$http
				.post(urlApi + 'todo/finalizar/' + dataObject.id, params)
				.then(
					function(){
						def.resolve()
					},
					function(error){
						def.reject(error)
					}
				)

			return def.promise
		}

		function add(dataObject) {
			var def = $q.defer()
			dataObject = _PrepareDataSet(dataObject)
			var params = $.param(dataObject)

			$http
				.post(urlApi + 'todo/adicionar/' + dataObject.id, params)
				.then(
					function(){
						def.resolve()
					},
					function(error){
						def.reject(error)
					}
				)

			return def.promise
		}

		function remove(dataObject) {
			var def = $q.defer()
			dataObject = _PrepareDataSet(dataObject)
			var params = $.param(dataObject)

			$http
				.post(urlApi + 'todo/remover/' + dataObject.id, params)
				.then(
					function(){
						def.resolve()
					},
					function(error){
						def.reject(error)
					}
				)

			return def.promise
		}


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

	function TodoController(todoServices, $uibModal) {
		var vm = this
		var msg = ''
		todoServices.load()
		vm.dataService = todoServices


		vm.add = function(){
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'addModal.html',
				controller: 'TodoAddController',
				controllerAs: 'todo',
			})

			modalInstance
				.result
					.then(
						function () {
							todoServices.load()
							swal({
								title: "Beleza!",
							  	text: 'Tarefa Adicionada!',
							  	type: "success",
							  	showConfirmButton: false,
							  	timer: 1000,
							})		

						}, function (error) {
							if (error) {							
								swal({
									title: "Ops! Alguma coisa deu errado!",
								  	text: error,
								  	type: "warning",
								  	showConfirmButton: false,
								  	timer: 2000,
								})
							}
						}
					)
		}

		vm.remove = function(dataObject) {
			swal({
				title: "PERAEEEE",
				text: "Voce tem certeza que quer remover a tarefa?",
				type: "warning",
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Rebenta ela!",
				cancelButtonText: "Deixa queto!",
				showCancelButton: true,
				closeOnConfirm: false,
				showLoaderOnConfirm: true,
			},
				function(){
					
					todoServices.remove(dataObject)
						.then(
							function(){
								swal({
									title: "Beleza!",
								  	text: "Tarefa rodou!",
								  	type: "success",
								  	showConfirmButton: false,
								  	timer: 1000,
								})	
								todoServices.load()	
							},
							function(error){
								swal({
									title: "Ops! Alguma coisa deu errado!",
								  	text: error,
								  	type: "warning",
								})
							}
						)
			})
		}

		vm.done = function(dataObject) {
			if (dataObject.done) {
				dataObject.done = false
				msg = "Tarefa Reabilitada"
			} else {
				dataObject.done = true
				msg = "Tarefa Finalizada"
			}

			todoServices.done(dataObject)
				.then(
					function(){
						swal({
							title: "Beleza!",
						  	text: msg,
						  	type: "success",
						  	showConfirmButton: false,
						  	timer: 1000,
						})						
					},
					function(error) {
						swal({
							title: "Ops! Alguma coisa deu errado!",
						  	text: error,
						  	type: "warning"
						})
					}
				)
		}
	}

	function TodoAddController($uibModalInstance, todoServices) {
		var vm = this

		vm.ok = function () {

			var newTodo = {
				text: vm.form.text,
				done: 0,
			}

			todoServices.add(newTodo)
				.then(
					function(){
						$uibModalInstance.close()
					},
					function(error){
						$uibModalInstance.dismiss(error)
					}
				)
		}

		vm.cancel = function () {
			$uibModalInstance.dismiss()
		}
	}


})();