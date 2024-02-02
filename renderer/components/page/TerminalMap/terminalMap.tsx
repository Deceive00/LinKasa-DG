import { useEffect, useState } from "react";
import { Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Image from "next/image";
import BPN from './map/BPN.png';
import CGKT3 from './map/CGKT3.png';
import KNO from './map/KNO.png';

const airports = [
  { name: "Sepinggan Airport", map: BPN },
  { name: "Kualanamu International Airport", map: KNO },
  { name: "Soekarno Hatta Terminal 3 International Airport", map: CGKT3 },
];

export default function TerminalMap({ resetState, onResetState }) {
  const [selectedAirport, setSelectedAirport] = useState(airports[0]);

  useEffect(() => {
    if (resetState) {
      onResetState();
    }
  }, [resetState]);

  const handleAirportChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedAirport(airports[selectedIndex]);
  };

  return (
    <div style={{padding:'5vw', overflow:'hidden', height:'100vh'}}>
      <h1 style={{marginTop:''}}>Terminal Maps</h1>
      <FormControl fullWidth>
        <InputLabel id="airport-select-label">Select Airport</InputLabel>
        <Select
          labelId="airport-select-label"
          id="airport-select"
          value={airports.indexOf(selectedAirport)}
          label="Select Airport"
          onChange={handleAirportChange}
        >
          {airports.map((airport, index) => (
            <MenuItem key={index} value={index}>
              {airport.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{ marginTop: "16px" }}>
        <Typography variant="h6">{selectedAirport.name}</Typography>
        {selectedAirport && selectedAirport.map ? (
          <Image
            src={selectedAirport.map}
            alt={`Airport Map ${selectedAirport.name}`}
            width={800} 
            height={600}
          />
        ) : (
          <Typography variant="h6" color="error">
            Invalid airport selection
          </Typography>
        )}
      </div>
    </div>
  );
}
