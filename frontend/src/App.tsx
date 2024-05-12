import cl from './App.module.scss';
import McRoulette from "./components/Roulette/McRoulette";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'

import PrivateRoute from './utils/PrivateRoute'

function App() {

    const weaponsCount = 150
    const transitionDuration = 10

    return (
        <div className={cl.App}>
            <div className={cl.wrapper}>
            <Router>
            <AuthProvider>
                <Header/>
                <Routes>
                    <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/roulette" element={<McRoulette
                        transitionDuration={transitionDuration}
                    />}/>
                </Routes>
            </AuthProvider>
        </Router>
            </div>
        </div>
    );
}

export default App;