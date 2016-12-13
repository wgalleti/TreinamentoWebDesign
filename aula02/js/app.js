var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider){

	$urlRouterProvider.otherwise('/home')
	$httpProvider
				.defaults
					.headers
						.post['Content-Type'] = 'application/x-www-form-urlencoded';
	$stateProvider
		.state('home',{
			url: '/home',
			templateUrl: 'home.html',
			controller: 'HomeController',
			controllerAs: 'home'
		})

		.state('noticias',{
			url: '/noticias',
			templateUrl: 'noticias.html',
		})

		.state('noticias.listar', {
			url: '/listar',
			templateUrl: 'noticias/listar.html',
			controller: 'NoticiasController',
			controllerAs: 'noticias',
		})

		.state('noticias.formulario', {
			url: '/formulario',
			templateUrl: 'noticias/formulario.html',
			controller: 'NoticiasController',
			controllerAs: 'noticias',
		})

		.state('administracao',{
			url: '/administracao',
			templateUrl: 'administracao.html',
			controller: 'AdministracaoController',
			controllerAs: 'administracao',
		})

		.state('contato',{
			url: '/contato',
			templateUrl: 'contato.html',
			controller: 'ContatoController',
			controllerAs: 'contato',
		})

});


app.factory('contatos', function($http, $q){
	var contato  = {
		enviar: enviar
	}

	function enviar(contato) {
		var def = $q.defer();

		contato = $.param(contato);

		$http
			.post('http://192.168.25.11:9001/contatos/enviar', contato)
			.then(
				function(rest){
					def.resolve();
				},
				function(error){
					def.reject(error)
				}
			)
		return def.promise
	}
	return contato;
});

app.factory('noticias', function($http, $q, $filter){
	var noticias = {
		dados: [{
			data: new Date(),
			titulo: 'Noticia Fixa',
			texto: 'Aqqui temos o texto da noticia 100%'
		}],
		adicionar: adicionar,
		load: load,
	};

	function load() {
		var def = $q.defer();

		$http
			.get('http://192.168.25.11:9001/noticias')
			.then(
				function(rest){
					noticias.dados = rest.data
					def.resolve(noticias)
				},
				function(error){
					def.reject(error)
				}
			)

		return def.promise;
	}

	function adicionar(noticia) {
		var def = $q.defer();

		noticia.data = $filter('date')(noticia.data, 'yyyy-MM-dd hh:mm:ss');

		noticia = $.param(noticia);

		$http
			.post('http://192.168.25.11:9001/noticias/adicionar', noticia)
			.then(
				function(rest){
					var Ok = rest.data == 'Ok' ? true : false;

					if (Ok) {
						def.resolve();
					} else {
						def.reject(rest.data);
					}

				},
				function(error){
					def.reject(error)
				}
			)
		return def.promise
	}

	return noticias;
})

app.controller('HomeController', function(){
	var vm = this;
});

app.controller('NoticiasController', function(noticias, $state){
	var vm = this;
	noticias.load()

	vm.data = noticias

	vm.adicionar = function(){
		var novaNoticia = {
			data: new Date,
			titulo: vm.form.titulo,
			texto: vm.form.texto
		}

		vm.data.adicionar(novaNoticia).then(
			function(){
				$state.go('noticias.listar')
			}, function(error){
				alert(error);
			}
		)
	}
});

app.controller('AdministracaoController', function(){
	var vm = this;
});

app.controller('ContatoController', function($state, contatos){
	var vm = this;

	vm.sending = false;

	vm.enviar = function(){
		vm.sending = true;
		contatos.enviar(vm.form)
			.then(
				function(){
					alert('Obrigado pelo contato.');
					$state.go('noticias.listar');
				},
				function(error){
					alert(error);
				}
			)
	}

});