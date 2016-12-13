<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class Lib_Email {

	private $mail;

	public function __construct()
	{
        require_once('PHPMailer/class.phpmailer.php');
        require_once('PHPMailer/class.smtp.php');		

        $this->mail = new PHPMailer();
	}	 

	private function _config()
	{
		$this->mail->IsSMTP(); 
		$this->mail->Host = 'smtp.gruposcheffer.com.br'; 
        $this->mail->Port = 587;
		$this->mail->SMTPAuth = true; 
		$this->mail->Username = 'william.galleti@gruposcheffer.com.br'; 
		$this->mail->Password = 'scheffer265';
        $this->mail->SMTPAutoTLS = 0; 
		 

		$this->mail->From = 'william.galleti@gruposcheffer.com.br'; 
		$this->mail->Sender = 'william.galleti@gruposcheffer.com.br'; 
		$this->mail->FromName = 'William Galleti';
		$this->mail->IsHtml();
        $this->mail->CharSet = 'UTF-8';
	}


    public function setPara($para)
    {
        $this->mail->AddAddress($para);
    }

    public function setCcopia($ccopia)
    {
        $this->mail->addCC($ccopia);
    }

    public function setCcopiaoculta($ccopiaoculta)
    {
        $this->mail->addBCC($ccopiaoculta);
    }

    public function setAssunto($assunto)
    {
       $this->mail->Subject = $assunto; 
    }

    public function setConteudo($conteudo)
    {
		$this->mail->Body = $conteudo;	
    }

    public function setAnexo($anexo)
    {
        $this->mail->addAttachment($anexo);
    }

    public function doEnviar()
	{   
		$this->_config();

		$sendReturn = $this->mail->Send();

		$this->mail->ClearAllRecipients();
		$this->mail->ClearAttachments();

		return $sendReturn;
	}    

}
