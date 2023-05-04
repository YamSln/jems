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
import * as CONSTANTS from '../../../../../util/game.constants';
import { DialogService } from 'src/app/shared/dialog/service/dialog.service';

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
  sliderValue: number = CONSTANTS.MINIMUM_MAX_PLAYERS;
  supportedFileExt: string = CONSTANTS.SUPPORTED_FILE_EXT.join(',');

  wordPacksFormControl!: FormControl;
  wordPacks!: File[];

  constructor(
    private formBuilder: FormBuilder,
    private gameFacade: GameFacade,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {
    this.wordPacksFormControl = new FormControl(this.wordPacks, [
      MaxSizeValidator(
        CONSTANTS.MAX_WORD_PACKS_COUNT * CONSTANTS.MAX_WORD_PACK_SIZE
      ),
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
          Validators.minLength(CONSTANTS.MIN_NICK_LENGTH),
          Validators.maxLength(CONSTANTS.MAX_NICK_LENGTH),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(CONSTANTS.MIN_PASSWORD_LENGTH),
          Validators.maxLength(CONSTANTS.MAX_PASSWORD_LENGTH),
        ],
      ],
      wordPacks: this.wordPacksFormControl,
    });
  }

  submit(): void {
    if (!this.gameForm.valid) {
      return;
    }
    if (
      this.wordPacks &&
      this.wordPacks.length > CONSTANTS.MAX_WORD_PACKS_COUNT
    ) {
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

  onAboutClick(): void {
    this.dialogService.openUploadDialog();
  }
}
