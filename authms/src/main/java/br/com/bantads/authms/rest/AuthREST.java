package br.com.bantads.authms.rest;

import java.util.List;

import br.com.bantads.authms.services.AuthService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.bantads.authms.dto.AuthDTO;
import br.com.bantads.authms.models.Auth;
import br.com.bantads.authms.repositories.AuthRepository;

@CrossOrigin
@RestController
public class AuthREST {

	@Autowired
	private AuthService authService;

	@Autowired
	private ModelMapper mapper;

	//@Autowired
	//private PasswordEncoder passwordEncoder;

	@PostMapping("/login")
	public ResponseEntity<Auth> login(@RequestBody AuthDTO auth) {
		if(!auth.getEmail().isEmpty() && !auth.getSenha().isEmpty())
        {
            return ResponseEntity.ok(authService.login(auth.getEmail(), auth.getSenha()));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	}
	
	@PutMapping("/auth")
    public ResponseEntity<AuthDTO> alterarLogin(@RequestBody AuthDTO auth) {
        throw new UnsupportedOperationException();
    }

    @DeleteMapping("/auth/{id}")
    public ResponseEntity<AuthDTO> removerLogin(@PathVariable("id") int id) {
        throw new UnsupportedOperationException();
    }

    @GetMapping("/auth/{id}")
    public ResponseEntity<AuthDTO> buscarLogin(@PathVariable("id") int id) {
        throw new UnsupportedOperationException();
    }

    @GetMapping("/auth")
    public ResponseEntity<List<AuthDTO>> buscarTodosLogins(@PathVariable("id") int id) {
        throw new UnsupportedOperationException();
    }
	
	

}
