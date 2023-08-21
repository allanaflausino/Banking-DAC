package br.com.bantads.authms.models;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_auth")
public class Auth implements Serializable, Comparable<Auth>{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_auth")
	public Integer id;
	@Column(name="email_auth", unique = true)
	private String email;
	@Column(name="senha_auth")
	private String senha;
	@Column(name="cargo_auth")
	private String cargo;
	
	public Auth() { }
	
	public Auth(Integer id, String nome, String email, String senha, String cargo) {
		super();
		this.id = id;
		this.email = email;
		this.senha = senha;
		this.cargo = cargo;
	}

	@Override
	public int compareTo(Auth o) {
		return 0;
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
