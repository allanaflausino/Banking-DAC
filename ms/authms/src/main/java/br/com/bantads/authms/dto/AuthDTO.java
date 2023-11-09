package br.com.bantads.authms.dto;

public class AuthDTO {

	private Integer id;
	
	private String email;
	
	private String senha;
	
	private String cargo;
	
	public AuthDTO() { }

	public AuthDTO(Integer id, String email, String senha, String cargo) {
		this.id = id;
		this.email = email;
		this.senha = senha;
		this.cargo = cargo;
	}
	
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getCargo() {
		return cargo;
	}

	public void setCargo(String cargo) {
		this.cargo = cargo;
	}

}
