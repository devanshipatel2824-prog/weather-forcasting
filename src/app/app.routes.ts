import { Routes } from '@angular/router';
import { UserDashboard } from './user/user-dashboard/user-dashboard';
import { UserHome } from './user/user-home/user-home';
import { UserHeader } from './user/user-header/user-header';
import { UserFooter } from './user/user-footer/user-footer';
import { UserRegistration } from './user/user-registration/user-registration';
import { UserLogin } from './user/user-login/user-login';
import { WeatherSearch } from './user/weather-search/weather-search';
import { WeatherForcast } from './user/weather-forcast/weather-forcast';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { ManageUser } from './admin/manage-user/manage-user';
import { WeatherSuggestions } from './user/weather-suggestions/weather-suggestions';
import { FavoritesCity } from './user/favorites-city/favorites-city';
import { Dashboard } from './weather-station/dashboard/dashboard';
import { ManageWeatherData } from './weather-station/manage-weather-data/manage-weather-data';
import { ManageWeatherStations } from './weather-station/manage-weather-stations/manage-weather-stations';
import { ManageAlert } from './admin/manage-alert/manage-alert';
import { ViewAlert } from './user/view-alert/view-alert';
import { WeatherStation } from './admin/weather-station/weather-station';
import { ManageFavorite } from './weather-station/manage-favorite/manage-favorite';
import { ViewStation } from './user/view-station/view-station';
import { StationDetail } from './user/station-detail/station-detail';
import { StationMap } from './user/station-map/station-map';


export const routes: Routes = [

    //USER ROUTES

    { path: '', redirectTo: 'user/user-home', pathMatch: 'full' },
    { path: 'home', component: UserHome },
    { path: 'user/user-home', component: UserHome },
    { path: 'user/user-dashboard', component: UserDashboard },
    { path: 'user/user-registration', component: UserRegistration },
    { path: 'user/user-login', component: UserLogin },
    { path: 'user/weather-search', component: WeatherSearch },
    { path: 'user/weather-forcast', component: WeatherForcast },
    { path: 'user/weather-suggestions', component: WeatherSuggestions },
    { path: 'user/favorites-city', component: FavoritesCity },
    { path: 'user/view-alert', component: ViewAlert },
    { path: 'user/view-station', component: ViewStation },
    { path: 'user/station-detail/:id', component: StationDetail },
    { path: 'user/station-map', component: StationMap},
    // { path: 'user/show',component:Show},
    

    //ADMIN ROUTE
    { path: 'admin/admin-login', component: AdminLogin },
    { path: 'admin/admin-dashboard', component: AdminDashboard },
    { path: 'admin/manage-user', component: ManageUser },
    { path: 'admin/manage-alert', component: ManageAlert },
    { path: 'admin/weather-station', component: WeatherStation },
    //WEATHER STATION ROUTE
    { path: 'weather-station/dashboard', component: Dashboard },
    { path: 'weather-station/manage-weather-data', component: ManageWeatherData },
    { path: 'weather-station/manage-weather-stations', component: ManageWeatherStations },
    { path: 'weather-station/manage-favorite', component: ManageFavorite }
];
