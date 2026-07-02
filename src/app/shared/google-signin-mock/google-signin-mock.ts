import { Component, signal, output } from '@angular/core';

@Component({
  selector: 'app-google-signin-mock',
  standalone: true,
  templateUrl: './google-signin-mock.html'
})
export class GoogleSigninMock {
  showModal = signal(false);
  loading = signal(false);

  selected = output<void>();

  open() {
    this.showModal.set(true);
    this.loading.set(false);
  }

  cancel() {
    this.showModal.set(false);
    this.loading.set(false);
  }

  choose() {
    this.loading.set(true);
    setTimeout(() => {
      this.showModal.set(false);
      this.loading.set(false);
      this.selected.emit();
    }, 900);
  }
}
