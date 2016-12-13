<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class M_Contatos extends CI_Model {

	public function get($filter = null)
	{
		if($filter){
			$this->db->where($filter);
		}

		return $this->db->get('contatos');
	}

	public function add($data)
	{
		return $this->db->insert('contatos',$data);
	}

	public function remove($id)
	{
		return $this->db->where('id', $id)->delete('contatos');
	}

}

/* End of file M_Contatos.php */
/* Location: ./application/models/M_Contatos.php */