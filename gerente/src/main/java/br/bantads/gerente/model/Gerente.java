package br.bantads.gerente.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_gerentes")
public class Gerente implements Serializable, Comparable<Gerente> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_gerente")
    private Integer id;
    @Column(name="nome_gerente")
    private String nome;
    @Column(name="email_gerente")
    private String email;
    @Column(name="cpf_gerente", unique = true)
    private String cpf;
    @Column(name="telefone_gerente")
    private String telefone;
    @Override
    public int compareTo(Gerente gerente) {
        return getNome().compareTo(gerente.getNome());
    }
}
