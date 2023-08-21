package br.com.bantads.authms.rabbitmq;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class AuthConsumer {

	@RabbitListener(queues = "Fila-autenticacao")
    public void receiveMessage(String message) {
        System.out.println("Mensagem recebida: " + message);
        // Lógica para processar a mensagem recebida
    }
}
