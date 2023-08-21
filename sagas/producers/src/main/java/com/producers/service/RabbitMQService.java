package com.producers.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

//servico porque quero  que o spring gerencie auto e injecao de dependecias 
@Service
public class RabbitMQService {
	
//	autowired permite que o spring resolva e injete a classe bean instanciando o obj
	@Autowired
	private RabbitTemplate rabbitTemplate;
	//rabbit sabe qual servidor e porta conectar	

	@Autowired
	private ObjectMapper objectMapper;
	//rabbit sabe qual servidor e porta conectar	

	
	public void enviaMensagem(String nomeFila, Object mensagem) {
//		metodo envia a mensagem para o rabbitmq (chaveDeRoteamento, mensagem)
		try {
			String mensagemJson = this.objectMapper.writeValueAsString(mensagem);
			this.rabbitTemplate.convertAndSend(nomeFila, mensagemJson);			
		}catch (Exception e) {
			e.printStackTrace();		
		}
		
	}

}
