package br.net.razer.autenticacao.rest;

import br.net.razer.autenticacao.model.Login;
import br.net.razer.autenticacao.model.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class AuthREST {

    @PostMapping("/login")
    ResponseEntity<Usuario>login(@RequestBody Login login)
    {
        if(login.getLogin().equals(login.getSenha()))
        {
            Usuario usu = new Usuario(2, login.getLogin(), login.getLogin(), "XXX", "ADMIN");
            return ResponseEntity.ok().body(usu);
        }
        else
        {
            return ResponseEntity.status(401).build();
        }
    }
}
