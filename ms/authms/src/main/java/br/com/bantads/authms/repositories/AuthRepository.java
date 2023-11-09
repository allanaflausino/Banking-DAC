package br.com.bantads.authms.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.bantads.authms.models.Auth;

public interface AuthRepository extends JpaRepository<Auth, UUID> {
	
	public Auth findByEmail(String email);
		
	
	
}
