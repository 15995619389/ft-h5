(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('StorageService', [], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory()
    } else {
        root.StorageService = factory()
    }
}(this, function () {
    var $storage
    var $supported = CheckSupport()
    var cookie = {
        expiry: 30,
        path: '/',
        domain: ''
    }
    var prefix = {
        important: 'i',
        notImportant: 'n'
    }

    function CheckSupport() {
        try {
            var supported = ('localStorage' in window && window['localStorage'] != null)

            if (supported) {
                $storage = window['localStorage']
                $storage.setItem('TestSupported', 'AreYouOK?')
                $storage.removeItem('TestSupported')
            }

            return supported
        } catch (e) {
            return false
        }
    }

    function SetToCookie(key, value) {
        if (prefix.important != key.split('_')[0]) {
            return false
        }

        if (value === undefined) {
            return false
        }
        try {
            var expiry = ''
            var expiryDate = new Date()
            var cookieDomain = ''

            if (value === null) {
                expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000))
                expiry = '; expires=' + expiryDate.toGMTString()
                value = ''
            } else {
                expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000))
                expiry = '; expires=' + expiryDate.toGMTString()
            }

            if (key) {
                var cookiePath = ';path=' + cookie.path
                cookieDomain = ''
                if (cookie.domain) {
                    cookieDomain = ';domain=' + cookie.domain
                }
                document.cookie = key + '=' + encodeURIComponent(value) + expiry + cookiePath + cookieDomain
            }
        } catch (e) {
            return false
        }
        return true
    }

    function GetFromCookie(key) {
        var cookies = document.cookie.split(';') || []
        for (var i = 0; i < cookies.length; i++) {
            var thisCookie = cookies[i]
            while (thisCookie.charAt(0) === ' ') {
                thisCookie = thisCookie.substring(1, thisCookie.length)
            }
            if (thisCookie.indexOf(key + '=') === 0) {
                var storedValue = decodeURIComponent(thisCookie.substring(key.length + 1, thisCookie.length))
                return storedValue
            }
        }

        return null
    }

    function Set(key, value) {
        if (value === undefined) {
            value = null
        } else {
            value = JSON.stringify(value)
        }

        if (!$supported || !$storage) {
            return SetToCookie(key, value)
        }
        try {
            $storage.setItem(key, value)
        } catch (e) {
            return SetToCookie(key, value)
        }
        return true
    }

    function Get(key) {
        var item = null

        if (!$supported || !$storage) {
            item = GetFromCookie(key)
        } else {
            item = $storage.getItem(key)
        }

        if (!item || item === 'null') {
            return null
        }

        try {
            return JSON.parse(item)
        } catch (e) {
            return item
        }
    }

    function Remove(key) {
        if (!$supported || !$storage) {
            return RemoveFromCookie(key)
        }
        try {
            $storage.removeItem(key)
        } catch (e) {
            return false
        }
        return true
    }

    function RemoveFromCookie(key) {
        SetToCookie(key, null)
    }

    return { Get: Get, Set: Set, Remove: Remove }
}))
