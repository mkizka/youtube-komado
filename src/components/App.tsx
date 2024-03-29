import { useEffect, useState } from "react";
import "@exampledev/new.css";
import "./App.css";

function useStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    chrome.storage.sync.get(key).then((storage) => {
      if (storage) {
        setStoredValue(storage[key]);
      }
    });
  }, []);

  const setValue = (value: T) => {
    setStoredValue(value);
    chrome.storage.sync.set({ [key]: value });
  };
  return [storedValue, setValue];
}

export function App() {
  const [playerWidth, setPlayerWidth] = useStorage("playerWidth", 480);
  const playerWidthOptions = [320, 400, 480, 560, 640, 720, 800];
  return (
    <>
      <label>{chrome.i18n.getMessage("playerSizeLabel")}</label>
      <select
        value={playerWidth}
        onChange={(e) => setPlayerWidth(parseInt(e.currentTarget.value))}
      >
        {playerWidthOptions.map((playerWidth) => (
          <option key={playerWidth} value={playerWidth}>
            {`${playerWidth}x${(playerWidth * 9) / 16}`}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => chrome.tabs.reload()}>
        {chrome.i18n.getMessage("applySettings")}
      </button>
    </>
  );
}
