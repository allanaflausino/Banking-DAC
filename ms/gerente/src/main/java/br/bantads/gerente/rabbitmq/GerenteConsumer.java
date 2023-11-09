package br.bantads.gerente.rabbitmq;

import br.bantads.gerente.dto.GerenteDTO;
import br.bantads.gerente.model.Gerente;
import br.bantads.gerente.repository.GerenteRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class GerenteConsumer {



}
