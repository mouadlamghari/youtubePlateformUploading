import express from 'express'
import { RessourceController } from '../Controllers/Ressource';
const Router = express.Router()

Router.get('/channels',RessourceController.getListChannels);
Router.get('/videos',RessourceController.getVidoes);
Router.get('/actions',RessourceController.getActions);
Router.get('/editors',RessourceController.getEditors);
Router.get('/invitations',RessourceController.getInvitations);

export default Router