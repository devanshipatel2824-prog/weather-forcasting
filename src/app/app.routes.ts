import { Routes } from '@angular/router';
import { UserDashboard } from './user/user-dashboard/user-dashboard';
import { UserHome } from './user/user-home/user-home';
import { UserHeader } from './user/user-header/user-header';
import { UserFooter } from './user/user-footer/user-footer';
import { UserRegistration } from './user/user-registration/user-registration';
import { UserLogin } from './user/user-login/user-login';
import { WeatherSearch } from './user/weather-search/weather-search';
import { WeatherForcast } from './user/weather-forcast/weather-forcast';

export const routes: Routes = [

    //USER ROUTES

    { path: '', redirectTo: 'user/user-home', pathMatch: 'full' },
    { path: 'home', component: UserHome },
    { path: 'user/user-home', component: UserHome },
    { path: 'user/user-dashboard', component: UserDashboard },
    { path: 'user/user-registration', component: UserRegistration },
    {path:'user/user-login',component:UserLogin},
    {path:'user/weather-search',component:WeatherSearch},
    {path:'user/weather-forcast',component:WeatherForcast}
];
