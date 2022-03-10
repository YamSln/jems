import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameFacade } from 'src/app/game/state/game.facade';
import { CreateGamePayload } from 'src/app/model/create-game.payload';
import { JoinGamePayload } from 'src/app/model/join-game.payload';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent implements OnInit {
  gameForm!: FormGroup;
  create!: boolean;
  formHeading!: string;
  formButtonText!: string;
  sliderValue: number = 4;

  constructor(
    private formBuilder: FormBuilder,
    private gameFacade: GameFacade,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.create = !this.router.url.includes('join');
    this.formHeading = this.create ? 'Create Game' : 'Join Game';
    this.formButtonText = this.create ? 'Create' : 'join';
    this.gameForm = this.formBuilder.group({
      nick: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  submit(): void {
    if (!this.gameForm.valid) {
      return;
    }
    if (this.create) {
      const game: CreateGamePayload = {
        nick: this.gameForm.controls['nick'].value,
        password: this.gameForm.controls['password'].value,
        maxPlayers: this.sliderValue,
      };
      this.gameFacade.createGame(game);
    } else {
      const game: JoinGamePayload = {
        nick: this.gameForm.controls['nick'].value,
        password: this.gameForm.controls['password'].value,
        room: this.router.url,
      };
      this.gameFacade.joinGame(game);
    }
  }
}
