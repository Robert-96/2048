'use strict';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import { Interactions } from './game.js';

import './css/style.css';

const interactions = new Interactions();
interactions.setUp();

OfflinePluginRuntime.install();
