export interface SharedState {
  loading: boolean;
  errorMessage: string;
  playerAction: string;
  menuOpen: boolean;
  isLightTheme: boolean;
}

export const sharedInitialState: SharedState = {
  loading: false,
  errorMessage: '',
  playerAction: '',
  menuOpen: false,
  isLightTheme: false,
};
