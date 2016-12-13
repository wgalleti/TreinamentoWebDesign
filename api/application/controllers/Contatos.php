<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Contatos extends CI_Controller {

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

		$this->load->model('m_contatos', 'contatos');
		$this->load->library('lib_email');
	}

	public function enviar()
	{
		$dados = $this->input->post();

		if($this->contatos->add($dados)){
			echo "Ok";
			$this->lib_email->setPara('william.galleti@gmail.com');
			$this->lib_email->setCcopia('renan_felipe@outlook.com');
			$this->lib_email->setAssunto('Site - ' . $dados['assunto']);
			$mensagem = "Mensagem de {$dados['nome']}\n Email: {$dados['email']}\n 
			Telefone: {$dados['telefone']}\n
			Mensagem: {$dados['mensagem']}";
			$this->lib_email->setConteudo($mensagem);

			$envio = $this->lib_email->doEnviar();
			
			echo $envio;

		} else {
			echo "Erro";
		}

	}

}


/*
# Envia o email para os usuários
				$qry_ati = $this->model_atividade->doGet(1)->row();
				
				$this->lib_email->setPara($qry_ati->ati_dep_destino_email);

				if ($qry_ati->ati_dep_solicitante_recebe_email) 
				{
					$this->lib_email->setCCopia($qry_ati->ati_dep_solicitante_email);
				}
				else
				{
					$this->lib_email->setCCopia($qry_ati->ati_solicitante_email);		
				}

				$url = base_url('atividades/atividades?do=ati_codigo%20=%20' . $qry_ati->ati_codigo);
				$this->lib_email->setAssunto('Inclusão de Atividade | ' . $qry_ati->ati_titulo);
				//$this->lib_email->setConteudo("Foi incluso uma nova atividade pelo(a) {$qry_ati->ati_solicitante_nome}. O Código da atividade é {$retorno}. Para interagir nessa atividade {$url}");
				$this->lib_email->setConteudo($this->mount_body_mail($qry_ati->ati_codigo));

				# -- Envia o email
				$this->lib_email->doEnviar();	

/* End of file Contatos.php */
/* Location: ./application/controllers/Contatos.php */