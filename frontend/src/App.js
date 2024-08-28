import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Corrected import statement
import Home from './Pages/Home'; // Ensure you have imported Home component
import Register from './Authentication/Register';
import Login from './Authentication/Login';
import Logout from './Authentication/Logout';
import AdminHome from './Pages/AdminHome';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
        <Route path='/adminhome' element={<AdminHome />}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
