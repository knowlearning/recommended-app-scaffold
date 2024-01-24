import Agent from '@knowlearning/agents/browser.js'
import { v4 as uuid, validate as isUUID } from 'uuid'

import renderLoginPage from './renderers/login-page.js'
import renderContentPlayer from './renderers/content-player.js'
import renderContentManager from './renderers/content-manager.js'

import './style.css'

window.Agent = Agent

const { auth: { user, provider } } = await Agent.environment()

const { host, pathname } = new URL(window.location.href)
const potentialUUID = pathname.slice(1)

if (provider === 'anonymous') renderLoginPage()
else if (isUUID(potentialUUID)) renderContentPlayer(potentialUUID)
else renderContentManager()
