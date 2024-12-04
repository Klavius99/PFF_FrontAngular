import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
      return "à l'instant";
    }
    if (secondsPast < 3600) {
      return `il y a ${Math.floor(secondsPast / 60)} min`;
    }
    if (secondsPast <= 86400) {
      return `il y a ${Math.floor(secondsPast / 3600)} heures`;
    }
    if (secondsPast <= 2592000) {
      return `${Math.floor(secondsPast / 86400)} jours`;
    }

    return date.toLocaleDateString();
  }
}
