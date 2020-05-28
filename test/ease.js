const Penner = require('penner')
const assert = require('chai').assert

require('./node-shim')
const Ease = require('../dist/ease.js')

const CLOSE_TO = 0.0000001

describe('pixi-ease', () =>
{
    it('contructor with default options', () =>
    {
        const ease = new Ease.Ease()
        assert.equal(ease.options.duration, 1000)
        assert.isFunction(ease.options.ease)
        assert.equal(ease.options.useRAF, true)
        assert.equal(ease.options.ticker, null)
        assert.equal(ease.options.maxFrame, 1000 / 60)
        ease.destroy()
    })

    it('constructor with options', () => {
        const penner = Penner.easeInOutQuad
        const ticker = { add: () => {}, remove: () => {} }
        const ease = new Ease.Ease({ duration: 3000, ease: penner, maxFrame: Infinity, ticker })
        assert.equal(ease.options.duration, 3000)
        assert.equal(ease.options.ease, penner)
        assert.equal(ease.options.ticker, ticker)
        assert.equal(ease.options.maxFrame, Infinity)
        ease.destroy()
    })

    it('constructor with no ticker', () => {
        const ease = new Ease.Ease({ useRAF: null })
        const e = ease.add({ x: 5 }, { x: 10 })
        let each = false
        e.on('each', () => each = true)
        requestAnimationFrame(() => {
            assert.isFalse(each)
        })
    })

    it('x, y', () => {
        const ease = new Ease.Ease()
        const object = { x: 0, y: 0 }
        const e = ease.add(object, { x: 10, y: 20 }, { ease: 'linear', repeat: 1 })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.x, 10 * percent, CLOSE_TO)
            assert.closeTo(object.y, 20 * percent, CLOSE_TO)
        })
        ease.on('complete', () => ease.destroy())
    })

    it('position', () => {
        const ease = new Ease.Ease()
        const object = { x: 0, y: 0 }
        const e = ease.add(object, { position: { x: 20, y: 10 } }, { ease: 'linear', reverse: true })
        let reversed = false
        e.on('reverse', () => reversed = true)
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.x, 20 * (reversed ? 1 - percent : percent), CLOSE_TO)
            assert.closeTo(object.y, 10 * (reversed ? 1 - percent : percent), CLOSE_TO)
        })
        ease.on('complete', () => {
            assert.isTrue(reversed)
            ease.destroy()
        })
    })

    it('width, height', () => {
        const ease = new Ease.Ease()
        const object = { width: 0, height: 0 }
        const e = ease.add(object, { width: 20, height: 30 }, { ease: 'linear' })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.width, 20 * percent, CLOSE_TO)
            assert.closeTo(object.height, 30 * percent, CLOSE_TO)
        })
        ease.on('complete', () => ease.destroy())
    })

    it('scale', () => {
        const ease = new Ease.Ease()
        const object = { scale: { x: 0, y: 0 } }
        const e = ease.add(object, { scale: 10 }, { ease: 'linear', repeat: 1 })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.scale.x, 10 * percent, CLOSE_TO)
            assert.closeTo(object.scale.y, 10 * percent, CLOSE_TO)
        })
        ease.on('complete', () => ease.destroy())
    })

    it('scaleX, scaleY', () => {
        const ease = new Ease.Ease()
        const object = { scale: { x: 0, y: 0 } }
        const e = ease.add(object, { scaleX: 10, scaleY: 20 }, { ease: 'linear', repeat: 1 })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.scale.x, 10 * percent, CLOSE_TO)
        })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.scale.y, 20 * percent, CLOSE_TO)
        })
        ease.on('complete', () => ease.destroy())
    })

    it('alpha (and negative easing)', () => {
        const ease = new Ease.Ease()
        const object = { alpha: 1 }
        const e = ease.add(object, { alpha: 0 }, { ease: 'linear' })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.alpha, 1 - percent, CLOSE_TO)
        })
        ease.on('complete', () => ease.destroy())
    })

    it('rotation (and reverse: true)', () => {
        const ease = new Ease.Ease()
        const object = { rotation: 0 }
        const e = ease.add(object, { rotation: Math.PI }, { ease: 'linear', reverse: true })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.rotation, reversed ? Math.PI * (1 - percent) : Math.PI * percent, CLOSE_TO)
        })
        let reversed = false
        e.on('reverse', () => reversed = true)
        ease.on('complete', () => {
            assert.isTrue(reversed)
            ease.destroy()
        })
    })

    it('face-complicated', () => {
        const ease = new Ease.Ease({ ease: 'linear' })
        const object = { x: 0, y: 0, rotation: 0 }
        const target = { x: 20, y: 20 }
        const e = ease.add(object, { face: target })
        const face = Math.atan2(target.y - object.y, target.x - object.x)
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.rotation, face * percent, CLOSE_TO)
        })
        ease.on('complete', () => ease.destroy())
    })

    it('skew', () => {
        const ease = new Ease.Ease()
        const object = { skew: { x: 0, y: 0 } }
        const e = ease.add(object, { skew: 10 }, { ease: 'linear', repeat: 1 })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.skew.x, 10 * percent, CLOSE_TO)
            assert.closeTo(object.skew.y, 10 * percent, CLOSE_TO)
        })
        ease.on('complete', () => ease.destroy())
    })

    it('skewX, skewY', () => {
        const ease = new Ease.Ease()
        const object = { skew: { x: 0, y: 0 } }
        const e = ease.add(object, { skewX: 10, skewY: 20 }, { ease: 'linear', repeat: 1 })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.skew.x, 10 * percent, CLOSE_TO)
            assert.closeTo(object.skew.y, 20 * percent, CLOSE_TO)
        })
        ease.on('complete', () => ease.destroy())
    })

    it('tint (and Ease.ease)', () => {
        const object = { tint: 0 }
        const e = Ease.ease.add(object, { tint: [1, 2, 3] }, { ease: 'linear' })
        const interval = 1000 / 3
        e.on('each', results => {
            if (results.time < interval)
            {
                assert.equal(object.tint, 1)
            }
            else if (results.time < interval * 2)
            {
                assert.equal(object.tint, 2)
            }
            else if (results.time < interval * 3)
            {
                assert.equal(object.tint, 3)
            }
        })
        Ease.ease.on('complete', () => Ease.ease.destroy())
    })

    it('blend', () => {
        // todo: make this a better test for blend
        const object = { tint: 0xffffff }
        const ease = new Ease.Ease({ ease: 'linear' })
        ease.add(object, { blend: 0 }, { reverse: true })
        ease.on('reverse', () => assert.equal(object.tint, 0))
        ease.on('complete', () => {
            assert.equal(object.tint, 0xffffff)
            ease.destroy()
        })
    })

    it('generic (repeat: 2)', () => {
        const object = { generic: 0 }
        const ease = new Ease.Ease({ ease: 'linear' })
        const e = ease.add(object, { generic: 10 }, { repeat: 2 })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.generic, percent * 10, CLOSE_TO)
        })
        let count = 0
        e.on('repeat', () => count++)
        ease.on('complete', () => {
            assert.equal(count, 2)
            ease.destroy()
        })
    })

    it('generic (wait)', () => {
        const object = { generic: 0 }
        const ease = new Ease.Ease({ ease: 'linear' })
        const e = ease.add(object, { generic: 10 }, { wait: 100 })
        let waitGeneric = false
        let waitEndGeneric = false
        e.once('wait', () => waitGeneric = true)
        e.on('wait-end', () => waitEndGeneric = true)
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.generic, percent * 10, CLOSE_TO)
        })
        ease.on('complete', () => {
            assert.isTrue(waitGeneric)
            assert.isTrue(waitEndGeneric)
            ease.destroy()
        })
    })

    it('shake', () => {
        const ease = new Ease.Ease()
        const object = { x: 0, y: 0 }
        const e = ease.add(object, { shake: 5 }, { duration: 100 })
        e.on('each', () => {
            assert.isAtLeast(object.x, -5)
            assert.isAtMost(object.x, 5)
            assert.isAtLeast(object.y, -5)
            assert.isAtMost(object.y, 5)
        })
        e.on('complete', () => {
            assert.equal(object.x, 0)
            assert.equal(object.y, 0)
            ease.destroy()
        })
    })

    it('count, removeAll', () => {
        const ease = new Ease.Ease()
        const object = { x: 0, y: 0, rotation: 0, tint: 0 }
        ease.add(object, { x: 10 })
        ease.add(object, { y: 10 })
        ease.add(object, { rotation: Math.PI })
        assert.equal(ease.count, 3)
        ease.removeAll()
        assert.equal(ease.count, 0)
        ease.destroy()
    })

    it('duration, ease', () => {
        const ease = new Ease.Ease()
        ease.duration = 500
        assert.equal(ease.duration, 500)
        ease.ease = 'easeInOutQuad'
        assert.equal(ease.ease, 'easeInOutQuad')
        const e = ease.add({ x: 0 }, { x: 5 })
        assert.equal(e.options.duration, 500)
        assert.isFunction(e.options.ease)
        ease.destroy()
    })

    it('removeEase', () => {
        const ease = new Ease.Ease()
        const object = { x: 0, y: 0, rotation: 0 }
        const e = ease.add(object, { x: 5, y: 2, rotation: Math.PI })
        assert.equal(e.count, 3)
        ease.removeEase(object, 'x')
        assert.equal(e.count, 2)
        ease.removeEase(object, ['y', 'rotation'])
        assert.equal(e.count, 0)
        ease.destroy()
    })

    it('multiple object eases', () => {
        const ease = new Ease.Ease()
        const object1 = { x: 0, y: 0 }
        const object2 = { x: 10, y: 10 }
        const e = ease.add([object1, object2], { position: { x: 20, y: 30 } }, { ease: 'linear', repeat: 1 })
        e.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object1.x, 20 * percent, CLOSE_TO)
            assert.closeTo(object1.y, 30 * percent, CLOSE_TO)
            assert.closeTo(object2.x, 10 + 10 * percent, CLOSE_TO)
            assert.closeTo(object2.y, 10 + 20 * percent, CLOSE_TO)
        })
        let complete = false
        e.on('complete', () => complete = true)
        ease.on('complete', () => {
            assert.isTrue(complete)
            ease.destroy()
        })
    })

    it('removeEase with multiple elements and one param', () => {
        const ease = new Ease.Ease()
        const object1 = { x: 0, y: 0 }
        const object2 = { x: 10, y: 10 }
        const e1 = ease.add(object1, { x: 20, y: 20 }, { ease: 'linear' })
        const e2 = ease.add(object2, { x: 20, y: 20 }, { ease: 'linear' })
        assert.equal(e1.count, 2)
        assert.equal(e2.count, 2)
        ease.removeEase(null, ['x'])
        assert.equal(e1.count, 1)
        assert.equal(e2.count, 1)
        ease.destroy()
    })

    it('Ease.list deprecated message', () => {
        new Ease.List()
    })

    it('multiple eases on same object', () => {
        const ease = new Ease.Ease({ ease: 'linear' })
        const object = { x: 0, y: 0 }
        const e1 = ease.add(object, { x: 10 })
        e1.on('each', results => {
            const percent = results.time / 1000
            assert.closeTo(object.x, percent * 10, CLOSE_TO)
        })
        requestAnimationFrame(() =>
        {
            const e2 = ease.add(object, { y: 20 })
            e2.on('each', results => {
                const percent = results.time / 1000
                assert.closeTo(object.y, percent * 20, CLOSE_TO)
            })
        })
        ease.on('complete', () => ease.destroy())
    })

    it('destroyed element', () => {
        const ease = new Ease.Ease()
        const object = { x: 0 }
        ease.add(object, { x: 10 })
        requestAnimationFrame(() => {
            object._destroyed = true
            requestAnimationFrame(() => {
                assert.equal(ease.countRunning(), 0)
                ease.destroy()
            })
        })
    })

    it('target', () => {
        const ease = new Ease.Ease({ ease: 'linear' })
        const object = { x: 0, y: 0 }
        const target = { x: 100, y: 100 }
        ease.target(object, target, 1)
        ease.once('each', () => {
            assert.closeTo(object.x, 12, 3)
            assert.closeTo(object.y, 12, 3)
            ease.destroy()
        })
    })

    it('face', () => {
        const ease = new Ease.Ease({ ease: 'linear' })
        const object = { x: 0, y: 0, rotation: 0 }
        const target = { x: 100, y: 100 }
        ease.face(object, target, 0.01)
        ease.once('each', () => {
            assert.closeTo(object.rotation, 0.16, 0.1)
            ease.destroy()
        })
    })

    it('removeEase-2', () => {
        const ease = new Ease.Ease()
        const object1 = { x: 0, y: 0 }
        ease.add(object1, { x: 5 })
        ease.add(object1, { y: 5 })
        const object2 = { x: 0, y: 0 }
        ease.add(object2, { y: 5 })
        ease.removeEase(object1)
        assert.equal(ease.count, 1)
        ease.removeEase(object2)
        assert.equal(ease.count, 0)
        ease.destroy()
    })

    it('Cleaning up...', () => {
        Ease.ease.destroy()
    })
})