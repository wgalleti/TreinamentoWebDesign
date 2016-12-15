<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Todo extends CI_Controller {

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

		$this->load->model('m_todo', 'todo');
	}

	public function index()
	{
		$dados = $this->todo->get();
		echo json_encode($dados->result());
	}

	public function adicionar()
	{
		$dados = $this->input->post();

		if($this->todo->add($dados)){
			echo "Ok";
		} else {
			echo "Erro";
		}
	}

	public function remover($id)
	{
		$dados = $this->input->post();

		if($this->todo->remove($id)){
			echo "Ok";
		} else {
			echo "Erro";
		}
	}

	public function finalizar($id)
	{
		$dados = $this->input->post();

		if($this->todo->done($id, $dados)){
			echo "Ok";
		} else {
			echo "Erro";
		}
	}

}

/* End of file Todo.php */
/* Location: ./application/controllers/Todo.php */