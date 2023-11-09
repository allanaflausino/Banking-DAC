package br.bantads.gerente.rest;

import br.bantads.gerente.dto.GerenteDTO;
import br.bantads.gerente.model.Gerente;
import br.bantads.gerente.repository.GerenteRepository;
import org.modelmapper.ModelMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
public class GerenteREST {

    @Autowired
    private GerenteRepository gerenteRepository;
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/gerente")
    public ResponseEntity<List<GerenteDTO>> listarTodos() {
        List<Gerente> lista = gerenteRepository.findAll();
        Collections.sort(lista);
        return ResponseEntity.ok().body(lista.stream().map(g -> mapper.map(g, GerenteDTO.class)).collect(Collectors.toList()));
    }

    @GetMapping("/gerente/{id}")
    public ResponseEntity<GerenteDTO> buscarGerente(@PathVariable("id") int id) {
        Gerente gerente = gerenteRepository.findById(id);
        if (gerente != null) {
            return ResponseEntity.status(200).body(mapper.map(gerente, GerenteDTO.class));
        }
        return ResponseEntity.status(404).build();
    }

    @PostMapping("/gerente")
    public ResponseEntity<GerenteDTO> inserirGerente(@RequestBody GerenteDTO gerente) {
        if (gerenteRepository.findByCpf(gerente.getCpf()) == null) {
            gerenteRepository.save(mapper.map(gerente, Gerente.class));
            Gerente ger = gerenteRepository.findByCpf(gerente.getCpf());
            return ResponseEntity.status(201).body(mapper.map(ger, GerenteDTO.class));
        } else {
            return ResponseEntity.status(400).build();
        }
    }

    @PutMapping("/gerente")
    public ResponseEntity<GerenteDTO> alterarGerente(@RequestBody GerenteDTO gerente) {
        Gerente ger = gerenteRepository.findById(gerente.getId());
        if (ger != null) {
            ger.setNome(gerente.getNome());
            ger.setEmail(gerente.getEmail());
            ger.setTelefone(gerente.getTelefone());
            gerenteRepository.save(ger);
            return ResponseEntity.status(200).body(mapper.map(ger, GerenteDTO.class));
        }
        return ResponseEntity.status(404).build();
    }

    @DeleteMapping("/gerente/{id}")
    public ResponseEntity<GerenteDTO> removerGerente(@PathVariable("id") int id) {
        List<Gerente> lista = gerenteRepository.findAll();
        Gerente gerente = lista.stream().filter(g -> g.getId() == id).findAny().orElse(null);
        if (gerente != null) {
            gerenteRepository.delete(gerente);
            return ResponseEntity.status(204).build();
        } else {
            return ResponseEntity.status(404).build();
        }
    }



}
