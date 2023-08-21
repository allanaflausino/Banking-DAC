import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente, Endereco } from 'src/app/shared';

@Component({
  selector: 'app-auto-cadastro',
  templateUrl: './auto-cadastro.component.html',
  styleUrls: ['./auto-cadastro.component.css']
})
export class AutoCadastroComponent implements OnInit {

  cliente: Cliente = new Cliente();
  endereco: Endereco = new Endereco();

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cliente = new Cliente();
  }
  
  form: FormGroup = new FormGroup({
    Nome: new FormControl('', [Validators.required]),
    DataNascimento: new FormControl('', [Validators.required]),
    CPF: new FormControl('', [Validators.required]),
    CEP: new FormControl('', [Validators.required]),
    DDD: new FormControl('', [Validators.required]),
    Celular: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email])
  });

  telaLogin() {
    this.router.navigate(["/login"]);
  }

  
}
