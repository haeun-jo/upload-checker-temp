import { create } from 'zustand'

interface State  {
  token: string
}

interface Actions  {
  setToken: (payload: string) => void
}

const initialState:State = {
  token:""
}

export const useAuthStore = create<State & Actions>((set) => ({
  ...initialState,
  setToken: (payload: string) => set((state) => ({ token: state.token = payload })),
}))