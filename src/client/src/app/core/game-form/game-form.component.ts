import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  wordPacksFormControl!: FormControl;
  wordPacks!: File[];

  constructor(
    private formBuilder: FormBuilder,
    private gameFacade: GameFacade,
    private activatedRoute: ActivatedRoute
  ) {
    this.wordPacksFormControl = new FormControl(this.wordPacks, [
      MaxSizeValidator(10 * 1024),
    ]);
  }

  ngOnInit(): void {
    this.create = !this.activatedRoute.snapshot.url.toString().includes('join');
    this.formHeading = this.create ? 'Create Game' : '';
    this.formButtonText = this.create ? 'Create' : 'Join';
    this.wordPacksFormControl.valueChanges.subscribe((wordPacks: any) => {
      if (!Array.isArray(wordPacks)) {
        this.wordPacks = [wordPacks];
      } else {
        this.wordPacks = wordPacks;
      }
    });
    this.gameForm = this.formBuilder.group({
      nick: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      wordPacks: this.wordPacksFormControl,
    });
  }

  submit(): void {
    console.log(this.wordPacks);
    if (!this.gameForm.valid) {
      return;
    }
    if (this.create) {
      const game: CreateGamePayload = {
        nick: this.gameForm.controls['nick'].value,
        password: this.gameForm.controls['password'].value,
        maxPlayers: this.sliderValue,
        wordPacks: this.wordPacks || [],
      };
      this.gameFacade.createGame(game);
    } else {
      const game: JoinGamePayload = {
        nick: this.gameForm.controls['nick'].value,
        password: this.gameForm.controls['password'].value,
        room: this.activatedRoute.snapshot.params['roomId'],
      };
      this.gameFacade.joinGame(game);
    }
  }
}
