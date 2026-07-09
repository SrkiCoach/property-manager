import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './app-menu.html',
  styleUrl: './app-menu.scss'
})
export class AppMenu {}