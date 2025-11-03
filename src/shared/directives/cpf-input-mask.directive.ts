import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[cpfInputMask]',
  standalone: true
})
export class CpfInputMaskDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    const cursorPosition = input.selectionStart || 0;

    let digits = input.value.replace(/\D/g, '').substring(0, 11);

    let formatted = '';
    if (digits.length > 0) formatted = digits.substring(0, Math.min(3, digits.length));
    if (digits.length > 3) formatted += '.' + digits.substring(3, Math.min(6, digits.length));
    if (digits.length > 6) formatted += '.' + digits.substring(6, Math.min(9, digits.length));
    if (digits.length > 9) formatted += '-' + digits.substring(9, 11);

    input.value = formatted;

    let newCursor = cursorPosition;

    if (cursorPosition === 4 || cursorPosition === 8) newCursor++;
    if (cursorPosition === 12) newCursor++;

    input.setSelectionRange(newCursor, newCursor);
  }

  public static unmask(value: string): string {
    return value.replace(/\D/g, '');
  }
}