import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../common/services/animation.service';

@Component({
  selector: 'app-celebracion',
  templateUrl: './celebracion.component.html',
  styleUrls: ['./celebracion.component.scss'],
  standalone: true,
})
export class CelebracionComponent implements OnInit {
  @Input() tareaCompletada: boolean = false;
  @Input() mostrarConfeti: boolean = false;
  mostrarTexto: boolean = false;

  constructor(private router: Router, private animationService: AnimationService) { }

  ngOnInit() {
    this.animationService.setAnimacionCallback(this.activarAnimacion.bind(this));
  }

  activarAnimacion(ruta: string, texto: boolean = true): void {
    this.tareaCompletada = true;
    this.mostrarTexto = texto;

    setTimeout(() => {
      this.mostrarConfeti = true;
    }, 1700);

    setTimeout(() => {
      this.mostrarTexto = false;
      this.tareaCompletada = false;
      this. mostrarConfeti = false
      this.router.navigate([ruta]);
    }, 5000);

  }
}