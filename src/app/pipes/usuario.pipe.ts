import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../lib/interfaces';

@Pipe({
  name: 'usuarioProp',
  standalone: true,
})
export class UsuarioPipe implements PipeTransform {
  transform(value: string | Usuario | undefined, prop?: keyof Usuario): any {
    if (!value) return '';

    if (typeof value === 'string') return prop ? '' : value;

    return prop ? value[prop] : value;
  }
}
