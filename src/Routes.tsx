import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Converter from "./scenes/Converter";
import Rates from "./scenes/Rates";

const AppRoutes: React.FC = () => (
    <BrowserRouter>
        <Routes >
            <Route path="/" element={<Converter />} />
            <Route path="/rates" element={<Rates />} />
        </Routes >
    </BrowserRouter>
)

export default AppRoutes;