import { useLoadGame, useRemoveSavedGame, useSaveGame, useSaveList } from '../hooks/store/store-utils';
import { useState } from 'react';
import { FaSave, FaTrash, FaFolder, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

interface BaseLoadSaveDialogProps {
  open: boolean;
  close: () => void;
}

export function BaseLoadSaveDialog({ open, close }: BaseLoadSaveDialogProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSaveName, setNewSaveName] = useState('');
  const saveList: string[] = useSaveList();
  const doSaveGame = useSaveGame();
  const doLoadGame = useLoadGame();
  const doRemoveSavedGame = useRemoveSavedGame();

  const handleSave = (name: string = '') => {
    const saveName = name || newSaveName || new Date().toLocaleString();
    doSaveGame(saveName);
    setNewSaveName('');
    setIsCreatingNew(false);
    close();
  };

  const handleLoad = (name: string) => {
    doLoadGame(name);
    setIsCreatingNew(false);
    close();
  };

  const handleClose = () => {
    setIsCreatingNew(false);
    close();
  };

  const handleDelete = (name: string) => {
    doRemoveSavedGame(name);
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setNewSaveName(new Date().toLocaleString());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-96">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl flex-1 font-bold text-slate-100">Save / Load Game</h2>
          <button onClick={handleClose} className="hover:bg-slate-700 text-white font-bold p-2 rounded">
            <FaTimes size={24} />
          </button>
        </div>

        {isCreatingNew ? (
          <div className="mb-4">
            <input
              type="text"
              value={newSaveName}
              onChange={(e) => setNewSaveName(e.target.value)}
              className="w-full p-2 bg-slate-700 text-slate-100 rounded mb-4"
            />
            <div className="flex gap-4 justify-between">
              <button onClick={() => setIsCreatingNew(false)} className="ww-btn-outline">
                <FaTimes className="text-red-500 mr-2" /> Cancel
              </button>
              <button onClick={() => handleSave()} className="ww-btn-outline">
                <FaCheck className="text-green-500 mr-2" /> Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 max-h-60 overflow-y-auto">
              {saveList.map((save) => (
                <div
                  key={save}
                  className="flex items-center justify-between px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 mb-2"
                >
                  <span className="text-slate-100 flex-grow">{save}</span>
                  <div className="flex gap-1 space-x-2">
                    <button onClick={() => handleLoad(save)} className="text-sky-500 hover:text-sky-300" title="Load">
                      <FaFolder size={20} />
                    </button>
                    <button
                      onClick={() => handleSave(save)}
                      className="text-sky-500 hover:text-sky-300"
                      title="Save (Override)"
                    >
                      <FaSave size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(save)}
                      className="text-red-500 hover:text-red-300"
                      title="Remove"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleCreateNew}
              className="w-full border border-slate-500 hover:border-slate-300 text-slate-400 hover:text-slate-200 font-bold py-1 px-2 rounded flex items-center justify-center"
            >
              <FaEdit className="mr-2" /> Create New Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}
