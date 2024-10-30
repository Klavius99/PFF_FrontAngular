import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit{
  names = [
    'Ndeye Fatou',
    'Marie Antoinette',
    'Abdoulaye Sow' ,
    'Mbaye Diop' ,
    'Souleymane Ba' ,
  ];
  typingSpeed = 40; // Vitesse de frappe en millisecondes
  pauseBetweenNames = 2000; // Pause entre chaque nom en millisecondes

  constructor() {}

  ngOnInit(): void {
    this.animatePlaceholder();
  }

  animatePlaceholder() {
    const inputElement = document.getElementById('search-input') as HTMLInputElement;
    let currentNameIndex = 0;
    let currentCharIndex = 0;

    const type = () => {
      if (currentCharIndex < this.names[currentNameIndex].length) {
        inputElement.placeholder += this.names[currentNameIndex].charAt(currentCharIndex);
        currentCharIndex++;
        setTimeout(type, this.typingSpeed);
      } else {
        setTimeout(erase, this.pauseBetweenNames);
      }
    };

    const erase = () => {
      if (currentCharIndex > 0) {
        inputElement.placeholder = inputElement.placeholder.slice(0, -1);
        currentCharIndex--;
        setTimeout(erase, this.typingSpeed);
      } else {
        currentNameIndex = (currentNameIndex + 1) % this.names.length;
        setTimeout(type, this.typingSpeed);
      }
    };

    type();
  }
}
