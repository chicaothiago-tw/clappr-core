import $ from 'clappr-zepto'
import BROWSER_DATA from './browser_data'
import OS_DATA from './os_data'

const Browser = {}

const hasLocalstorage = function() {
  try {
    localStorage.setItem('clappr', 'clappr')
    localStorage.removeItem('clappr')
    return true
  } catch (e) {
    return false
  }
}

const hasFlash = function() {
  try {
    const fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
    return !!fo
  } catch (e) {
    return !!(navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] !== undefined &&
      navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin)
  }
}

/**
 * @typedef getBrowserDataReturnType
 * @type {object}
 * @property {string} name
 * @property {number} version
 */
/**
 * @function getBrowserData
 * @param {string} ua
 * @returns {getBrowserDataReturnType}
 */
export const getBrowserInfo = function(ua) {
  let parts = ua.match(/\b(playstation 4|nx|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [],
    extra
  if (/trident/i.test(parts[1])) {
    extra = /\brv[ :]+(\d+)/g.exec(ua) || []
    return {
      name: 'IE',
      version: parseInt(extra[1] || '')
    }
  } else if (parts[1] === 'Chrome') {
    extra = ua.match(/\bOPR\/(\d+)/)
    if (extra != null) return { name: 'Opera', version: parseInt(extra[1]) }

    extra = ua.match(/\bEdge\/(\d+)/)
    if (extra != null) return { name: 'Edge', version: parseInt(extra[1]) }

  } else if (/android/i.test(ua) && (extra = ua.match(/version\/(\d+)/i))) {
    parts.splice(1, 1, 'Android WebView')
    parts.splice(2, 1, extra[1])
  }
  parts = parts[2] ? [parts[1], parts[2]] : [navigator.appName, navigator.appVersion, '-?']

  return {
    name: parts[0],
    version: parseInt(parts[1])
  }
}

//  Get browser data
export const getBrowserData = function() {
  let browserObject = {}
  let userAgent = Browser.userAgent.toLowerCase()

  // Check browser type
  for (let browser of BROWSER_DATA) {
    let browserRegExp = new RegExp(browser.identifier.toLowerCase())
    let browserRegExpResult = browserRegExp.exec(userAgent)

    if (browserRegExpResult != null && browserRegExpResult[1]) {
      browserObject.name = browser.name
      browserObject.group = browser.group

      // Check version
      if (browser.versionIdentifier) {
        let versionRegExp = new RegExp(browser.versionIdentifier.toLowerCase())
        let versionRegExpResult = versionRegExp.exec(userAgent)

        if (versionRegExpResult != null && versionRegExpResult[1])
          setBrowserVersion(versionRegExpResult[1], browserObject)

      } else {
        setBrowserVersion(browserRegExpResult[1], browserObject)
      }
      break
    }
  }
  return browserObject
}

// Set browser version
const setBrowserVersion = function(version, browserObject) {
  let splitVersion = version.split('.', 2)
  browserObject.fullVersion = version

  // Major version
  if (splitVersion[0]) browserObject.majorVersion = parseInt(splitVersion[0])

  // Minor version
  if (splitVersion[1]) browserObject.minorVersion = parseInt(splitVersion[1])
}

//  Get OS data
export const getOsData = function() {
  let osObject = {}
  let userAgent = Browser.userAgent.toLowerCase()

  // Check browser type
  for (let os of OS_DATA) {
    let osRegExp = new RegExp(os.identifier.toLowerCase())
    let osRegExpResult = osRegExp.exec(userAgent)

    if (osRegExpResult != null) {
      osObject.name = os.name
      osObject.group = os.group

      // Version defined
      if (os.version) {
        setOsVersion(os.version, (os.versionSeparator) ? os.versionSeparator : '.', osObject)

        // Version detected
      } else if (osRegExpResult[1]) {
        setOsVersion(osRegExpResult[1], (os.versionSeparator) ? os.versionSeparator : '.', osObject)

        // Version identifier
      } else if (os.versionIdentifier) {
        let versionRegExp = new RegExp(os.versionIdentifier.toLowerCase())
        let versionRegExpResult = versionRegExp.exec(userAgent)

        if (versionRegExpResult != null && versionRegExpResult[1])
          setOsVersion(versionRegExpResult[1], (os.versionSeparator) ? os.versionSeparator : '.', osObject)

      }
      break
    }
  }
  return osObject
}

// Set OS version
const setOsVersion = function(version, separator, osObject) {
  let finalSeparator = separator.substr(0, 1) == '[' ? new RegExp(separator, 'g') : separator
  const splitVersion = version.split(finalSeparator, 2)

  if (separator != '.') version = version.replace(new RegExp(separator, 'g'), '.')

  osObject.fullVersion = version

  // Major version
  if (splitVersion && splitVersion[0])
    osObject.majorVersion = parseInt(splitVersion[0])

  // Minor version
  if (splitVersion && splitVersion[1])
    osObject.minorVersion = parseInt(splitVersion[1])
}

// Set viewport size
/**
 * @typedef ViewportSizeType
 * @type {object}
 * @property {number} width
 * @property {number} height
 */
/**
 * @function getViewportSize
 * @returns {ViewportSizeType} viewportObject
 */
export const getViewportSize = function() {
  let viewportObject = {}

  viewportObject.width = $(window).width()
  viewportObject.height = $(window).height()

  return viewportObject
}

// Set viewport orientation
const setViewportOrientation = function() {
  switch (window.orientation) {
  case -90:
  case 90:
    Browser.viewport.orientation = 'landscape'
    break
  default:
    Browser.viewport.orientation = 'portrait'
    break
  }
}

/**
 * @function getDevice
 * @param {string} ua
 * @returns {string}
 */
export const getDevice = function(ua) {
  let platformRegExp = /\((iP(?:hone|ad|od))?(?:[^;]*; ){0,2}([^)]+(?=\)))/
  let matches = platformRegExp.exec(ua)
  let device = matches && (matches[1] || matches[2]) || ''
  return device
}

const browserInfo = getBrowserInfo(navigator.userAgent)

Browser.isEdge = /Edg|EdgiOS|EdgA/i.test(navigator.userAgent)
Browser.isChrome = /Chrome|CriOS/i.test(navigator.userAgent) && !Browser.isEdge
Browser.isSafari = /Safari/i.test(navigator.userAgent) && !Browser.isChrome && !Browser.isEdge
Browser.isFirefox = /Firefox/i.test(navigator.userAgent)
Browser.isLegacyIE = !!(window.ActiveXObject)
Browser.isIE = Browser.isLegacyIE || /trident.*rv:1\d/i.test(navigator.userAgent)
Browser.isIE11 = /trident.*rv:11/i.test(navigator.userAgent)
Browser.isChromecast = Browser.isChrome && /CrKey/i.test(navigator.userAgent)
Browser.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Mobile Safari|Opera Mini/i.test(navigator.userAgent)
Browser.isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent)
Browser.isAndroid = /Android/i.test(navigator.userAgent)
Browser.isWindowsPhone = /Windows Phone/i.test(navigator.userAgent)
Browser.isWin8App = /MSAppHost/i.test(navigator.userAgent)
Browser.isWiiU = /WiiU/i.test(navigator.userAgent)
Browser.isPS4 = /PlayStation 4/i.test(navigator.userAgent)
Browser.hasLocalstorage = hasLocalstorage()
Browser.hasFlash = hasFlash()

/**
* @deprecated
* This parameter currently exists for retrocompatibility reasons.
* Use Browser.data.name instead.
*/
Browser.name = browserInfo.name

/**
* @deprecated
* This parameter currently exists for retrocompatibility reasons.
* Use Browser.data.fullVersion instead.
*/
Browser.version = browserInfo.version

Browser.userAgent = navigator.userAgent
Browser.data = getBrowserData()
Browser.os = getOsData()

Browser.isWindows = /^Windows$/i.test(Browser.os.group)
Browser.isMacOS = /^Mac OS$/i.test(Browser.os.group)
Browser.isLinux = /^Linux$/i.test(Browser.os.group)

Browser.viewport = getViewportSize()
Browser.device = getDevice(Browser.userAgent)
typeof window.orientation !== 'undefined' && setViewportOrientation()

export default Browser
