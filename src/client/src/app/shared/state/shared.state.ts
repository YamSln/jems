export interface SharedState {
  loading: boolean;
  errorMessage: string;
  playerAction: string;
  menuOpen: boolean;
}

export const sharedInitialState: SharedState = {
  loading: false,
  errorMessage: '',
  playerAction: '',
  menuOpen: false,
};
