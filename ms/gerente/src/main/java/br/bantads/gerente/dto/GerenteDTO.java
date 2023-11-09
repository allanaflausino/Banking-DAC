package br.bantads.gerente.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GerenteDTO implements Serializable {
    private Integer id;
    private String nome;
    private String email;
    private String telefone;
    private String cpf;

}
