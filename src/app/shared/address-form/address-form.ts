import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Address } from '../../core/models/product.model';
import { INDIA_STATES } from '../../core/utils/india-states';

const MANUAL = '__manual__';

function emptyAddress(): Address {
  return {
    firstName: '', lastName: '', company: '', address1: '', address2: '',
    city: '', zip: '', state: '', country: 'India', phone: '', po: ''
  };
}

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './address-form.html',
  styleUrls: ['./address-form.scss']
})
export class AddressForm {
  saveLabel = input('Save Address');
  showDefaultToggle = input(false);
  save = output<{ address: Address; setDefault: boolean }>();

  readonly indiaStates = INDIA_STATES;
  readonly manualValue = MANUAL;

  form = signal<Address>(emptyAddress());
  stateChoice = signal('');
  manualState = signal('');
  setDefault = signal(false);

  isIndia = computed(() => this.form().country === 'India');
  isManualState = computed(() => this.stateChoice() === MANUAL);

  updateField<K extends keyof Address>(key: K, value: Address[K]) {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  onCountryChange(country: string) {
    this.updateField('country', country);
    this.updateField('state', '');
    this.stateChoice.set('');
    this.manualState.set('');
  }

  onStateChoiceChange(value: string) {
    this.stateChoice.set(value);
    if (value !== MANUAL) this.updateField('state', value);
    else this.updateField('state', this.manualState());
  }

  onManualStateChange(value: string) {
    this.manualState.set(value);
    this.updateField('state', value);
  }

  submit() {
    const value = this.form();
    if (!value.firstName || !value.lastName || !value.address1 || !value.city || !value.zip || !value.state) {
      return;
    }
    this.save.emit({ address: { ...value }, setDefault: this.setDefault() });
    this.form.set(emptyAddress());
    this.stateChoice.set('');
    this.manualState.set('');
    this.setDefault.set(false);
  }
}
