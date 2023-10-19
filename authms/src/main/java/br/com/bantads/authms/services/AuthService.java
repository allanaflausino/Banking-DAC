package br.com.bantads.authms.services;

import br.com.bantads.authms.models.Auth;
import br.com.bantads.authms.repositories.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private AuthRepository authRepository;
    @Autowired
    public AuthService(AuthRepository authRepository){
        this.authRepository = authRepository;
    }
    public Auth login(String email, String senha)
    {
        return authRepository.findByEmailAndPass(email, senha);
    }

}
