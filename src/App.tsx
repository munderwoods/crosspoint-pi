import React from 'react';
import './App.css';

function App() {
  const [config, setConfig] = React.useState<Record<string, number> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [requestedInput, setRequestedInput] = React.useState<number | null>(null);
  const [requestedOutputs, setRequestedOutputs] = React.useState<number[]>([]);
  const [savePresetSelected, setSavePresetSelected] = React.useState(false);
  const [recallPresetSelected, setRecallPresetSelected] = React.useState(false);
  const [videoSelected, setVideoSelected] = React.useState(false);
  const [audioSelected, setAudioSelected] = React.useState(false);
  const [results, setResults] = React.useState<string[]>([]);
  const [command, setCommand] = React.useState("");
  React.useEffect(() => {
    setLoading(true);
    getConfig();
  }, []);

  React.useEffect(() => {
    buildCommand()
  }, [
    requestedInput,
    requestedOutputs,
    savePresetSelected,
    recallPresetSelected,
    videoSelected,
    audioSelected
  ]);

  function getConfig() {
    fetch("/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data.data)
        setLoading(false)
      });
  }

  function reset() {
    setVideoSelected(false);
    setAudioSelected(false);
    avReset();
  }

  function avReset() {
    setRequestedInput(null);
    setRequestedOutputs([]);
    setSavePresetSelected(false);
    setRecallPresetSelected(false);
    setCommand("");
  }

  function buildCommand() {
    let operator = '';
    if(videoSelected && audioSelected) {
      operator = '!';
      setCommand(requestedOutputs.map(requestedOutput => `${requestedInput}*${requestedOutput}${operator}`).join(""));
    } else if(videoSelected && !audioSelected) {
      operator = '%';
      setCommand(requestedOutputs.map(requestedOutput => `${requestedInput}*${requestedOutput}${operator}`).join(""));
    } else if(audioSelected && !videoSelected) {
      operator = '$';
      setCommand(requestedOutputs.map(requestedOutput => `${requestedInput}*${requestedOutput}${operator}`).join(""));
    }
    if(savePresetSelected) {
      operator = ',';
      setCommand(`${requestedInput}*${operator}`);
    }
    if(recallPresetSelected) {
      operator = '.';
      setCommand(`${requestedInput}*${operator}`);
    }
  }

  function runCommand() {
    setLoading(true)
    fetch("/command", {
      method: "POST",
      body: JSON.stringify({ command: command}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setResults(json.results);
        getConfig();
        reset();
      });
  }

  function updateInputs(inputAmount: number) {
    setLoading(true)
    fetch("/inputs", {
      method: "PUT",
      body: JSON.stringify({ inputAmount: inputAmount }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then(() => getConfig());
  }

  function updateOutputs(outputAmount: number) {
    setLoading(true)
    fetch("/outputs", {
      method: "PUT",
      body: JSON.stringify({ outputAmount: outputAmount }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then(() => getConfig());
  }

  function createOptions(optionAmount: number) {
    let options = [];
    for(let i = 1; i <= optionAmount; i++){
      options.push(<option key={i} value={i}>{i}</option>)
    }
    return options;
  }

  function generateInputButtons() {
    if(config) {
      let inputButtons = [];
      for(let i = 1; i <= config.inputAmount; i++){
        inputButtons.push(<button disabled={loading} key={i} onClick={() => setRequestedInput(i)} className={`io-button${requestedInput == i ? " selected" : ""}`}>{i}</button>)
      }
      return inputButtons;
    }
  }

  function generateOutputButtons() {
    if(config) {
      let outputButtons = [];
      for(let i = 1; i <= config.outputAmount; i++){
        outputButtons.push(<button disabled={loading || savePresetSelected || recallPresetSelected} key={i} onClick={() => handleOutputSetRequest(i)} className={`io-button${requestedOutputs.includes(i) ? " selected" : ""}`}>{i}</button>)
      }
      return outputButtons;
    }
  }

  function handleOutputSetRequest(outputNumber: number) {
    if(requestedOutputs.includes(outputNumber)) {
      setRequestedOutputs(requestedOutputs.filter(x => x !== outputNumber).sort());
    } else {
      setRequestedOutputs([...requestedOutputs, outputNumber].sort());
    }
  }

  return (
    <div className="App">
      {
        config &&
        <div className="settings">
          <div className="settings-row">
            <h2>Input Amount: </h2><select disabled={loading} onChange={e => updateInputs(parseInt(e.target.value))} value={config.inputAmount}>
              {createOptions(32)}
            </select>
            <h2>Output Amount: </h2><select disabled={loading} onChange={e => updateOutputs(parseInt(e.target.value))} value={config.outputAmount}>
              {createOptions(32)}
            </select>
          </div>
          <div className="settings-row">
            <button disabled={loading} onClick={runCommand} className="enter-button">Enter</button>
            <button disabled={loading} className={`av-button${savePresetSelected ? " selected" : ""}`} onClick={() => {reset(); setSavePresetSelected(!savePresetSelected)}}>Save Preset</button>
            <button disabled={loading} className={`av-button${recallPresetSelected ? " selected" : ""}`} onClick={() => {reset(); setRecallPresetSelected(!recallPresetSelected)}}>Recall Preset</button>
            <button disabled={loading} onClick={reset} className="av-button">Esc</button>//
            <button disabled={loading} className={`av-button${videoSelected ? " selected" : ""}`} onClick={() => { avReset(); setVideoSelected(!videoSelected)}}>Video</button>
            <button disabled={loading} className={`av-button${audioSelected ? " selected" : ""}`} onClick={() => {avReset(); setAudioSelected(!audioSelected)}}>Audio</button>
          </div>
          {requestedInput == null && "Select 1 Input // "}
          {requestedOutputs.length == 0 && "Select at least 1 Output // "}
          Results: {results.join(', ')}
          <h2>Inputs</h2>
          <div className="settings-row">
            {generateInputButtons()}
          </div>
          <h2>Outputs</h2>
          <div className="settings-row">
            {generateOutputButtons()}
          </div>
          <div className="settings-row">
            Command
            <input type="text" disabled={loading} value={command} onChange={e => setCommand(e.target.value)}/>
            <button disabled={loading} onClick={runCommand} className="">Run Command</button>
          </div>
        </div>
      }
    </div>
  );
}
export default App;
