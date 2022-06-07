import './App.css';
import TableDubaiAirplanes from './components/TableDubaiAirplanes';
import MapAirplanes from './components/MapAirplanes';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import TableDubaiArrivalAirplanes from './components/TableDubaiArrivalAirplanes';
import TableDubaiDepartureAirplanes from './components/TableDubaiDepartureAirplanes';

function App() {
  return (
    <div className="App">

      <div className="row">
        <div className="col-12">

          <MapAirplanes />
          <Hero />
        </div>
      </div>
      
      <div className="row">
        <div className="col-2"/>
        <div className="col-8">

          <TableDubaiAirplanes />
        </div>
        <div className="col-2"/>
      </div>

      <div className="row">
        <div className="col-2"/>
        <div className="col-8">

          <TableDubaiArrivalAirplanes />
        </div>
        <div className="col-2"/>
      </div>

      <div className="row">
        <div className="col-2"/>
        <div className="col-8">

          <TableDubaiDepartureAirplanes />
        </div>
        <div className="col-2"/>
      </div>

    </div>
  );
}

export default App;
