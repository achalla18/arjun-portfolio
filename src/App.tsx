import { useCallback, useMemo, useState } from 'react';
import { DetailContext, type DetailTarget } from './components/DetailContext';
import DetailDialog from './components/DetailDialog';
import Hero from './components/Hero';
import MapExplorer from './components/maps/MapExplorer';
import { Built, Footer, Now, PastExperience } from './components/Sections';

export default function App() {
  const [detail, setDetail] = useState<DetailTarget | null>(null);
  const openDetail = useCallback((t: DetailTarget) => setDetail(t), []);
  const api = useMemo(() => ({ openDetail }), [openDetail]);

  return (
    <DetailContext.Provider value={api}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
        <Hero />
        <Now />
        <MapExplorer />
        <PastExperience />
        <Built />
      </main>
      <Footer />
      <DetailDialog target={detail} onClose={() => setDetail(null)} />
    </DetailContext.Provider>
  );
}
