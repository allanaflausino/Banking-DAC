package com.api.cliente.rest;

import br.net.razer.usuario.model.Usuario;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@CrossOrigin
@RestController
public class UsuarioRest {
    public static List<Usuario> lista = new ArrayList<>();
    //aqui vão os métodos
    @GetMapping("/usuarios")
    public List<Usuario> obterTodosUsuarios()
    {
        return lista;
    }
    @GetMapping("/usuarios/{id}")
    public Usuario obterTodosUsuarios(@PathVariable("id") int id)
    {
        Usuario u =  lista.stream().filter(usu -> usu.getId() == id).findAny().orElse(null);
        return u;
    }
    @PostMapping("/usuarios")
    public Usuario inserirUsuario(@RequestBody Usuario usuario)
    {
        Usuario u = lista.stream().max(Comparator.comparing(Usuario::getId)).orElse(null);
        if(u == null)
            usuario.setId(1);
        else
            usuario.setId(u.getId()+1);
        lista.add(usuario);
        return usuario;
    }

    @PutMapping("/usuarios/{id}")
    public Usuario alterarUsuario(@PathVariable("id") int id, @RequestBody Usuario usuario)
    {
        Usuario u = lista.stream().filter(usu -> usu.getId() == id).findAny().orElse(null);
        if( u != null)
        {
            u.setNome(usuario.getNome());
            u.setLogin(usuario.getLogin());
            u.setSenha(usuario.getSenha());
            u.setPerfil(usuario.getPerfil());
        }
        return u;
    }

    @DeleteMapping("/usuarios/{id}")
    public Usuario deletarUsuario(@PathVariable("id") int id)
    {
        Usuario usuario = lista.stream().filter(usu -> usu.getId() == id).findAny().orElse(null);
        if( usuario != null)
            lista.removeIf(u -> u.getId() == id);
        return usuario;
    }

    static
    {
        lista.add(new Usuario(1, "Administr", "admin", "admin", "ADMIN"));
        lista.add(new Usuario(2, "gerent", "gerente", "gerente", "GERENTE"));
        lista.add(new Usuario(3, "funcion", "func", "func", "FUNC"));
    }
}
