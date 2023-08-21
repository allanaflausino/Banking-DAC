package br.bantads.gerente.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import br.bantads.gerente.model.Gerente;

public interface GerenteRepository extends JpaRepository<Gerente, UUID> {
    public Gerente findByCpf(String cpf);
    public Gerente findById(Integer id);
    public boolean existsByCpf(String cpf);
}
