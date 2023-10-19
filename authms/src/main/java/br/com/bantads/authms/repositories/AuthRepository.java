package br.com.bantads.authms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.bantads.authms.models.Auth;
import org.springframework.data.jpa.repository.Query;

public interface AuthRepository extends JpaRepository<Auth, Long> {

	Auth findByEmail(String email); 

	@Query("Select a From Auth a Where a.email=:email and a.senha=:senha")
	Auth findByEmailAndPass(String email, String senha); 
		
	
	
}
