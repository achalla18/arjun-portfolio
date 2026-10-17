import { createContext, useContext } from 'react';

export type DetailTarget = { kind: 'project' | 'experience'; id: string };

interface DetailApi {
  /** Open the shared detail dialog for a project or experience entry. */
  openDetail: (target: DetailTarget) => void;
}

export const DetailContext = createContext<DetailApi>({ openDetail: () => {} });

export const useDetail = () => useContext(DetailContext);
