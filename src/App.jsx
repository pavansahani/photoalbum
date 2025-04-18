import NavBar from './components/NavBar/NavBar'
import AlbumLists from "./components/AlbumLists/AlbumLists";
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <>
      <NavBar/>
      <AlbumLists/>
      <ToastContainer />
    </>
  );
}

export default App;
