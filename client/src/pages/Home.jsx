import '../css/Home.css'; 
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div className="shape top-left"></div>
            <div className="shape top-right"></div>
            <div className="shape bottom-left"></div>
            <div className="shape bottom-right"></div>

            <div className="home-top-title">Street Smart</div>

            <div 
                className="home-card">
                <div className="buttons">
                    <button>Guest</button>
                    <button onClick={handleLoginRedirect}>Log In</button>
                </div>
                <div className="tagline">STREET SMART, YOUR GO TO APP</div>
            </div>
        </div>
    );
};

export default Home;
