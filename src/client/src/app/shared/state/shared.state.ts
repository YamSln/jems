export interface SharedState {
  loading: boolean;
  errorMessage: string;
}

export const sharedInitialState: SharedState = {
  loading: false,
  errorMessage: '',
};
