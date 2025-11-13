import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  emailCtrl = new FormControl ('', [Validators.required]);

  constructor() {
    this.emailCtrl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      console.log(value);
  });
}
  getEmail(event: Event) {
   event.preventDefault();
   console.log(this.emailCtrl.value);
  }   

}
