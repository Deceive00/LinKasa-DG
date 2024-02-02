// Weather.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Loading from '../Loading/Loading';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import WavesIcon from '@mui/icons-material/Waves';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';
import { IconButton, InputAdornment, TextField, styled } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px', 
    '&:hover fieldset': {
      borderColor: 'purple', 
    },
    '&.Mui-focused fieldset': {
      borderColor: 'purple', 
    },
  },
});
export default function WeatherCard(){
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('jakarta');
  const [input, setInput] = useState('');

  useEffect(() => {
    const apiKey = '4410fb0ff4f142b15a9ea7639f2a3471';
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }, [city]);

  if (!weatherData) {
    return <Loading/>;
  }
  let icon;

  switch(weatherData.weather[0].main){
    case 'Clouds':
      icon = <CloudIcon fontSize='large'/>;
      break;
    case 'Haze':
      icon = <FilterDramaIcon />;
      break;
    case 'Rain':
      icon = <WaterDropIcon/>
      break;
    case 'Clear':
      icon = <WbSunnyIcon />;
      break;
    case 'Drizzle':
      icon = <WavesIcon />;
      break;
    case 'Snow':
      icon = <AcUnitIcon />;
      break;
    case 'Thunderstorm':
      icon = <FlashOnIcon />;
      break;
    default:
      icon = <CloudIcon />;
  }

  const date = new Date();


  const handleSubmit = (e) => {
    console.log(input)
    if(city !== ''){
      setCity(input);
    }

    e.preventDefault();
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
      setInput('')
    }
  };
  
  return(
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', width:'30vw',maxWidth:'500px', height:'30vh',backgroundColor:'purple',justifyContent:'center',marginBlock:'30vh'
    }}>
      <div style={{display:'flex', width:'100%', maxWidth:'500px',marginBottom:'0.6rem'}}>
        <CustomTextField
          variant="outlined"
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            borderRadius: '20px',
            background: '#f5f5f5',
            width: '100%',
            backdropFilter: 'blur(120px)',
            // backgroundColor: '#ffffff59',
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={handleSubmit}>
                  <SearchOutlinedIcon sx={{color:'purple'}}/>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

      </div>
      <div style={{
        width:'100%',
        backgroundColor:'#3c096c90',
        maxWidth:'500px',
        minHeight:'600px',
        color:'whitesmoke',
        backdropFilter: 'blur(120px)',
        borderRadius: '32px',
        paddingBlock:'2rem',
        paddingInline:'1rem'
      }}>
        <div>
          <div style={{ display:'flex', alignItems:'center'}}>
            <div style={{ fontSize: '3rem', marginRight:'1.4vw',display:'flex',alignItems:'center' }}>
              {React.cloneElement(icon, { style: { fontSize: '5rem' } })}
            </div>
            <div>
              <div style={{fontSize:'2rem'}}>
                {weatherData.name}, {weatherData.sys.country}
              </div>
              <div style={{fontWeight:'500'}}>
                {date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}
              </div>
            </div>
          </div>
          <div style={{marginBlock:'5rem'}}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
              <div style={{fontSize:'7rem',paddingRight:'7px',fontWeight:'700'}}>{parseInt(weatherData.main.temp) - 273}</div>
              <span>°C</span>
            </div>
            <div style={{textAlign: 'center', textTransform: 'capitalize' }}>
              {weatherData.weather[0].description}
            </div>
          </div>
          <div style={{maxWidth:'370px', margin:'auto', display:'flex', flexDirection:'column'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div style={{display:'flex', alignItems:'center'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                  <VisibilityOutlinedIcon sx={{marginRight:'5px', fontSize:'1.2rem'}}/>
                </div>
                <div>
                  Visibility <span style={{marginLeft:'5px'}}>{weatherData.visibility/ 1000} km</span>
                </div>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                  <DeviceThermostatOutlinedIcon sx={{marginRight:'5px', fontSize:'1.2rem'}}/>
                </div>
                <div>
                  Feels like <span style={{marginLeft:'5px'}}>{parseInt(weatherData.main.feels_like) - 273} °C</span>
                </div>
              </div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', paddingBlock:'1rem'}}>
              <div style={{display:'flex', alignItems:'center'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                  <WaterDropOutlinedIcon sx={{marginRight:'5px', fontSize:'1.2rem'}}/>
                </div>
                <div>
                  Humidity <span style={{marginLeft:'5px'}}>{weatherData.main.humidity} %</span>
                </div>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                  <AirOutlinedIcon sx={{marginRight:'5px', fontSize:'1.2rem'}}/>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Wind</span> <span style={{marginLeft:'5px'}}>{parseInt(weatherData.wind.speed)} m/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}