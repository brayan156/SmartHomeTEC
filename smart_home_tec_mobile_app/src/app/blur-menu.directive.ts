import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[appBlurMenu]'
})
export class BlurMenuDirective {

  @Input('appBlurMenu') blurLevel;

  constructor(private el: ElementRef, private platform: Platform) {
    const platforms = platform.platforms();
    const applePlatforms = ['ios', 'iphone', 'ipad'];
    const apple = applePlatforms.some(p => platforms.includes(p)) ? true : false;
    el.nativeElement.style.transition = apple ? '0.4s backdrop-filter' : '0.3s backdrop-filter';
  }

  @HostListener('ionWillOpen') ionWillOpen() {
    this.setBackdropFilter(`blur(${this.blurLevel.toString() || '2'}px)`);
  }

  @HostListener('ionWillClose') ionWillClose() {
    this.setBackdropFilter('None');
  }

  setBackdropFilter(value) {
    this.el.nativeElement.style.backdropFilter = value;
  }

}
