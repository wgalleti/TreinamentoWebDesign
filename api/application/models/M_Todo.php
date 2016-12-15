<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class M_Todo extends CI_Model {

	protected $table = 'todo';

	public function __construct()
	{
		parent::__construct();
	}

	public function get($filter = null)
	{
		if($filter){
			$this->db->where($filter);
		}

		return $this->db->get($this->table);
	}

	public function add($data)
	{
		return $this->db->insert($this->table,$data);
	}

	public function remove($id)
	{
		return $this->db->where('id', $id)->delete($this->table);
	}

	public function done($id, $data)
	{
		return $this->db->where('id', $id)->update($this->table, $data);
	}

}

/* End of file M_Todo.php */
/* Location: ./application/models/M_Todo.php */