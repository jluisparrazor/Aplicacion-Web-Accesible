import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-celebracion',
  templateUrl: './celebracion.component.html',
  styleUrls: ['./celebracion.component.scss'],
  standalone: true,
})
export class CelebracionComponent {
  @Input() tareaCompletada: boolean = false;
  @Input() mostrarConfeti: boolean = false;
}
