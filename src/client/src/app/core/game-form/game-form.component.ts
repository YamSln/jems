import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameFacade } from 'src/app/game/state/game.facade';
import { CreateGamePayload } from 'src/app/model/create-game.payload';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent implements OnInit {
  gameForm!: FormGroup;
  formHeading: string = 'Create Game';
  formButtonText: string = 'Create';
  sliderValue: number = 4;

  constructor(
    private formBuilder: FormBuilder,
    private gameFacade: GameFacade
  ) {}

  ngOnInit(): void {
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
    const game: CreateGamePayload = {
      nick: this.gameForm.controls['nick'].value,
      password: this.gameForm.controls['password'].value,
      maxPlayers: this.sliderValue,
    };
    this.gameFacade.createGame(game);
  }
}
