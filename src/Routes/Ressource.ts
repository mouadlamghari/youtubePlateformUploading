import express from 'express'
import { RessourceController } from '../Controllers/Ressource';
import chechAuth from '../Middleware/CheckAuth';
import { stream } from '../Service/Stream';
const Router = express.Router()

Router.get('/channels',chechAuth,RessourceController.getListChannels);
Router.get('/videos',chechAuth,RessourceController.getVidoes);
Router.get('/actions',chechAuth,RessourceController.getActions);
Router.get('/actions/:id',chechAuth,RessourceController.getAction);
Router.get('/editors',chechAuth,RessourceController.getEditors);
Router.get('/invitations',chechAuth,RessourceController.getInvitations);
Router.get('/search',chechAuth,RessourceController.search);
Router.get('/categories',chechAuth,RessourceController.getCategories);

Router.get('/videos/:url',stream)

export default Router