import create from 'zustand';

interface Container {
  name?: string;
  ip?: string;
  active?: string;
}

interface StoreState {
  containers: Container[];
  addContainer: (container: Container) => void;
}

export const useStore = create<StoreState>((set) => ({
  containers: [],
  addContainer: (container: Container) =>
    set((state) => ({ containers: [...state.containers, container] })),
}));
