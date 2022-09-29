import React from 'react';
import {Link} from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="row">
                <div className="col-6">
                    <div className="logo">
                        <Link to="/"><strong>Test Price converter</strong></Link>
                    </div>
                </div>
                <nav className="col-6 main-nav">
                    <ul>
                        <li>
                            <Link to="/">Converter</Link>
                        </li>
                        <li>
                            <Link to="/rates">Rates</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;