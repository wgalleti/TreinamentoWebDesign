<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Noticias extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		# permite todas as origens
		header("Access-Control-Allow-Origin: *");
		# permite os metodos
		header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
		# permite os cabeçalhos
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, X-Token");
		# verifica se esta recebendo options
		if ($this->input->method(FALSE) == 'options') {
			# encerra chamada
			die;
		}

		$this->load->model('m_noticias', 'noticias');
	}

	public function index()
	{
		$dados = $this->noticias->get();
		echo json_encode($dados->result());
	}

	public function adicionar()
	{
		$dados = $this->input->post();

		if($this->noticias->add($dados)){
			echo "Ok";
		} else {
			echo "Erro";
		}
	}

}

/* End of file noticias.php */
/* Location: ./application/controllers/noticias.php */