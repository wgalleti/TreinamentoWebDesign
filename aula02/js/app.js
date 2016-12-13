var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/home')

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

app.factory('noticias', function(){
	var noticias = {
		dados: [{
			data: new Date(),
			titulo: 'Noticia Fixa',
			texto: 'Aqqui temos o texto da noticia 100%'
		}],
		adicionar: adicionar
	};

	function adicionar(noticia) {
		noticias.dados.push({
			data: new Date,
			titulo: noticia.titulo,
			texto: noticia.texto
		})
	}

	return noticias;
})

app.controller('HomeController', function(){
	var vm = this;
});

app.controller('NoticiasController', function(noticias, $state){
	var vm = this;
	vm.data = noticias

	vm.adicionar = function(){
		var novaNoticia = {
			data: new Date,
			titulo: vm.form.titulo,
			texto: vm.form.texto
		}

		vm.data.adicionar(novaNoticia)
		$state.go('noticias.listar')
	}
});

app.controller('AdministracaoController', function(){
	var vm = this;
});

app.controller('ContatoController', function(){
	var vm = this;
});