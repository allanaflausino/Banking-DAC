package br.com.bantads.authms.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_auth")
public class Auth implements Serializable, Comparable<Auth> {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_auth")
    private Long id;

    @Column(name="email_auth", unique = true)
    private String email;

    @Column(name="senha_auth")
    private String senha;

    @Column(name="cargo_auth")
    private String cargo;

    @Override
    public int compareTo(Auth o) {
        return 0;
    }
}
