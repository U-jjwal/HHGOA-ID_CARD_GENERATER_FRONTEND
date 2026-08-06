import { Route, Routes } from 'react-router-dom';
import { GeneratorPage } from '@/pages/GeneratorPage';
import { CardViewPage } from '@/pages/CardViewPage';

export function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<GeneratorPage />} />
      <Route path="/card/:cardId" element={<CardViewPage />} />
      <Route path="*" element={<GeneratorPage />} />
    </Routes>
  );
}
