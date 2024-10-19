import { useState } from 'react';
import { useCanGoBack, useCanGoForwards, useRestartGame } from '../hooks/store/store-utils';
import { FaChevronLeft, FaChevronRight, FaSave, FaUndo } from 'react-icons/fa';
import { useGameState } from '../hooks/store/state-store';
import { BaseLoadSaveDialog } from './base-load-save-dialog';

export function BaseSidebar() {
  const { title, goBack, goForwards } = useGameState((state) => ({
    title: state.title,
    goBack: state.goBack,
    goForwards: state.goForwards,
  }));
  const canGoBack = useCanGoBack();
  const canGoForwards = useCanGoForwards();
  const restartGame = useRestartGame();
  const [showLoadSaveDialog, setShowLoadSaveDialog] = useState(false);

  return (
    <>
      <div className="p-4 bg-slate-900">
        <h1 className="text-3xl text-center mb-4">{title}</h1>
        <div className="flex justify-between items-stretch gap-2">
          <button className="ww-btn" disabled={!canGoBack} onClick={goBack}>
            <FaChevronLeft size={24} />
          </button>
          <button
            className="ww-btn flex flex-1 items-center justify-center gap-1"
            onClick={() => setShowLoadSaveDialog(true)}
          >
            <FaSave className="mt-0.5" /> Save / Load
          </button>
          <button className="ww-btn" disabled={!canGoForwards} onClick={goForwards}>
            <FaChevronRight size={24} />
          </button>
        </div>
        <button className="ww-btn-outline mt-4" onClick={restartGame}>
          <FaUndo className="mr-2" /> Restart
        </button>
      </div>
      <BaseLoadSaveDialog open={showLoadSaveDialog} close={() => setShowLoadSaveDialog(false)} />
    </>
  );
}
