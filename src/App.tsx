import React from 'react';
import './App.css';
import MuiGrid from '@mui/material/Grid';
import MuiButton from '@mui/material/Button';
import MuiSelect, {SelectChangeEvent} from '@mui/material/Select';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiTextField from '@mui/material/TextField';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { SketchPicker } from 'react-color';


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
  const [primaryColor, setPrimaryColor] = React.useState("#333");
  const [secondaryColor, setSecondaryColor] = React.useState("#aaa");
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
    audioSelected,
    buildCommand
  ]);

  const theme = createTheme({
    palette: {
      primary: {main: primaryColor},
      secondary: {main: secondaryColor},
    },
  });

  const ToggleButton = styled(MuiToggleButton)({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.primary.main,
    "&.Mui-selected, &.Mui-selected:hover": {
      color: theme.palette.primary.dark,
      backgroundColor: theme.palette.secondary.dark,
      borderColor: theme.palette.primary.dark,
    }
  });

  const Select = styled(MuiSelect)({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.primary.main,
    "&.Mui-selected, &.Mui-selected:hover": {
      color: theme.palette.primary.dark,
      backgroundColor: theme.palette.secondary.dark,
      borderColor: theme.palette.primary.dark,
    },
    '&:before': {
        borderColor: theme.palette.primary.main,
    },
    '&:after': {
        borderColor: theme.palette.primary.main,
    },
    '&:not(.Mui-disabled):hover::before': {
        borderColor: theme.palette.primary.main,
    },
    icon: {
        fill: theme.palette.primary.main,
    },
    root: {
      color: theme.palette.primary.main,
    }
  });

  const MenuItem = styled(MuiMenuItem)({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.primary.main,
    "&.Mui-selected, &.Mui-selected:hover": {
      color: theme.palette.primary.dark,
      backgroundColor: theme.palette.secondary.dark,
      borderColor: theme.palette.primary.dark,
    }
  });

  const TextField = styled(MuiTextField)({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.primary.main,
    "&.Mui-selected, &.Mui-selected:hover": {
      color: theme.palette.primary.dark,
      backgroundColor: theme.palette.secondary.dark,
      borderColor: theme.palette.primary.dark,
    }
  });

  const Button = styled(MuiButton)({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.primary.main,
    "&.Mui-selected, &.Mui-selected:hover": {
      color: theme.palette.primary.dark,
      backgroundColor: theme.palette.secondary.dark,
      borderColor: theme.palette.primary.dark,
    }
  });

  const Grid = styled(MuiGrid)({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    fontWeight: 900,
    fontSize: "24px"
  });

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
      setCommand(
        requestedOutputs.map(
          requestedOutput => `${requestedInput}*${requestedOutput}${operator}`
        ).join("")
      );
    } else if(videoSelected && !audioSelected) {
      operator = '%';
      setCommand(
        requestedOutputs.map(
          requestedOutput => `${requestedInput}*${requestedOutput}${operator}`
        ).join("")
      );
    } else if(audioSelected && !videoSelected) {
      operator = '$';
      setCommand(
        requestedOutputs.map(
          requestedOutput => `${requestedInput}*${requestedOutput}${operator}`
        ).join("")
      );
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

  function updateInputs(e: SelectChangeEvent<unknown>) {
    const inputAmount = e.target.value as number;
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

  function updateOutputs(e: SelectChangeEvent<unknown>) {
    const outputAmount = e.target.value as number;
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
      options.push(<MenuItem value={i}>{i}</MenuItem>)
    }
    return options;
  }

  function generateInputButtons() {
    if(config) {
      let inputButtons = [];
      for(let i = 1; i <= config.inputAmount; i++){
        inputButtons.push(
          <ToggleButton
            value={i}
            disabled={loading}
            key={i}
            onClick={() => setRequestedInput(i)}
            selected={requestedInput === i}
            style={{height:"5%",width:"5%"}}
            sx={{m:1}}
          >
            {i}
          </ToggleButton>
        )
      }
      return inputButtons;
    }
  }

  function generateOutputButtons() {
    if(config) {
      let outputButtons = [];
      for(let i = 1; i <= config.outputAmount; i++){
        outputButtons.push(
          <ToggleButton
            value={i}
            disabled={loading || savePresetSelected || recallPresetSelected}
            key={i}
            onClick={() => handleOutputSetRequest(i)}
            selected={requestedOutputs.includes(i)}
            style={{height:"5%",width:"5%"}}
            sx={{m:1}}
          >
            {i}
          </ToggleButton>
        )
      }
      return outputButtons;
    }
  }

  function handleOutputSetRequest(outputNumber: number) {
    console.log(outputNumber)
    if(requestedOutputs.includes(outputNumber)) {
      setRequestedOutputs(requestedOutputs.filter(x => x !== outputNumber).sort());
    } else {
      setRequestedOutputs([...requestedOutputs, outputNumber].sort());
    }
  }

  return (
    config &&
    <ThemeProvider theme={theme}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        item
        spacing={1}
        style={{ minHeight: '100vh',minWidth: '100vw'}}
      >

        <Grid item justifyContent="center" alignItems="center" style={{display:"flex"}}>
          Input Amount:
          <Select
            disabled={loading}
            onChange={updateInputs}
            value={config.inputAmount}
          >
            {createOptions(32)}
          </Select>
          Output Amount:
          <Select
            disabled={loading}
            onChange={updateOutputs}
            value={config.outputAmount}
          >
            {createOptions(32)}
          </Select>
        </Grid>

        <Grid item justifyContent="center" alignItems="center" style={{display:"flex"}}>
          <Button
            disabled={loading}
            variant="contained"
            onClick={runCommand}
          >
            Enter
          </Button>
          <Button
            disabled={loading}
            variant="contained"
            onClick={reset}
            className="av-button"
          >
            Esc
          </Button>
          {"//"}
          <ToggleButtonGroup>
            <ToggleButton
              value={true}
              disabled={loading}
              selected={savePresetSelected}
              onClick={() => {reset(); setSavePresetSelected(!savePresetSelected)}}
            >
              Save Preset
            </ToggleButton>
            <ToggleButton
              value={true}
              disabled={loading}
              selected={recallPresetSelected}
              onClick={() => {reset(); setRecallPresetSelected(!recallPresetSelected)}}
            >
              Recall Preset
            </ToggleButton>
          </ToggleButtonGroup>
          {"//"}
          <ToggleButtonGroup>
            <ToggleButton
              value={true}
              disabled={loading}
              selected={videoSelected}
              onClick={() => { avReset(); setVideoSelected(!videoSelected)}}
            >
              Video
            </ToggleButton>
            <ToggleButton
              value={true}
              disabled={loading}
              selected={audioSelected}
              onClick={() => {avReset(); setAudioSelected(!audioSelected)}}
            >
              Audio
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {requestedInput == null && "Select 1 Input // "}
        {
          requestedOutputs.length === 0
            && !savePresetSelected
            && !recallPresetSelected
            && "Select at least 1 Output // "
        }
        Results: {results.join(', ')}
        <h2>Inputs</h2>

        <Grid item textAlign="center" style={{width:"100%"}}>
          {generateInputButtons()}
        </Grid>

        <h2>Outputs</h2>

        <Grid item textAlign="center" style={{width:"100%"}}>
          {generateOutputButtons()}
        </Grid>

        <Grid item justifyContent="center" alignItems="center" style={{display:"flex",color: theme.palette.primary.main}}>
          Command
          <TextField
            type="text"
            disabled={loading}
            value={command}
            onChange={e => setCommand(e.target.value)}
          />
          <Button
            disabled={loading}
            variant="contained"
            onClick={runCommand}
            className=""
          >
            Run Command
          </Button>
        </Grid>

        <Grid item justifyContent="center" alignItems="center" style={{display:"flex",color: theme.palette.primary.main}}>
        Primary Color:
          <SketchPicker
            color={primaryColor}
            onChangeComplete={(color, e) => setPrimaryColor(color.hex)}
          />
          Secondary Color:
          <SketchPicker
            color={secondaryColor}
            onChangeComplete={(color, e) => setSecondaryColor(color.hex)}
          />
        </Grid>

      </Grid>
    </ThemeProvider>
  )
}
export default App;
