import { Component, signal, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" #container>
      <img src="https://img.icons8.com/bubbles/200/000000/hearts.png" alt="Love" class="valentine-img">
      <h1>Hey Babe, would you be my valentine?</h1>
      <p class="description">
        I know how much you love me, so I'm 100% sure you won't even think of clicking No. 💖
      </p>
      
      <div class="button-group">
        <button class="btn btn-yes" (click)="onYes()">YES</button>
      </div>

      <button 
        #noBtn
        class="btn btn-no" 
        [style.left.px]="noBtnPos().x"
        [style.top.px]="noBtnPos().y"
        (mouseover)="moveNoButton()"
        (touchstart)="moveNoButton()">
        NO
      </button>

      <div class="success-message" *ngIf="showSuccess()" [class.congrats-visible]="showSuccess()">
        <span class="success-title">YAY! Best Day Ever! 💖</span>
        <span class="success-text">I knew you'd say YES! I love you so much! 🌹✨</span>
      </div>
    </div>
  `,
})
export class App implements OnInit {
  protected readonly noBtnPos = signal({ x: 200, y: 250 });
  protected readonly showSuccess = signal(false);

  @ViewChild('noBtn') noBtnElement!: ElementRef;
  @ViewChild('container') containerElement!: ElementRef;

  ngOnInit() {
    // Initial position slightly delayed to ensure DOM is ready
    setTimeout(() => this.resetNoButton(), 200);
  }

  resetNoButton() {
    const yesBtn = document.querySelector('.btn-yes');
    const container = this.containerElement?.nativeElement;
    const noBtn = this.noBtnElement?.nativeElement;

    if (yesBtn && container && noBtn) {
      const yesRect = yesBtn.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();

      // Calculate position relative to container
      const initialX = (yesRect.right - contRect.left) + 20;
      const initialY = (yesRect.top - contRect.top);

      this.noBtnPos.set({ x: initialX, y: initialY });
    }
  }

  moveNoButton() {
    const container = this.containerElement?.nativeElement;
    const noBtn = this.noBtnElement?.nativeElement;

    if (!container || !noBtn) return;

    const contWidth = container.offsetWidth;
    const contHeight = container.offsetHeight;
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const padding = 20;
    const minDistance = 100;

    let newX: number;
    let newY: number;
    let attempts = 0;

    do {
      // Random position inside container
      newX = Math.random() * (contWidth - btnWidth - padding * 2) + padding;
      newY = Math.random() * (contHeight - btnHeight - padding * 2) + padding;

      const dx = newX - this.noBtnPos().x;
      const dy = newY - this.noBtnPos().y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > minDistance || attempts > 20) break;
      attempts++;
    } while (true);

    this.noBtnPos.set({ x: newX, y: newY });
  }

  onYes() {
    this.showSuccess.set(true);
  }
}
