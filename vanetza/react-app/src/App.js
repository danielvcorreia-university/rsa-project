import Map from './components/Map';
import TableCpms from './components/TableCpms';
import TableDenms from './components/TableDenms';
import './App.css';

function App() {
  return (
    <div className="App">

      <div className="row">
        <div className="col-12">
          <Map />
        </div>
      </div>

      <div className="row">
        <div className="col-6">

          <TableCpms />
        </div>
        <div className="col-6">

          <TableDenms />
        </div>
      </div>

    </div>
  );
}

export default App;
