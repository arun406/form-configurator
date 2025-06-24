import { Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { ClientDetailComponent } from './clients/client-detail/client-detail.component';
import { FormConfigurationComponent } from './form-configuration/form-configuration.component';
import { AddFormConfigurationComponent } from './form-configuration/add-form-configuration/add-form-configuration.component';
import { FormConfigurationDetailComponent } from './form-configuration/form-configuration-detail/form-configuration-detail.component';
import { UserComponent } from './user/user';
import { AddClientComponent } from './clients/add-client/add-client.component';

export const routes: Routes = [
    { path: 'clients', component: ClientsComponent },
    { path: 'clients/add', component: AddClientComponent },
    { path: 'clients/:id', component: ClientDetailComponent },
    { path: 'form-configuration', component: FormConfigurationComponent },
    { path: 'form-configuration/add', component: AddFormConfigurationComponent },
    { path: 'form-configuration/:id', component: FormConfigurationDetailComponent },
    { path: 'user', component: UserComponent },
    { path: '', redirectTo: 'clients', pathMatch: 'full' }
];
