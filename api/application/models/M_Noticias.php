<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class M_Noticias extends CI_Model {

	public function get($filter = null)
	{
		if($filter){
			$this->db->where($filter);
		}

		return $this->db->get('noticias');
	}

	public function add($data)
	{
		return $this->db->insert('noticias',$data);
	}

	public function remove($id)
	{
		return $this->db->where('id', $id)->delete('noticias');
	}

}

/* End of file noticias.php */
/* Location: ./application/models/noticias.php */