import { useRoutes } from 'react-router-dom';
import AuthLayout from '../layouts/auth';
import GuestLayout from '../layouts/guest';
import Login from '../pages/guest/login';
import AllGames from '../pages/auth/games/allGames';
import GamesDetail from '../pages/auth/games/gamesDetail';

export default function Router() {
    return useRoutes([
        {
            element: <GuestLayout />,
            children: [
                { path: '/', element: <Login /> },
            ]
        },
        {
            element: <AuthLayout />,
            children: [
                { path: '/all-games', element: <AllGames /> },
                { path: '/games-detail', element: <GamesDetail /> },
            ]
        }
    ])
}