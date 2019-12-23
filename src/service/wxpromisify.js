/*
 * File: wxpromisify.js
 * Project: flimi
 * File Created: Wednesday, 5th June 2019 5:15:25 pm
 * Author: break (fengyingdian@126.com)
 */

import { wxPromisify } from './api';

export const getImageInfo = wxPromisify(wx.getImageInfo);

export const chooseImage = wxPromisify(wx.chooseImage);

export const chooseMessageFile = wxPromisify(wx.chooseMessageFile);

export const canvasToTempFilePath = wxPromisify(wx.canvasToTempFilePath);

export const pageScrollTo = wxPromisify(wx.pageScrollTo);

export const login = wxPromisify(wx.login);

export const getSetting = wxPromisify(wx.getSetting);

export const authorize = wxPromisify(wx.authorize);

export const startGyroscope = wxPromisify(wx.startGyroscope);
