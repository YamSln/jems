export interface SharedState {
  loading: boolean;
  errorMessage: string;
  playerAction: string;
}

export const sharedInitialState: SharedState = {
  loading: false,
  errorMessage: '',
  playerAction: '',
};
