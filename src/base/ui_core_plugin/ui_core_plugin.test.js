import UICorePlugin from './ui_core_plugin'

describe('UI Core Plugin', () => {
  describe('#constructor', () => {
    test('enables the plugin', () => {
      const plugin = new UICorePlugin({})

      expect(plugin.enabled).toBeTruthy()
    })

    test('binds all events', () => {
      let bind = false
      const Plugin = class MyPlugin extends UICorePlugin {
        bindEvents() {
          bind = true
  }
    }

      new Plugin({})

      expect(bind).toBeTruthy()
    })
  })

    expect(plugin.core).toEqual(42)
    expect(plugin.enabled).toBeTruthy()
    expect(callCount).toEqual(2)
  })

  test('enables the plugin', () => {
    const plugin = new UICorePlugin({})
    const spy = jest.spyOn(plugin, 'bindEvents')
    const show = jest.fn()
    plugin.$el = { show: show }
    plugin.enabled = false

    plugin.enable()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(show).toHaveBeenCalledTimes(1)
    expect(plugin.enabled).toBeTruthy()
  })

  test('disables the plugin', () => {
    const plugin = new UICorePlugin({})
    const spy = jest.spyOn(plugin, 'stopListening')
    const hide = jest.fn()
    plugin.$el = { hide: hide }

    plugin.disable()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(plugin.enabled).toBeFalsy()
  })

  test('destroys the plugin', () => {
    const plugin = new UICorePlugin({})
    const spy = jest.spyOn(plugin, 'destroy')

    plugin.destroy()

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
